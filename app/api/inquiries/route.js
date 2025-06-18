import prisma from '@/lib/prisma';
import { NextResponse } from 'next/server';

// GET: Tüm talepleri listele
export async function GET(request) {
  const { searchParams } = new URL(request.url);
  if (searchParams.has('sms')) {
    // /api/inquiries?sms=1&id=... gibi çağrılırsa
    const id = searchParams.get('id');
    if (!id) return NextResponse.json({ error: 'ID gerekli.' }, { status: 400 });
    const inquiry = await prisma.inquiry.findUnique({ where: { id: Number(id) } });
    if (!inquiry) return NextResponse.json({ error: 'Talep bulunamadı.' }, { status: 404 });
    // Burada gerçek SMS servisi entegre edilebilir
    console.log(`SMS gönderildi: ${inquiry.phone}`);
    return NextResponse.json({ success: true, message: 'SMS gönderildi (simülasyon)' });
  }
  const inquiries = await prisma.inquiry.findMany({
    orderBy: { id: 'desc' },
  });
  return NextResponse.json(inquiries);
}

// POST: Yeni talep ekle (kullanıcı formundan)
export async function POST(request) {
  try {
    const data = await request.json();
    if (!data.fullName || !data.phone || !data.product || !data.area) {
      return NextResponse.json({ error: 'Zorunlu alanlar eksik.' }, { status: 400 });
    }
    const inquiry = await prisma.inquiry.create({
      data: {
        fullName: data.fullName,
        phone: data.phone,
        product: data.product,
        extraInfo: `Alan: ${data.area} m²\n${data.extraInfo || ''}`,
      },
    });
    return NextResponse.json(inquiry);
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

// Silme işlemi
export async function DELETE(request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');
  if (!id) return NextResponse.json({ error: 'ID gerekli.' }, { status: 400 });
  await prisma.inquiry.delete({ where: { id: Number(id) } });
  return NextResponse.json({ success: true });
}
