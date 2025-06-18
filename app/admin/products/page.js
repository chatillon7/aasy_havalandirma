"use client";

import React, { useEffect, useState } from "react";

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState({
    name: "",
    pricePerM2: "",
    description: "",
    imageUrl: "",
  });
  const [editId, setEditId] = useState(null);
  const [uploading, setUploading] = useState(false);

  // Ürünleri çek
  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    const res = await fetch("/api/products");
    const data = await res.json();
    setProducts(data);
  };

  // Form değişikliği
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({
      ...f,
      [name]: value,
    }));
  };

  // Dosya değişimi
  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);
    const res = await fetch("/api/gallery-upload", {
      method: "POST",
      body: formData,
    });
    const data = await res.json();
    setUploading(false);
    if (data.url) {
      setForm((f) => ({ ...f, imageUrl: data.url }));
    } else {
      alert("Dosya yüklenemedi!");
    }
  };

  // Ekle/güncelle
  const handleSubmit = async (e) => {
    e.preventDefault();
    const method = editId ? "PUT" : "POST";
    const body = editId ? { ...form, id: editId } : form;
    await fetch("/api/products", {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    setForm({ name: "", pricePerM2: "", description: "", imageUrl: "" });
    setEditId(null);
    fetchProducts();
  };

  // Sil
  const handleDelete = async (id) => {
    if (!window.confirm("Silmek istediğinize emin misiniz?")) return;
    await fetch("/api/products", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    fetchProducts();
  };

  // Düzenle
  const handleEdit = (product) => {
    setEditId(product.id);
    setForm({
      name: product.name,
      pricePerM2: product.pricePerM2,
      description: product.description,
      imageUrl: product.imageUrl,
    });
  };

  return (
    <div className="container p-4">
      <h2>Hizmetler / Ürünler</h2>
      <p>Buradan ürünleri ekleyebilir, düzenleyebilir veya silebilirsiniz.</p>
      <div className="card mb-4">
        <div className="card-body">
          <form className="row g-3" onSubmit={handleSubmit}>
            <div className="col-12">
              <label className="form-label">Görsel Yükle</label>
              <input
                type="file"
                className="form-control"
                accept="image/*"
                onChange={handleFileChange}
              />
              {uploading && <div>Kayıt ediliyor...</div>}
              {form.imageUrl && (
                <img
                  src={form.imageUrl}
                  alt="Yüklenen görsel"
                  style={{
                    maxHeight: 80,
                    marginTop: 8,
                  }}
                />
              )}
            </div>
            <div className="col-md-6">
              <label className="form-label">Ürün/Hizmet Adı</label>
              <input
                type="text"
                className="form-control"
                name="name"
                value={form.name}
                onChange={handleChange}
                required
              />
            </div>
            <div className="col-md-6">
              <label className="form-label">m² Başına Fiyat</label>
              <input
                type="number"
                className="form-control"
                name="pricePerM2"
                value={form.pricePerM2}
                onChange={handleChange}
                required
              />
            </div>
            <div className="col-12">
              <label className="form-label">Açıklama</label>
              <textarea
                className="form-control"
                rows={2}
                name="description"
                value={form.description}
                onChange={handleChange}
                required
              />
            </div>
            <div className="col-12">
              <button
                type="submit"
                className="btn btn-success"
                disabled={uploading}
              >
                {editId ? "Güncelle" : "Ekle"}
              </button>
              {editId && (
                <button
                  type="button"
                  className="btn btn-secondary ms-2"
                  onClick={() => {
                    setEditId(null);
                    setForm({ name: "", pricePerM2: "", description: "", imageUrl: "" });
                  }}
                >
                  Vazgeç
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
      <h4>Mevcut Ürünler</h4>
      <div className="card mb-3">
        <div className="card-body">
      <table className="table table-striped">
        <thead>
          <tr>
            <th>ID</th>
            <th>Adı</th>
            <th>Fiyat (m²)</th>
            <th>Açıklama</th>
            <th>Görsel</th>
            <th>İşlem</th>
          </tr>
        </thead>
        <tbody>
          {products.map((p, i) => (
            <tr key={p.id}>
              <td>{i + 1}</td>
              <td>{p.name}</td>
              <td>{p.pricePerM2}</td>
              <td>{p.description}</td>
              <td>
                <img src={p.imageUrl} alt={p.name} width={40} />
              </td>
              <td>
                <button
                  className="btn btn-sm btn-primary me-2 my-1"
                  onClick={() => handleEdit(p)}
                >
                  <i className="bi bi-pencil-fill"></i>
                </button>
                <button
                  className="btn btn-sm btn-danger my-1"
                  onClick={() => handleDelete(p.id)}
                >
                  <i className="bi bi-trash-fill"></i>
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      </div>
      </div>
    </div>
  );
}
