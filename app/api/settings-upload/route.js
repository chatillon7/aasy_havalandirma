import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import path from 'path';

export const runtime = 'nodejs';

export async function POST(request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file');
    if (!file) {
      return NextResponse.json({ error: 'Dosya bulunamadı.' }, { status: 400 });
    }
    
    const buffer = Buffer.from(await file.arrayBuffer());
    const ext = path.extname(file.name) || '.png';
    const fileName = `siteicon_${Date.now()}${ext}`;
    
    // Supabase Storage'a dosya yükleme
    const { data, error } = await supabase.storage
      .from('settings')
      .upload(fileName, buffer, {
        contentType: file.type || 'image/png',
        upsert: false
      });
    
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    
    // Public URL oluşturma
    const { data: publicUrlData } = supabase.storage
      .from('settings')
      .getPublicUrl(fileName);
    
    return NextResponse.json({ url: publicUrlData.publicUrl });
  } catch (e) {
    return NextResponse.json({ error: e.message || 'Bilinmeyen bir hata oluştu.' }, { status: 500 });
  }
}
