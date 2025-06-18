"use client";
import { useEffect } from "react";
import { usePathname } from "next/navigation";

export default function SiteSettingsClientEffect() {
  const pathname = usePathname();
  useEffect(() => {
    // Site ayarlarını localStorage'a kaydet (logoUrl)
    fetch("/api/settings").then(res => res.json()).then(data => {
      if (data && data.logoUrl) {
        window.localStorage.setItem('siteLogoUrl', data.logoUrl);
        // Favicon'u güncelle
        let link = document.querySelector("link[rel*='icon']") || document.createElement('link');
        link.type = 'image/png';
        link.rel = 'shortcut icon';
        link.href = data.logoUrl;
        document.getElementsByTagName('head')[0].appendChild(link);
      }
      if (data && data.siteName) {
        document.title = data.siteName;
      }
    });
  }, [pathname]);
  return null;
}
