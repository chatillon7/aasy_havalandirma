import prisma from '@/lib/prisma';
import { NextResponse } from 'next/server';

// GET: Galeri görsellerini listele
export async function GET() {
  const items = await prisma.galleryItem.findMany({ orderBy: { id: 'desc' } });
  return NextResponse.json(items);
}

// POST: Yeni galeri görseli ekle
export async function POST(request) {
  const data = await request.json();
  const item = await prisma.galleryItem.create({ data });
  return NextResponse.json(item);
}

// PUT: Galeri görseli güncelle (id ile)
export async function PUT(request) {
  const data = await request.json();
  const { id, ...rest } = data;
  const item = await prisma.galleryItem.update({ where: { id }, data: rest });
  return NextResponse.json(item);
}

// DELETE: Galeri görseli sil (id ile)
export async function DELETE(request) {
  const { id } = await request.json();
  await prisma.galleryItem.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
