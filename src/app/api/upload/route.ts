import { NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';

export async function POST(req: Request) {
  try {
    const formData = await req.json();
    const { name, base64 } = formData;

    const buffer = Buffer.from(base64.split(',')[1], 'base64');
    const uploadDir = path.join(process.cwd(), 'public/uploads');

    try {
      await mkdir(uploadDir, { recursive: true });
    } catch (e) {}

    const fileName = `${Date.now()}-${name}`;
    const filePath = path.join(uploadDir, fileName);

    await writeFile(filePath, buffer);

    return NextResponse.json({ url: `/uploads/${fileName}` });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json({ error: 'Serverda xatolik' }, { status: 500 });
  }
}
