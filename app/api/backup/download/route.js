import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export const runtime = 'nodejs';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const fileName = searchParams.get('file');
    
    if (!fileName) {
      return NextResponse.json({ error: 'Dosya adı belirtilmedi.' }, { status: 400 });
    }
    
    // Supabase Storage'dan dosyayı indir
    const { data, error } = await supabase.storage
      .from('backups')
      .download(fileName);
    
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 404 });
    }
    
    // Dosyayı response olarak döndür
    const buffer = await data.arrayBuffer();
    return new Response(buffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Content-Disposition': `attachment; filename="${fileName}"`,
      },
    });
  } catch (e) {
    return NextResponse.json({ error: e.message || 'Yedek dosyası indirilemedi.' }, { status: 500 });
  }
}
