import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

// Prisma client'ı doğrudan burada oluştur
const prisma = new PrismaClient();

// POST: Veritabanı sıfırlama (tüm tabloları temizle)
export async function POST() {
  try {
    // Prisma bağlantısını test et
    if (!prisma) {
      return NextResponse.json({ error: 'Prisma client başlatılamadı.' }, { status: 500 });
    }

    await prisma.$connect();
    
    // Tüm tabloları sıfırla (ters sırayla foreign key sorunlarını önlemek için)
    const results = {};
    
    try {
      results.galleryItems = await prisma.galleryItem.deleteMany();
    } catch (e) {
      console.log('GalleryItem delete error (normal if table empty):', e.message);
      results.galleryItems = { count: 0 };
    }
    
    try {
      results.products = await prisma.product.deleteMany();
    } catch (e) {
      console.log('Product delete error (normal if table empty):', e.message);
      results.products = { count: 0 };
    }
    
    try {
      results.contactContent = await prisma.contactContent.deleteMany();
    } catch (e) {
      console.log('ContactContent delete error (normal if table empty):', e.message);
      results.contactContent = { count: 0 };
    }
    
    try {
      results.homepageContent = await prisma.homepageContent.deleteMany();
    } catch (e) {
      console.log('HomepageContent delete error (normal if table empty):', e.message);
      results.homepageContent = { count: 0 };
    }
    
    try {
      results.settings = await prisma.setting.deleteMany();
    } catch (e) {
      console.log('Setting delete error (normal if table empty):', e.message);
      results.settings = { count: 0 };
    }

    // Users tablosunu sıfırlama (dikkatli ol!)
    try {
      results.users = await prisma.user.deleteMany();
    } catch (e) {
      console.log('User delete error (normal if table empty):', e.message);
      results.users = { count: 0 };
    }
    
    const totalDeleted = Object.values(results).reduce((sum, result) => sum + (result.count || 0), 0);
    
    return NextResponse.json({ 
      success: true,
      message: `Veritabanı başarıyla sıfırlandı. Toplam ${totalDeleted} kayıt silindi.`,
      deletedCounts: {
        settings: results.settings.count || 0,
        homepageContent: results.homepageContent.count || 0,
        galleryItems: results.galleryItems.count || 0,
        products: results.products.count || 0,
        contactContent: results.contactContent.count || 0,
        users: results.users.count || 0
      }
    });
  } catch (e) {
    console.error('Database reset error:', e);
    return NextResponse.json({ 
      success: false, 
      error: `Veritabanı sıfırlama hatası: ${e.message}` 
    }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}
