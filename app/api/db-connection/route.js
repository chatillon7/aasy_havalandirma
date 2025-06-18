import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const ENV_PATH = path.join(process.cwd(), '.env');

export async function POST(request) {
  const { dbUrl } = await request.json();
  if (!dbUrl) return NextResponse.json({ error: 'dbUrl is required' }, { status: 400 });

  // .env dosyasını oku
  let envContent = '';
  try {
    envContent = fs.readFileSync(ENV_PATH, 'utf8');
  } catch (e) {
    // dosya yoksa oluştur
    envContent = '';
  }
  // DATABASE_URL satırını güncelle
  const newEnv = envContent
    .split('\n')
    .filter(line => !line.startsWith('DATABASE_URL='))
    .concat([`DATABASE_URL=${dbUrl}`])
    .join('\n');
  fs.writeFileSync(ENV_PATH, newEnv, 'utf8');

  // Bağlantı testini burada yapmak için child_process ile prisma db pull denenebilir
  // (isteğe bağlı, burada sadece dosyayı güncelliyoruz)

  return NextResponse.json({ success: true });
}
