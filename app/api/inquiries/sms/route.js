import prisma from '@/lib/prisma';
import { NextResponse } from 'next/server';
import twilio from 'twilio';

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const fromNumber = process.env.TWILIO_PHONE_NUMBER;
const client = accountSid && authToken ? twilio(accountSid, authToken) : null;

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');
  if (!id) return NextResponse.json({ error: 'ID gerekli.' }, { status: 400 });
  const inquiry = await prisma.inquiry.findUnique({ where: { id: Number(id) } });
  if (!inquiry) return NextResponse.json({ error: 'Talep bulunamadı.' }, { status: 404 });
  if (!client) return NextResponse.json({ error: 'Twilio yapılandırılmadı.' }, { status: 500 });
  try {
    const sms = await client.messages.create({
      body: `Sayın ${inquiry.fullName}, talebiniz alınmıştır.`,
      from: fromNumber,
      to: inquiry.phone.startsWith('+') ? inquiry.phone : `+90${inquiry.phone.replace(/^0/, '')}`
    });
    return NextResponse.json({ success: true, sid: sms.sid });
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
