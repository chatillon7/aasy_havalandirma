"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";

export default function AdminFooter() {
  const [logo, setLogo] = useState("/vercel.svg");
  const [siteName, setSiteName] = useState("HAVALANDIRMA");
  const year = new Date().getFullYear();
  useEffect(() => {
    fetch("/api/settings")
      .then((res) => res.json())
      .then((data) => {
        if (data && data.logoUrl) setLogo(data.logoUrl);
        if (data && data.siteName) setSiteName(data.siteName);
      });
  }, []);
  return (
    <footer className="bg-light border-top mt-5 py-4">
      <div className="container d-flex flex-column flex-md-row align-items-center justify-content-between gap-3">
        <div className="d-flex align-items-center gap-2">
          <Image src={logo} alt="Logo" height={32} style={{ maxHeight: 32 }} width={32} />
        </div>
        <div className="text-muted small">
          © {year} {siteName} | Tüm hakları saklıdır.
        </div>
        <div>
          <Link className="btn btn-outline-secondary btn-sm" href="/">
            Anasayfa
          </Link>
        </div>
      </div>
    </footer>
  );
}
