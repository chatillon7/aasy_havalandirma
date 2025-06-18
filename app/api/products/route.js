import prisma from '@/lib/prisma';
import { NextResponse } from 'next/server';

// GET: Tüm ürünleri listele veya id ile tek ürün getir
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    if (id) {
      const product = await prisma.product.findUnique({ where: { id: Number(id) } });
      if (!product) {
        return NextResponse.json({ error: 'Ürün bulunamadı.' }, { status: 404 });
      }
      return NextResponse.json(product);
    }
    const products = await prisma.product.findMany({ orderBy: { id: 'desc' } });
    return NextResponse.json(products);
  } catch (e) {
    return NextResponse.json({ error: e.message || 'Bilinmeyen bir hata oluştu.' }, { status: 500 });
  }
}

// POST: Yeni ürün ekle
export async function POST(request) {
  try {
    const data = await request.json();
    // Zorunlu alanlar kontrolü
    if (!data.name || !data.description || !data.imageUrl || !data.pricePerM2) {
      return NextResponse.json({ error: 'Eksik alanlar var.' }, { status: 400 });
    }
    // pricePerM2 sayıya çevrilmeli
    const price = parseFloat(data.pricePerM2);
    if (isNaN(price)) {
      return NextResponse.json({ error: 'Fiyat sayısal olmalı.' }, { status: 400 });
    }
    const product = await prisma.product.create({
      data: {
        name: data.name,
        description: data.description,
        imageUrl: data.imageUrl,
        pricePerM2: price,
        // contactInsteadOfBuy alanı kaldırıldı
      },
    });
    return NextResponse.json(product);
  } catch (e) {
    return NextResponse.json({ error: e.message || 'Bilinmeyen bir hata oluştu.' }, { status: 500 });
  }
}

// PUT: Ürün güncelle (id ile)
export async function PUT(request) {
  try {
    const data = await request.json();
    const { id, ...rest } = data;
    const product = await prisma.product.update({ where: { id }, data: {
      ...rest,
      contactInsteadOfBuy: undefined // backend'de de kaldırıldı
    }});
    return NextResponse.json(product);
  } catch (e) {
    return NextResponse.json({ error: e.message || 'Bilinmeyen bir hata oluştu.' }, { status: 500 });
  }
}

// DELETE: Ürün sil (id ile)
export async function DELETE(request) {
  try {
    const { id } = await request.json();
    await prisma.product.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (e) {
    return NextResponse.json({ error: e.message || 'Bilinmeyen bir hata oluştu.' }, { status: 500 });
  }
}
