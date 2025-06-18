"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Footer() {
  const pathname = usePathname();
  const [logo, setLogo] = useState("/vercel.svg");
  const [siteName, setSiteName] = useState("HAVALANDIRMA");
  const [theme, setTheme] = useState("light");
  const year = new Date().getFullYear();
  useEffect(() => {
    fetch("/api/settings")
      .then((res) => res.json())
      .then((data) => {
        if (data && data.logoUrl) setLogo(data.logoUrl);
        if (data && data.siteName) setSiteName(data.siteName);
      });
    // Theme init
    const saved = localStorage.getItem("theme") || "light";
    setTheme(saved);
    const listener = () => {
      const t = document.documentElement.getAttribute("data-bs-theme") || "light";
      setTheme(t);
    };
    window.addEventListener("storage", listener);
    return () => window.removeEventListener("storage", listener);
  }, []);

  useEffect(() => {
    const observer = new MutationObserver(() => {
      const t = document.documentElement.getAttribute("data-bs-theme") || "light";
      setTheme(t);
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["data-bs-theme"] });
    return () => observer.disconnect();
  }, []);

  return (
    pathname.startsWith("/admin") ? null : (
      <footer
        className={`mt-5 py-4 ${theme === "dark" ? "bg-dark text-light" : "bg-transparent text-white"}`}
      >
        <div className="container d-flex flex-column flex-md-row align-items-center justify-content-between gap-3">
          <div className="d-flex align-items-center gap-2">
            <img src={logo} alt="Logo" height={32} style={{ maxHeight: 32 }} />
          </div>
          <div className="text-muted small">
            © {year} {siteName} | Tüm hakları saklıdır.
          </div>
          <div>
            <Link className="btn btn-outline-secondary btn-sm" href="/admin">
              Admin Paneli
            </Link>
          </div>
        </div>
      </footer>
    )
  );
}
