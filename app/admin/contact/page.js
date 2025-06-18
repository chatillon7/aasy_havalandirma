"use client";

import React, { useEffect, useState } from "react";

export default function ContactPage() {
  const [form, setForm] = useState({ mapUrl: "", phone: "", address: "", email: "" });
  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    fetchContact();
  }, []);

  const fetchContact = async () => {
    setLoading(true);
    const res = await fetch("/api/contact");
    const data = await res.json();
    if (data) setForm(data);
    setLoading(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await fetch("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    setSuccess(true);
    setTimeout(() => setSuccess(false), 2000);
    fetchContact();
  };

  return (
    <div className="container p-4">
      <h2>İletişim Bilgileri</h2>
      <p>Buradan iletişim bilgilerini güncelleyebilirsiniz.</p>
      <div className="card mb-4">
        <div className="card-body">
          <form className="row g-3" onSubmit={handleSubmit}>
            <div className="col-md-6">
              <label className="form-label">Harita Embed URL</label>
              <input type="text" className="form-control" name="mapUrl" value={form.mapUrl} onChange={handleChange} required />
            </div>
            <div className="col-md-6">
              <label className="form-label">Telefon</label>
              <input type="text" className="form-control" name="phone" value={form.phone} onChange={handleChange} required />
            </div>
            <div className="col-md-6">
              <label className="form-label">Açık Adres</label>
              <input type="text" className="form-control" name="address" value={form.address} onChange={handleChange} required />
            </div>
            <div className="col-md-6">
              <label className="form-label">E-posta</label>
              <input type="email" className="form-control" name="email" value={form.email} onChange={handleChange} required />
            </div>
            <div className="col-12">
              <button type="submit" className="btn btn-success">Kaydet</button>
              {success && <span className="text-success ms-3">Başarıyla kaydedildi!</span>}
            </div>
          </form>
        </div>
      </div>
      {loading && <div>Yükleniyor...</div>}
    </div>
  );
}
