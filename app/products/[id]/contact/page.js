// Ürün için iletişime geç formu
"use client";
import React, { useState } from "react";
import { useParams, useRouter } from "next/navigation";

export default function ProductContactPage() {
  const params = useParams();
  const { id } = params;
  const router = useRouter();
  const [form, setForm] = useState({
    fullName: "",
    phone: "",
    area: "",
    extraInfo: "",
  });
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!form.fullName || !form.phone || !form.area) {
      setError("Lütfen tüm zorunlu alanları doldurun.");
      return;
    }
    const res = await fetch("/api/inquiries", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...form,
        product: id,
      }),
    });
    if (res.ok) {
      setSuccess(true);
      setTimeout(() => router.push("/"), 2000);
    } else {
      setError("Bir hata oluştu. Lütfen tekrar deneyin.");
    }
  };

  return (
    <div className="container py-5">
      <h2>İletişime Geç</h2>
      <hr />
      <form className="row g-3" onSubmit={handleSubmit}>
        {error && <div className="col-md-12 alert alert-danger">{error}</div>}
        {success && <div className="col-md-12 alert alert-success">Talebiniz iletildi. Anasayfaya yönlendiriliyorsunuz...</div>}
        <div className="col-md-12">
          <input type="text" className="form-control" name="fullName" value={form.fullName} onChange={handleChange} required placeholder="Ad Soyad" />
        </div>
        <div className="col-md-12">
          <input type="text" className="form-control" name="phone" value={form.phone} onChange={handleChange} required placeholder="Telefon" />
        </div>
        <div className="col-md-12">
          <input type="number" className="form-control" name="area" value={form.area} onChange={handleChange} required placeholder="Alan (m²)" />
        </div>
        <div className="col-md-12">
          <textarea className="form-control" name="extraInfo" value={form.extraInfo} onChange={handleChange} placeholder="Ek Açıklama" />
        </div>
        <div className="col-md-12">
          <button type="submit" className="btn btn-success">Gönder</button>
        </div>
      </form>
    </div>
  );
}
