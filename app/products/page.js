// Kullanıcıya özel ürünler sayfası
"use client";
import React, { useEffect, useState } from "react";

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  useEffect(() => {
    fetch("/api/products")
      .then((res) => res.json())
      .then((data) => setProducts(data));
  }, []);
  return (
    <div className="container py-5">
      <h1>Ürünler & Hizmetler</h1>
      <div className="row">
        {products.map((p) => (
          <div className="col-md-4 mb-4" key={p.id}>
            <a href={`/products/${p.id}`} style={{textDecoration:'none',color:'inherit'}}>
              <div className="card h-100">
                <img src={p.imageUrl || "/vercel.svg"} className="card-img-top" alt={p.name} style={{maxHeight:200,objectFit:'cover'}} />
                <div className="card-body">
                  <h5 className="card-title">{p.name}</h5>
                  <p className="card-text">{p.description}</p>
                </div>
              </div>
            </a>
          </div>
        ))}
      </div>
    </div>
  );
}
