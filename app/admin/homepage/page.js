"use client";

import React, { useEffect, useState } from "react";

export default function HomepageContentPage() {
  const [form, setForm] = useState({ videoUrl: "", purpose: "", info: "" });
  const [success, setSuccess] = useState(false);
  const [uploadingVideo, setUploadingVideo] = useState(false);

  useEffect(() => {
    fetchContent();
  }, []);

  const fetchContent = async () => {
    const res = await fetch("/api/homepage");
    const data = await res.json();
    if (data) setForm({
      videoUrl: data.videoUrl || "",
      purpose: data.purpose || "",
      info: data.info || ""
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await fetch("/api/homepage", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    setSuccess(true);
    setTimeout(() => setSuccess(false), 2000);
    fetchContent();
  };

  // Video dosyası yükleme
  const handleVideoFile = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploadingVideo(true);
    const formData = new FormData();
    formData.append('file', file);
    const res = await fetch('/api/homepage-upload', {
      method: 'POST',
      body: formData,
    });
    const data = await res.json();
    setUploadingVideo(false);
    if (data.url) {
      setForm(f => ({ ...f, videoUrl: data.url }));
    }
  };

  return (
    <div className="container p-4">
      <h2>Anasayfa İçeriği</h2>
      <p>Tanıtım videosu, amacımız ve hakkımızda bölümlerini buradan yönetebilirsiniz.</p>
      {success && (
        <div className="alert alert-success" role="alert">
          Başarıyla kaydedildi!
        </div>
      )}
      <div className="card mb-4">
        <div className="card-body">
          <form className="row g-3" onSubmit={handleSubmit}>
            <div className="col-12">
              <label className="form-label">Tanıtım Videosu (dosya yükle)</label>
              <input type="file" className="form-control" accept="video/*" onChange={handleVideoFile} />
              {uploadingVideo && <div>Yükleniyor...</div>}
              {form.videoUrl && (
                <video src={form.videoUrl} controls style={{maxHeight:80,marginTop:8}} />
              )}
            </div>
            <div className="col-12">
              <label className="form-label">Amacımız</label>
              <textarea className="form-control" name="purpose" value={form.purpose} onChange={handleChange} />
            </div>
            <div className="col-12">
              <label className="form-label">Hakkımızda</label>
              <textarea className="form-control" name="info" value={form.info} onChange={handleChange} />
            </div>
            <div className="col-12">
              <button type="submit" className="btn btn-success">Kaydet</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
