"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";

export default function SettingsPage() {
  const [form, setForm] = useState({ logoUrl: "", siteName: "" });
  const [success, setSuccess] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState("");

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    const res = await fetch("/api/settings");
    const data = await res.json();
    if (data) {
      setForm({ logoUrl: data.logoUrl || "", siteName: data.siteName || "" });
      setPreview(data.logoUrl || "");
    }
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);
    const res = await fetch("/api/settings-upload", {
      method: "POST",
      body: formData,
    });
    const data = await res.json();
    setUploading(false);
    if (data.url) {
      setForm(f => ({ ...f, logoUrl: data.url }));
      setPreview(data.url);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await fetch("/api/settings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ logoUrl: form.logoUrl, siteName: form.siteName }),
    });
    setSuccess(true);
    setTimeout(() => setSuccess(false), 1000);
    window.location.reload();
  };

  return (
    <div className="container p-4">
      <h2>Site Ayarları</h2>
      <p>Logo (ve favicon), sekme adı ve site adını buradan değiştirebilirsiniz.</p>
      <div className="card mb-4">
        <div className="card-body">
          <form className="row g-3" onSubmit={handleSubmit}>
            <div className="col-md-6">
              <label className="form-label">Logo & Favicon</label>
              <input type="file" className="form-control" accept="image/*" onChange={handleFileChange} />
              {uploading && <div>Kayıt ediliyor...</div>}
              {preview && <Image src={preview} alt="Logo preview" style={{maxHeight:72, marginTop:10}} width={192} height={72} />}
            </div>
            <div className="col-md-6">
              <label className="form-label">Site Adı</label>
              <input type="text" className="form-control" name="siteName" value={form.siteName} onChange={handleChange} required />
            </div>
            <div className="col-12">
              <button type="submit" className="btn btn-success">Kaydet</button>
              {success && <span className="text-success ms-3">Başarıyla kaydedildi!</span>}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
