// Kullanıcıya özel iletişim sayfası
"use client";
import React, { useEffect, useState } from "react";

export default function ContactPage() {
  const [contact, setContact] = useState(null);
  useEffect(() => {
    fetch("/api/contact")
      .then((res) => res.json())
      .then((data) => setContact(data));
  }, []);
  if (!contact) return <div className="container py-5">Yükleniyor...</div>;
  return (
    <div className="container py-5">
      <h1>İletişim</h1>
      <hr />
      <div className="mb-3">
        <strong>Telefon:</strong>
        {contact.phone && (
          <a
            className="btn btn-transparent btn-sm ms-2"
            href={`https://wa.me/${contact.phone.replace(/[^0-9]/g, '').replace(/^0/, '90')}`}
            target="_blank"
            rel="noopener noreferrer"
          >
          <i className="bi bi-whatsapp"></i> +9{contact.phone}
          </a>
        )}
      </div>
      <div className="mb-3">
        <strong>E-posta:</strong>
        {contact.email && (
          <a
            className="btn btn-transparent btn-sm ms-2"
            href={`mailto:${contact.email}`}
          >
          <i className="bi bi-envelope-plus-fill"></i> {contact.email}
          </a>
        )}
      </div>
      <hr />
      <div className="mb-3">
        <strong>Adres:</strong> {contact.address}
      </div>
      {contact.mapUrl && (
        <div className="mb-3">
          <div>
            <iframe
              src={contact.mapUrl}
              width="100%"
              height="300"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>
        </div>
      )}
    </div>
  );
}
