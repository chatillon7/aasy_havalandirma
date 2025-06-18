// Kullanıcıya özel galeri sayfası
"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";

export default function GalleryPage() {
  const [items, setItems] = useState([]);
  const [modalImg, setModalImg] = useState(null);
  useEffect(() => {
    fetch("/api/gallery")
      .then((res) => res.json())
      .then((data) => setItems(data));
  }, []);
  return (
    <div className="container py-5">
      <h1>Galeri</h1>
      <div className="row">
        {items.map((item) => (
          <div className="col-md-4 mb-4" key={item.id}>
            <div className="card h-100 bg-transparent" style={{cursor:'pointer'}} onClick={() => setModalImg(item.imageUrl)}>
              <Image src={item.imageUrl || "/siteicon_1749739708779.png"} className="card-img" alt={item.description} style={{maxHeight:200,objectFit:'cover'}} width={400} height={200} />
              <div className="card-img-overlay d-flex flex-column justify-content-end">
                <strong><p className="card-text text-white shadow-lg bg-body-transparent rounded">{item.description}</p></strong>
              </div>
            </div>
          </div>
        ))}
      </div>
      {/* Modal */}
      {modalImg && (
        <div className="modal fade show" style={{display:'block',background:'rgba(0,0,0,0.7)'}} tabIndex="-1" onClick={() => setModalImg(null)}>
          <div className="modal-dialog modal-dialog-centered" onClick={e => e.stopPropagation()}>
            <div className="modal-content">
              <div className="modal-body p-0 bg-dark text-center rounded">
                <Image className="img-fluid rounded" src={modalImg} alt="Büyük görsel" style={{maxWidth:'100%',maxHeight:'90vh'}} width={800} height={600} />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
