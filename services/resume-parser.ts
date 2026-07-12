import type { ParsedResumeData } from '@/types';

export async function extractTextFromBuffer(
  buffer: Buffer,
  mimeType: string
): Promise<string> {
  if (mimeType === 'application/pdf' || mimeType.includes('pdf')) {
    try {
      const PDFParserMod: any = await import('pdf2json');
      const PDFParser = PDFParserMod.default || PDFParserMod;
      const text = await new Promise<string>((resolve, reject) => {
        const pdfParser = new PDFParser(null, 1);
        pdfParser.on('pdfParser_dataError', (errData: any) => reject(errData.parserError));
        pdfParser.on('pdfParser_dataReady', () => {
          resolve(pdfParser.getRawTextContent());
        });
        pdfParser.parseBuffer(buffer);
      });
      return text;
    } catch (err) {
      console.warn('PDF parsing fallback applied:', err);
      return buffer.toString('utf-8').replace(/[^\x20-\x7E\n]/g, ' ');
    }
  }

  if (
    mimeType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
    mimeType.includes('docx') ||
    mimeType.includes('word')
  ) {
    const mammoth = await import('mammoth');
    const result = await mammoth.extractRawText({ buffer });
    return result.value;
  }

  if (mimeType === 'text/plain') {
    return buffer.toString('utf-8');
  }

  throw new Error(`Unsupported file type: ${mimeType}. Please upload a PDF, DOCX, or TXT file.`);
}

export function extractBasicInfo(text: string): Partial<ParsedResumeData> {
  const emailMatch = text.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
  const phoneMatch = text.match(/[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}/);

  return {
    email: emailMatch?.[0],
    phone: phoneMatch?.[0],
  };
}
