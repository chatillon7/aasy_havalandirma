// Ürün detay sayfası
"use client";
import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";

export default function ProductDetailPage() {
  const params = useParams();
  const { id } = params;
  const [product, setProduct] = useState(null);
  useEffect(() => {
    if (!id) return;
    fetch(`/api/products?id=${id}`)
      .then((res) => res.json())
      .then((data) => setProduct(data));
  }, [id]);
  if (!product) return <div className="container py-5">Yükleniyor...</div>;
  return (
    <div className="container py-5">
      <div className="row">
        <div className="col-md-6">
          <img src={product.imageUrl || "/vercel.svg"} className="img-fluid mb-3 rounded" alt={product.name} />
        </div>
        <div className="col-md-6">
          <h2>{product.name}</h2>
          <p>{product.description}</p>
          <p><strong>Fiyat:</strong> {product.pricePerM2} ₺/m²</p>
          <a href={`/products/${product.id}/contact`} className="btn btn-success">İletişime Geç</a>
        </div>
      </div>
    </div>
  );
}
