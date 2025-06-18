import React from "react";
import LogoutButton from "./auth/logout-button";

export default function AdminMenu() {
  return (
    <div className="list-group mb-4">
      <a href="/admin/products" className="list-group-item list-group-item-action">Hizmetler / Ürünler</a>
      <a href="/admin/gallery" className="list-group-item list-group-item-action">Galeri</a>
      <a href="/admin/contact" className="list-group-item list-group-item-action">İletişim Bilgileri</a>
      <a href="/admin/inquiries" className="list-group-item list-group-item-action">Talepler</a>
      <a href="/admin/homepage" className="list-group-item list-group-item-action">Anasayfa İçeriği</a>
      <a href="/admin/settings" className="list-group-item list-group-item-action">Site Ayarları</a>
      <a href="/admin/backup" className="list-group-item list-group-item-action">Veritabanı Yedekle/Sıfırla</a>
      <div className="list-group-item p-0 border-0 bg-transparent">
        <LogoutButton />
      </div>
    </div>
  );
}
