"use client";

import React, { useEffect, useState } from "react";
import LogoutButton from "@/components/auth/logout-button";

export default function AdminProfilePage() {
  const [form, setForm] = useState({ id: "", name: "", email: "", password: "", password2: "" });
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    const res = await fetch("/api/admin-profile");
    const data = await res.json();
    if (data) setForm((f) => ({ ...f, id: data.id, name: data.name, email: data.email }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (form.password && form.password !== form.password2) {
      setError("Şifreler eşleşmiyor");
      return;
    }
    const body = { id: form.id, name: form.name, email: form.email };
    if (form.password) body.password = form.password;
    await fetch("/api/admin-profile", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    setSuccess(true);
    setTimeout(() => setSuccess(false), 2000);
    setForm((f) => ({ ...f, password: "", password2: "" }));
    fetchProfile();
  };

  return (
    <div className="container p-4">
      <h2>Admin Hesap Bilgileri</h2>
      <p>Admin kullanıcı bilgilerini buradan güncelleyebilirsiniz.</p>
      <div className="card mb-4">
        <div className="card-body">
              {success && <div className="alert alert-success">Başarıyla kaydedildi!</div>}
              {error && <div className="alert alert-danger">{error}</div>}
          <form className="row g-3 mb-2" onSubmit={handleSubmit}>
            <div className="col-md-6">
              <label className="form-label">Ad Soyad</label>
              <input type="text" className="form-control" name="name" value={form.name} onChange={handleChange} required />
            </div>
            <div className="col-md-6">
              <label className="form-label">E-posta</label>
              <input type="email" className="form-control" name="email" value={form.email} onChange={handleChange} required />
            </div>
            <div className="col-md-6">
              <label className="form-label">Yeni Şifre</label>
              <input type="password" className="form-control" name="password" value={form.password} onChange={handleChange} />
            </div>
            <div className="col-md-6">
              <label className="form-label">Şifre Tekrar</label>
              <input type="password" className="form-control" name="password2" value={form.password2} onChange={handleChange} />
            </div>
            <div className="col-md-12">
              <button type="submit" className="btn btn-success">Güncelle</button>
            </div>
          </form>
              <LogoutButton />
        </div>
      </div>
    </div>
  );
}
