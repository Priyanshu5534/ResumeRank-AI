import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAuthPayload } from '@/lib/auth';
import { extractTextFromBuffer, extractBasicInfo } from '@/services/resume-parser';
import { parseResumeWithAI } from '@/services/ai';
import { successResponse, errorResponse, unauthorizedError } from '@/lib/api-response';

export const maxDuration = 60; // Allow enough time for PDF parsing and local NLP extraction

export async function POST(request: NextRequest) {
  try {
    const payload = getAuthPayload(request);
    if (!payload) return unauthorizedError();

    const formData = await request.formData();
    const file = formData.get('file') as File | null;
    const candidateId = formData.get('candidateId') as string | null;

    if (!file) {
      return errorResponse('No file uploaded', 400);
    }
    if (!candidateId) {
      return errorResponse('candidateId is required', 400);
    }

    const candidate = await prisma.candidate.findUnique({
      where: { id: candidateId },
    });
    if (!candidate) {
      return errorResponse('Candidate not found', 404);
    }

    // Validate file type (case-insensitive)
    const fileNameLower = file.name.toLowerCase();
    const allowedTypes = [
      'application/pdf',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'text/plain',
    ];
    if (
      !allowedTypes.includes(file.type) &&
      !fileNameLower.endsWith('.pdf') &&
      !fileNameLower.endsWith('.docx') &&
      !fileNameLower.endsWith('.txt')
    ) {
      return errorResponse('Invalid file type. Please upload a PDF, DOCX, or TXT file.', 400);
    }

    // Limit size to 10MB
    if (file.size > 10 * 1024 * 1024) {
      return errorResponse('File is too large. Maximum size is 10MB.', 400);
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    
    // Extract text from buffer
    const mimeType = fileNameLower.endsWith('.pdf')
      ? 'application/pdf'
      : fileNameLower.endsWith('.txt')
      ? 'text/plain'
      : 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
    const rawText = await extractTextFromBuffer(buffer, mimeType);

    // Call local AI parser to extract structured information
    let parsedData: any = null;
    try {
      parsedData = await parseResumeWithAI(rawText);
    } catch (aiErr) {
      console.warn('AI Parsing failed, using basic extraction:', aiErr);
    }

    if (!parsedData || Object.keys(parsedData).length === 0) {
      parsedData = {
        ...extractBasicInfo(rawText),
        summary: rawText.slice(0, 300),
      };
    }

    // Save to Database
    const resume = await prisma.resume.upsert({
      where: { candidateId },
      create: {
        fileName: file.name,
        rawText,
        parsedData: (parsedData as any) || undefined,
        contentType: mimeType,
        fileSize: file.size,
        candidateId,
      },
      update: {
        fileName: file.name,
        rawText,
        parsedData: (parsedData as any) || undefined,
        contentType: mimeType,
        fileSize: file.size,
      },
    });

    // Auto-fill candidate profile details from parsed data if empty
    const updateData: any = {};
    if (parsedData?.name && (!candidate.name || candidate.name === 'Default Candidate' || candidate.name === 'New Candidate')) {
      updateData.name = parsedData.name;
    }
    if (parsedData?.email && (!candidate.email || candidate.email === '')) {
      updateData.email = parsedData.email;
    }
    if (parsedData?.phone && !candidate.phone) {
      updateData.phone = parsedData.phone;
    }
    
    if (Object.keys(updateData).length > 0) {
      await prisma.candidate.update({
        where: { id: candidateId },
        data: updateData,
      });
    }

    // Create Activity Log
    await prisma.activityLog.create({
      data: {
        action: 'UPLOAD',
        entity: 'RESUME',
        entityId: resume.id,
        description: `Uploaded resume for ${candidate.name || parsedData?.name || 'candidate'}`,
        userId: payload.id,
        jobId: candidate.jobId,
      },
    });

    return successResponse({ resume, parsedData }, 'Resume uploaded and processed successfully', 201);
  } catch (error) {
    console.error('[UPLOAD_RESUME]', error);
    return errorResponse(error instanceof Error ? error.message : 'Internal server error');
  }
}
