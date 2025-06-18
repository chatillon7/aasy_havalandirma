import { NextResponse } from 'next/server';
import path from 'path';
import { promises as fs } from 'fs';

export const runtime = 'nodejs';

export async function GET() {
  try {
    const dbPath = path.resolve(process.cwd(), 'prisma', 'db.sqlite');
    const fileBuffer = await fs.readFile(dbPath);
    return new Response(fileBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/octet-stream',
        'Content-Disposition': 'attachment; filename="db.sqlite"',
      },
    });
  } catch (e) {
    return NextResponse.json({ error: e.message || 'Yedek dosyası indirilemedi.' }, { status: 500 });
  }
}
