import { NextResponse } from 'next/server';

export function successResponse<T>(data: T, message?: string, status = 200) {
  return NextResponse.json(
    { success: true, data, message },
    { status }
  );
}

export function errorResponse(error: string, status = 500) {
  return NextResponse.json(
    { success: false, error },
    { status }
  );
}

export function validationError(errors: unknown) {
  return NextResponse.json(
    { success: false, error: 'Validation failed', details: errors },
    { status: 422 }
  );
}

export function notFoundError(entity = 'Resource') {
  return NextResponse.json(
    { success: false, error: `${entity} not found` },
    { status: 404 }
  );
}

export function unauthorizedError(message = 'Unauthorized') {
  return NextResponse.json(
    { success: false, error: message },
    { status: 401 }
  );
}

export function forbiddenError(message = 'Forbidden') {
  return NextResponse.json(
    { success: false, error: message },
    { status: 403 }
  );
}
