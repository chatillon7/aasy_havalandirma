import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import prisma from '@/lib/prisma';

// GET: Veritabanı yedek dosyasını Supabase Storage'dan indir
export async function GET() {
  try {
    // Supabase Storage'daki en son backup dosyasını listele
    const { data: files, error } = await supabase.storage
      .from('backups')
      .list('', {
        limit: 1,
        sortBy: { column: 'created_at', order: 'desc' }
      });
    
    if (error || !files || files.length === 0) {
      return NextResponse.json({ error: 'Yedek dosyası bulunamadı.' }, { status: 404 });
    }
    
    // Public URL döndür
    const { data: publicUrlData } = supabase.storage
      .from('backups')
      .getPublicUrl(files[0].name);
    
    return NextResponse.json({ 
      downloadUrl: publicUrlData.publicUrl,
      fileName: files[0].name,
      createdAt: files[0].created_at
    });
  } catch (e) {
    return NextResponse.json({ error: e.message || 'Bilinmeyen bir hata oluştu.' }, { status: 500 });
  }
}

// POST: Veritabanı yedekleme (JSON export)
export async function POST() {
  try {
    // Tüm tabloları export et
    const settings = await prisma.setting.findMany();
    const homepageContent = await prisma.homepageContent.findMany();
    const galleryItems = await prisma.galleryItem.findMany();
    const products = await prisma.product.findMany();
    const contactContent = await prisma.contactContent.findMany();
    const users = await prisma.user.findMany();
    
    const backupData = {
      exportDate: new Date().toISOString(),
      settings,
      homepageContent,
      galleryItems,
      products,
      contactContent,
      users: users.map(u => ({ ...u, password: undefined })) // Şifreleri dahil etme
    };
    
    const backupJson = JSON.stringify(backupData, null, 2);
    const fileName = `backup_${Date.now()}.json`;
    
    // Supabase Storage'a yedek dosyası yükle
    const { data, error } = await supabase.storage
      .from('backups')
      .upload(fileName, backupJson, {
        contentType: 'application/json',
        upsert: false
      });
    
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    
    return NextResponse.json({ 
      success: true, 
      fileName: fileName,
      message: 'Yedek başarıyla oluşturuldu.'
    });
  } catch (e) {
    return NextResponse.json({ success: false, error: e.message || 'Bilinmeyen bir hata oluştu.' }, { status: 500 });
  }
}
