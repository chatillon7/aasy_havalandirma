"use client";

import React, { useEffect, useState } from "react";

export default function InquiriesPage() {
  const [inquiries, setInquiries] = useState([]);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetchInquiries();
    fetchProducts();
  }, []);

  const fetchInquiries = async () => {
    const res = await fetch("/api/inquiries");
    const data = await res.json();
    setInquiries(data);
  };

  const fetchProducts = async () => {
    const res = await fetch("/api/products");
    const data = await res.json();
    setProducts(data);
  };

  // id ise ürün adını bul
  const getProductName = (product) => {
    const found = products.find((p) => String(p.id) === String(product));
    return found ? found.name : product;
  };

  return (
    <div className="container p-4">
      <h2>Talepler</h2>
      <p>
        Kullanıcıların iletişim/satın al formlarından gönderdiği talepler burada
        listelenecek.
      </p>
      <div className="card mb-3">
        <div className="card-body">
      <table className="table table-striped">
        <thead>
          <tr>
            <th>ID</th>
            <th>İsim Soyisim</th>
            <th>Telefon</th>
            <th>Ürün Adı</th>
            <th>Bilgi</th>
            <th>Tarih</th>
            <th>İşlem</th>
          </tr>
        </thead>
        <tbody>
          {inquiries.map((inq, i) => (
            <tr key={inq.id}>
              <td>{i + 1}</td>
              <td>{inq.fullName}</td>
              <td>{inq.phone}</td>
              <td>{getProductName(inq.product)}</td>
              <td>{inq.extraInfo || "-"}</td>
              <td>{new Date(inq.createdAt).toLocaleDateString()}</td>
              <td>
                <button
                  className="btn btn-danger btn-sm me-2 my-1"
                  onClick={async () => {
                    await fetch(`/api/inquiries?id=${inq.id}`, {
                      method: "DELETE",
                    });
                    fetchInquiries();
                  }}
                >
                  <i className="bi bi-trash-fill"></i>
                </button>
                <a
                  className="btn btn-success btn-sm my-1"
                  href={`https://wa.me/${inq.phone
                    .replace(/[^0-9]/g, "")
                    .replace(/^0/, "90")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <i className="bi bi-whatsapp"></i>
                </a>
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
