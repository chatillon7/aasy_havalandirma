// Bu dosya kaldırıldı. Twilio SMS API entegrasyonu devre dışı bırakıldı.
export function GET() {
  return Response.json({ error: 'SMS API devre dışı.' }, { status: 410 });
}
