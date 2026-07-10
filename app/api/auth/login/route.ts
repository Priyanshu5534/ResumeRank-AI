import { NextRequest } from 'next/server';
import bcrypt from 'bcryptjs';
import { prisma } from '@/lib/prisma';
import { generateToken } from '@/lib/jwt';
import { loginSchema } from '@/lib/validations/auth';
import { successResponse, errorResponse, validationError } from '@/lib/api-response';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const result = loginSchema.safeParse(body);
    if (!result.success) return validationError(result.error.issues);

    const { email, password } = result.data;
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return errorResponse('Invalid email or password', 401);

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) return errorResponse('Invalid email or password', 401);

    const token = generateToken({ id: user.id, email: user.email, role: user.role });

    const response = successResponse(
      { id: user.id, name: user.name, email: user.email, role: user.role },
      'Login successful'
    );
    
    // Set cookie
    response.cookies.set('auth_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: '/',
    });
    
    return response;
  } catch (error) {
    console.error('[LOGIN]', error);
    return errorResponse('Internal server error');
  }
}
