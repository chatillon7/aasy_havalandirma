import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  const password = await bcrypt.hash('admin', 10);
  await prisma.user.upsert({
    where: { email: 'admin@admin.com' },
    update: {
      name: 'admin',
      password,
      role: 'ADMIN',
    },
    create: {
      name: 'admin',
      email: 'admin@admin.com',
      password,
      role: 'ADMIN',
    },
  });
  console.log('Admin user seeded.');

  // HomepageContent seed
  await prisma.homepageContent.upsert({
    where: { id: 1 },
    update: {},
    create: {
      videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
      purpose: "Yılların verdiği deneyimle Ankara'daki Havalandırma firmaları arasında en iyilerden biriyiz.\nYaptığımız işe hakimiz titiz çalışıyor ve  tüm sektördeki müşterilerimiz için kaliteli hizmet vermeyi firmamıza ilke edindik.\nYaptığımız işlerde maliyetleri müşteri memnuniyeti yönünde değerlendiriyor uygun fiyatlı çözümler sunuyoruz.\nMüşterilerimizin güvenli hizmet alabilmeleri için gereken tüm tedbirleri alıyoruz.",
      info: "Asya Havalandırma, sizlere ihtiyaç duyduğunuz havalandırma sistemlerini profesyonel olarak sunar."
    },
  });
  console.log('Homepage content seeded.');

  // SiteSettings seed
  await prisma.siteSettings.upsert({
    where: { id: 1 },
    update: {},
    create: {
      logoUrl: '/siteicon_1749739708779.png',
      tabTitle: 'Asya Havalandırma',
      siteName: 'Asya Havalandırma'
    },
  });
  console.log('Site settings seeded.');

  // ContactInfo seed
  await prisma.contactInfo.upsert({
    where: { id: 1 },
    update: {},
    create: {
      mapUrl: 'https://yandex.com.tr/map-widget/v1/-/CHShQEjx',
      phone: '05057519045',
      address: 'Ostim OSB Mh. 1129 Sk. No: 5 Yenimahalle/Ankara',
      email: 'mahmutpiri0@gmail.com'
    },
  });
  console.log('Contact info seeded.');

  // Gallery seed
  await prisma.galleryItem.deleteMany();
  await prisma.galleryItem.createMany({
    data: [
      { imageUrl: "/gallery_1749741358853.jpeg", description: "Havalandırma Sistemi" },
      { imageUrl: "/gallery_1749741349086.jpeg", description: "Baca Uygulaması" }
    ]
  });
  console.log('Gallery seeded.');

  // Products seed
  await prisma.product.deleteMany();
  await prisma.product.createMany({
    data: [
      { name: "Elektrik Bağlantı Sistemleri", description: "Bu hizmetten yararlanmak için lütfen bizimle iletişime geçin.", imageUrl: "/gallery_1749744094659.jpeg", pricePerM2: 650, contactInsteadOfBuy: true }
    ]
  });
  console.log('Products seeded.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
