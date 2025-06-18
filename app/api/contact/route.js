import prisma from '@/lib/prisma';
import { NextResponse } from 'next/server';

// GET: İletişim bilgilerini getir (tek kayıt)
export async function GET() {
  const info = await prisma.contactInfo.findFirst();
  return NextResponse.json(info);
}

// POST: İletişim bilgilerini güncelle veya oluştur
export async function POST(request) {
  const data = await request.json();
  let info = await prisma.contactInfo.findFirst();
  if (info) {
    info = await prisma.contactInfo.update({ where: { id: info.id }, data });
  } else {
    info = await prisma.contactInfo.create({ data });
  }
  return NextResponse.json(info);
}
