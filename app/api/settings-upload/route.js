import { NextResponse } from 'next/server';
import path from 'path';
import { promises as fs } from 'fs';

export const runtime = 'nodejs';

export async function POST(request) {
  const formData = await request.formData();
  const file = formData.get('file');
  if (!file) {
    return NextResponse.json({ error: 'Dosya bulunamadı.' }, { status: 400 });
  }
  const buffer = Buffer.from(await file.arrayBuffer());
  const ext = path.extname(file.name) || '.png';
  const fileName = `siteicon_${Date.now()}${ext}`;
  const filePath = path.join(process.cwd(), 'public', fileName);
  await fs.writeFile(filePath, buffer);
  return NextResponse.json({ url: `/${fileName}` });
}
