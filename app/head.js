import { useEffect, useState } from "react";

export default function Head() {
  // Varsayılan değer, client tarafında güncellenecek
  const [siteName, setSiteName] = useState("Havalandırma Sitesi");

  useEffect(() => {
    fetch("/api/settings")
      .then((res) => res.json())
      .then((data) => {
        if (data && data.siteName) setSiteName(data.siteName);
      });
  }, []);

  return (
    <>
      <title>{siteName}</title>
      <meta name="description" content={`${siteName} - Profesyonel Havalandırma Çözümleri`} />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <link rel="icon" href="/favicon.ico" />
    </>
  );
}
