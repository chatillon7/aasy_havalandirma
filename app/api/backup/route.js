import { NextResponse } from 'next/server';
import { exec } from 'child_process';
import path from 'path';

// GET: Veritabanı dosyasını indir (yedek)
export async function GET() {
  // Sadece dosya yolu döndürülüyor, gerçek download işlemi public dizine kopyalanarak yapılabilir
  const dbPath = path.resolve(process.cwd(), 'prisma', 'db.sqlite');
  return NextResponse.json({ dbPath });
}

// POST: Veritabanını sıfırla
export async function POST() {
  // Prisma migrate reset komutu ile sıfırlama yapılır
  return new Promise((resolve) => {
    exec('npx prisma migrate reset --force', (error, stdout, stderr) => {
      if (error) {
        resolve(NextResponse.json({ success: false, error: stderr }, { status: 500 }));
      } else {
        resolve(NextResponse.json({ success: true, output: stdout }));
      }
    });
  });
}
