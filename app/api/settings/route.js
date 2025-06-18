import prisma from '@/lib/prisma';
import { NextResponse } from 'next/server';

// GET: Site ayarlarını getir (tek kayıt)
export async function GET() {
  try {
    const settings = await prisma.siteSettings.findFirst();
    return NextResponse.json(settings || {});
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

// POST: Site ayarlarını güncelle veya oluştur
export async function POST(request) {
  const data = await request.json();
  // Sadece logoUrl ve siteName alanlarını kullan
  const { logoUrl, siteName } = data;
  let settings = await prisma.siteSettings.findFirst();
  if (settings) {
    settings = await prisma.siteSettings.update({ where: { id: settings.id }, data: { logoUrl, siteName } });
  } else {
    // tabTitle zorunlu, siteName ile aynı değeri verelim
    settings = await prisma.siteSettings.create({ data: { logoUrl, siteName, tabTitle: siteName } });
  }
  return NextResponse.json(settings);
}
