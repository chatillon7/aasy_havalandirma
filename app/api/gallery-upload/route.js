import { NextResponse } from 'next/server';
import path from 'path';
import { promises as fs } from 'fs';

export const runtime = 'nodejs';

export async function POST(request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file');
    if (!file) {
      return NextResponse.json({ error: 'Dosya bulunamadı.' }, { status: 400 });
    }
    const buffer = Buffer.from(await file.arrayBuffer());
    const ext = path.extname(file.name) || '.jpg';
    const fileName = `gallery_${Date.now()}${ext}`;
    const filePath = path.join(process.cwd(), 'public', fileName);
    await fs.writeFile(filePath, buffer);
    return NextResponse.json({ url: `/${fileName}` });
  } catch (e) {
    return NextResponse.json({ error: e.message || 'Bilinmeyen bir hata oluştu.' }, { status: 500 });
  }
}
