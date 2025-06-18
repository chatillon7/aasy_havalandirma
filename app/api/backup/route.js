import { NextResponse } from 'next/server';
import { exec } from 'child_process';
import path from 'path';

// GET: Veritabanı dosyasını indir (yedek)
export async function GET() {
  try {
    const dbPath = path.resolve(process.cwd(), 'prisma', 'db.sqlite');
    return NextResponse.json({ dbPath });
  } catch (e) {
    return NextResponse.json({ error: e.message || 'Bilinmeyen bir hata oluştu.' }, { status: 500 });
  }
}

// POST: Veritabanını sıfırla
export async function POST() {
  try {
    return await new Promise((resolve) => {
      exec('npx prisma migrate reset --force', (error, stdout, stderr) => {
        if (error) {
          resolve(NextResponse.json({ success: false, error: stderr }, { status: 500 }));
        } else {
          resolve(NextResponse.json({ success: true, output: stdout }));
        }
      });
    });
  } catch (e) {
    return NextResponse.json({ success: false, error: e.message || 'Bilinmeyen bir hata oluştu.' }, { status: 500 });
  }
}
