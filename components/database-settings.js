"use client";
import React, { useState } from "react";

export default function DatabaseSettings() {
  const [dbUrl, setDbUrl] = useState("");
  const [status, setStatus] = useState("");

  const handleChange = (e) => setDbUrl(e.target.value);

  const handleSave = async (e) => {
    e.preventDefault();
    setStatus("Kaydediliyor...");
    const res = await fetch("/api/db-connection", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ dbUrl }),
    });
    if (res.ok) setStatus("Bağlantı kaydedildi ve test edildi.");
    else setStatus("Bağlantı başarısız veya kaydedilemedi.");
  };

  return (
    <div className="card mb-4">
      <div className="card-body">
        <h4>Veritabanı Bağlantısı</h4>
        <form onSubmit={handleSave} className="row g-3">
          <div className="col-12">
            <label className="form-label">Veritabanı URL</label>
            <input type="text" className="form-control" value={dbUrl} onChange={handleChange} placeholder="postgresql://... veya mysql://..." />
          </div>
          <div className="col-12">
            <button type="submit" className="btn btn-primary">Kaydet ve Test Et</button>
          </div>
        </form>
        {status && <div className="mt-2">{status}</div>}
      </div>
    </div>
  );
}
