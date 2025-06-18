export default function Admin() {
  return (
    <div className="container p-4">
      <h1>Admin Paneli</h1>
      <ul className="list-group mb-4 mt-4">
        <li className="list-group-item"><b>Ürünler:</b> Sitede listelenecek ürün ve hizmetleri ekleyip düzenleyebilirsiniz.</li>
        <li className="list-group-item"><b>Galeri:</b> Referans fotoğrafları ve görselleri yönetin.</li>
        <li className="list-group-item"><b>İletişim Bilgileri:</b> Firma adresi, telefon, e-posta ve harita bilgisini güncelleyin.</li>
        <li className="list-group-item"><b>Talepler:</b> Kullanıcıların iletişim/talep formlarından gelen başvurularını görüntüleyin, silin veya WhatsApp ile iletişime geçin.</li>
        <li className="list-group-item"><b>Anasayfa İçeriği:</b> Slider, video ve "Amacımız" gibi anasayfa bölümlerini yönetin.</li>
        <li className="list-group-item"><b>Site Ayarları:</b> Site adı ve logo (ve favicon) ayarlarını yapın.</li>
        <li className="list-group-item"><b>Veritabanı Yedekle/Sıfırla:</b> Veritabanını yedekleyin veya sıfırlayın.</li>
        <li className="list-group-item"><b>Hesap Bilgileri:</b> Admin kullanıcı adı, e-posta ve şifresini değiştirin.</li>
      </ul>
    </div>
  );
}
