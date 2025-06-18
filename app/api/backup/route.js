import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { PrismaClient } from '@prisma/client';

// Prisma client'ı doğrudan burada oluştur
const prisma = new PrismaClient();

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
    // Prisma client kontrolü
    if (!prisma) {
      return NextResponse.json({ 
        error: 'Prisma client düzgün başlatılamadı.',
        debug: {
          databaseUrl: !!process.env.DATABASE_URL,
          directUrl: !!process.env.DIRECT_URL
        }
      }, { status: 500 });
    }

    // Veritabanı bağlantısını test et
    try {
      await prisma.$connect();
    } catch (connectError) {
      return NextResponse.json({ 
        error: `Veritabanı bağlantı hatası: ${connectError.message}` 
      }, { status: 500 });
    }
    
    // Tüm tabloları güvenli şekilde export et
    let settings = [];
    try {
      settings = await prisma.setting.findMany();
    } catch (e) {
      console.error('Settings findMany error:', e);
    }
    
    let homepageContent = [];
    try {
      homepageContent = await prisma.homepageContent.findMany();
    } catch (e) {
      console.error('HomepageContent findMany error:', e);
    }
    
    let galleryItems = [];
    try {
      galleryItems = await prisma.galleryItem.findMany();
    } catch (e) {
      console.error('GalleryItem findMany error:', e);
    }
    
    let products = [];
    try {
      products = await prisma.product.findMany();
    } catch (e) {
      console.error('Product findMany error:', e);
    }
    
    let contactContent = [];
    try {
      contactContent = await prisma.contactContent.findMany();
    } catch (e) {
      console.error('ContactContent findMany error:', e);
    }
    
    let users = [];
    try {
      users = await prisma.user.findMany();
    } catch (e) {
      console.error('User findMany error:', e);
    }
    
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
    console.error('Backup POST error:', e);
    return NextResponse.json({ 
      success: false, 
      error: `Backup POST hatası: ${e.message}`,
      stack: e.stack 
    }, { status: 500 });
  } finally {
    try {
      await prisma.$disconnect();
    } catch (disconnectError) {
      console.error('Prisma disconnect error:', disconnectError);
    }
  }
}
