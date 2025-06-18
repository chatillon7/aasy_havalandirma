"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import DatabaseSettings from "@/components/database-settings";

export default function BackupPage() {
  const [resetResult, setResetResult] = useState("");
  const [downloading, setDownloading] = useState(false);
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const handleBackup = async () => {
    setDownloading(true);
    // Sadece dosya yolunu döndürür, gerçek download için public'e kopyalama gerekir
    const res = await fetch("/api/backup");
    const data = await res.json();
    if (data.dbPath) {
      // Windows için dosyayı public klasörüne kopyala
      await fetch("/api/backup/download", { method: "POST" });
      window.open("/db-backup.sqlite", "_blank");
    }
    setDownloading(false);
  };

  const handleReset = async () => {
    if (!window.confirm("Veritabanı sıfırlanacak. Emin misiniz?")) return;
    const res = await fetch("/api/backup", { method: "POST" });
    const data = await res.json();
    setResetResult(data.success ? "Veritabanı sıfırlandı." : "Hata: " + data.error);
    if (data.success) {
      // Oturumu sil ve anasayfaya yönlendir
      await fetch("/api/auth/logout", { method: "POST" });
      startTransition(() => {
        router.replace("/");
      });
    }
  };

  return (
    <div className="container p-4">
      <h2>Veritabanı Yedekle / Sıfırla</h2>
      <p>Veritabanını yedekleyebilir veya sıfırlayabilirsiniz.</p>
      {resetResult && <div className="alert alert-info mt-3">{resetResult}</div>}
      <div className="card mb-4">
        <div className="card-body">
          <button className="btn btn-outline-primary me-2 mb-3" onClick={handleBackup} disabled={downloading}>
            {downloading ? "Yedekleniyor..." : "Yedekle (İndir)"}
          </button>
          <button className="btn btn-outline-danger mb-3" onClick={handleReset}>Veritabanını Sıfırla</button>
          <div className="alert alert-warning mt-0 mb-1">
            <strong>Dikkat:</strong> Sıfırlama işlemi tüm verileri kalıcı olarak siler!
          </div>
        </div>
      </div>
        <DatabaseSettings />
    </div>
  );
}
