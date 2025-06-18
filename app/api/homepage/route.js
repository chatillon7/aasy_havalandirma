import prisma from '@/lib/prisma';
import { NextResponse } from 'next/server';

// GET: Anasayfa içeriğini getir (tek kayıt)
export async function GET() {
  const content = await prisma.homepageContent.findFirst();
  return NextResponse.json(content);
}

// POST: Anasayfa içeriğini güncelle veya oluştur
export async function POST(request) {
  const data = await request.json();
  // Sadece gönderilen alanları güncelle (sliderImages, videoUrl, purpose, info)
  let content = await prisma.homepageContent.findFirst();
  const updateData = {};
  if (typeof data.sliderImages !== 'undefined') updateData.sliderImages = data.sliderImages;
  if (typeof data.videoUrl !== 'undefined') updateData.videoUrl = data.videoUrl;
  if (typeof data.purpose !== 'undefined') updateData.purpose = data.purpose;
  if (typeof data.info !== 'undefined') updateData.info = data.info;
  if (content) {
    content = await prisma.homepageContent.update({ where: { id: content.id }, data: updateData });
  } else {
    content = await prisma.homepageContent.create({ data: {
      sliderImages: data.sliderImages || '',
      videoUrl: data.videoUrl || '',
      purpose: data.purpose || '',
      info: data.info || ''
    }});
  }
  return NextResponse.json(content);
}
