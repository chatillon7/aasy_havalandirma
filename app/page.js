"use client";

import React, { useEffect, useState } from "react";

export default function Home() {
  const [content, setContent] = useState(null);

  useEffect(() => {
    fetchContent();
  }, []);

  const fetchContent = async () => {
    const res = await fetch("/api/homepage");
    const data = await res.json();
    setContent(data);
  };

  if (!content) {
    return <div className="container py-5 text-center">Yükleniyor...</div>;
  }

  return (
    <div className="container py-5">
      <div className="row text-left">
        <div className="col-md-12">
          <h1 className="fw-bold">Ana Sayfa</h1>
          <p>{content.purpose || "Amacımız"}</p>
        </div>
      </div>
      <hr/>
      <div className="row mb-3 text-center">
        <div className="col-md-8">
        {content.videoUrl && (
          content.videoUrl.endsWith('.mp4') ? (
            <div className="ratio ratio-16x9 mb-3">
              <video src={content.videoUrl} controls style={{border:0, width:'100%'}} />
            </div>
          ) : (
            <div className="ratio ratio-16x9 mb-3">
              <iframe src={content.videoUrl} title="Tanıtım Videosu" allowFullScreen style={{border:0}}></iframe>
            </div>
          )
        )}
        </div>
        <div className="col-md-4 text-start d-flex flex-column justify-content-center align-items-start">
          <h2 className="fw-bold mb-2">Hakkımızda</h2>
          <p>{content.info || "Hakkımızda bilgisi henüz girilmedi."}</p>
        </div>
     </div>
    </div>
  );
}
