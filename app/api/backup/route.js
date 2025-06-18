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
    
    if (error) {
      return NextResponse.json({ error: `Storage hatası: ${error.message}` }, { status: 500 });
    }
    
    if (!files || files.length === 0) {
      return NextResponse.json({ error: 'Henüz yedek dosyası oluşturulmamış.' }, { status: 404 });
    }
    
    // Private bucket için signed URL oluştur (24 saat geçerli)
    const { data: signedUrlData, error: signedUrlError } = await supabase.storage
      .from('backups')
      .createSignedUrl(files[0].name, 86400); // 24 saat = 86400 saniye
    
    if (signedUrlError) {
      return NextResponse.json({ error: `Signed URL hatası: ${signedUrlError.message}` }, { status: 500 });
    }
    
    return NextResponse.json({ 
      downloadUrl: signedUrlData.signedUrl,
      fileName: files[0].name,
      createdAt: files[0].created_at,
      expiresIn: '24 saat'
    });
  } catch (e) {
    return NextResponse.json({ error: `Backup GET hatası: ${e.message}` }, { status: 500 });
  }
}

// POST: Veritabanı yedekleme (JSON export)
export async function POST() {
  try {
    // Tüm tabloları güvenli şekilde export et
    const settings = await prisma.setting.findMany().catch(() => []);
    const homepageContent = await prisma.homepageContent.findMany().catch(() => []);
    const galleryItems = await prisma.galleryItem.findMany().catch(() => []);
    const products = await prisma.product.findMany().catch(() => []);
    const contactContent = await prisma.contactContent.findMany().catch(() => []);
    const users = await prisma.user.findMany().catch(() => []);
    
    const backupData = {
      exportDate: new Date().toISOString(),
      tables: {
        settings,
        homepageContent,
        galleryItems,
        products,
        contactContent,
        users: users.map(u => ({ ...u, password: undefined })) // Şifreleri dahil etme
      },
      recordCounts: {
        settings: settings.length,
        homepageContent: homepageContent.length,
        galleryItems: galleryItems.length,
        products: products.length,
        contactContent: contactContent.length,
        users: users.length
      }
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
      return NextResponse.json({ error: `Storage upload hatası: ${error.message}` }, { status: 500 });
    }
    
    return NextResponse.json({ 
      success: true, 
      fileName: fileName,
      message: 'Yedek başarıyla oluşturuldu.',
      recordCounts: backupData.recordCounts
    });
  } catch (e) {
    return NextResponse.json({ success: false, error: `Backup POST hatası: ${e.message}` }, { status: 500 });
  }
}
