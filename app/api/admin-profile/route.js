import prisma from '@/lib/prisma';
import { NextResponse } from 'next/server';
import bcrypt from 'bcrypt';

// GET: Admin profilini getir
export async function GET() {
  // Sadece ilk admin (tek kullanıcı) döndürülür
  const user = await prisma.user.findFirst({ where: { role: 'ADMIN' } });
  if (!user) return NextResponse.json({}, { status: 404 });
  // Şifreyi göndermiyoruz
  return NextResponse.json({ id: user.id, name: user.name, email: user.email });
}

// POST: Admin profilini güncelle
export async function POST(request) {
  const data = await request.json();
  const { id, name, email, password } = data;
  const updateData = { name, email };
  if (password) {
    updateData.password = await bcrypt.hash(password, 10);
  }
  const user = await prisma.user.update({ where: { id }, data: updateData });
  return NextResponse.json({ id: user.id, name: user.name, email: user.email });
}
