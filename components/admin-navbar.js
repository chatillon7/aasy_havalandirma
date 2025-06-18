"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import Image from "next/image";

export default function AdminNavbar() {
  const [logo, setLogo] = useState("/vercel.svg");
  const [siteName, setSiteName] = useState("HAVALANDIRMA");
  useEffect(() => {
    fetch("/api/settings")
      .then((res) => res.json())
      .then((data) => {
        if (data && data.logoUrl) setLogo(data.logoUrl);
        if (data && data.siteName) setSiteName(data.siteName);
      });
  }, []);
  return (
    <div className="d-flex flex-column align-items-stretch p-3">
      <Link
        className="navbar-brand fw-bold text-light d-flex align-items-center gap-2 mb-4"
        href="/admin"
        style={{ fontSize: 20 }}
      >
        <Image
          src={logo}
          alt="Logo"
          height={32}
          style={{ maxHeight: 32 }}
          width={32}
        />
      </Link>
      <nav className="nav nav-pills flex-column gap-2">
        <Link className="nav-link text-light" href="/admin/products">
          Ürünler
        </Link>
        <Link className="nav-link text-light" href="/admin/gallery">
          Galeri
        </Link>
        <Link className="nav-link text-light" href="/admin/contact">
          İletişim Bilgileri
        </Link>
        <Link className="nav-link text-light" href="/admin/inquiries">
          Talepler
        </Link>        <Link className="nav-link text-light" href="/admin/homepage">
          Anasayfa İçeriği
        </Link>
        <Link className="nav-link text-light" href="/admin/settings">
          Site Ayarları
        </Link>
        <Link className="nav-link text-light" href="/admin/profile">
          Hesap Bilgileri
        </Link>
        <Link className="nav-link text-light" href="/">
          Anasayfaya Dön
        </Link>
      </nav>
    </div>
  );
}
