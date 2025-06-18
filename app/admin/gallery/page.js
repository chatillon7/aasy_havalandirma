"use client";

import React, { useEffect, useState } from "react";

export default function GalleryPage() {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState({ imageUrl: "", description: "" });
  const [editId, setEditId] = useState(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    const res = await fetch("/api/gallery");
    const data = await res.json();
    setItems(data);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    const method = editId ? "PUT" : "POST";
    const body = editId ? { ...form, id: editId } : form;
    await fetch("/api/gallery", {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    setForm({ imageUrl: "", description: "" });
    setEditId(null);
    fetchItems();
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Silmek istediğinize emin misiniz?")) return;
    await fetch("/api/gallery", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    fetchItems();
  };

  const handleEdit = (item) => {
    setEditId(item.id);
    setForm({ imageUrl: item.imageUrl, description: item.description });
  };

  return (
    <div className="container p-4">
      <h2>Galeri</h2>
      <p>
        Buradan galeri görsellerini ekleyebilir, düzenleyebilir veya silebilirsiniz.
      </p>
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
            <div className="col-12">
              <label className="form-label">Açıklama</label>
              <input
                type="text"
                className="form-control"
                name="description"
                value={form.description}
                onChange={handleChange}
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
                    setForm({ imageUrl: "", description: "" });
                  }}
                >
                  Vazgeç
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
      <h4>Mevcut Galeri Görselleri</h4>
      <div className="card mb-3">
        <div className="card-body">
      <table className="table table-striped">
        <thead>
          <tr>
            <th>ID</th>
            <th>Görsel</th>
            <th>Açıklama</th>
            <th>İşlem</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item, i) => (
            <tr key={item.id}>
              <td>{i + 1}</td>
              <td>
                <img src={item.imageUrl} alt="galeri" width={40} />
              </td>
              <td>{item.description}</td>
              <td>
                <button
                  className="btn btn-sm btn-primary me-2 my-1"
                  onClick={() => handleEdit(item)}
                >
                  <i className="bi bi-pencil-fill"></i>
                </button>
                <button
                  className="btn btn-sm btn-danger my-1"
                  onClick={() => handleDelete(item.id)}
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
