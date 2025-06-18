"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useActivePath } from "./use-active-path";
import Image from "next/image";

function toggleTheme() {
  if (typeof window === "undefined") return;
  const current = document.documentElement.getAttribute("data-bs-theme");
  const next = current === "dark" ? "light" : "dark";
  document.documentElement.setAttribute("data-bs-theme", next);
  localStorage.setItem("theme", next);
}

export default function Navbar() {
  const [logo, setLogo] = useState("/vercel.svg");
  const [siteName, setSiteName] = useState("HAVALANDIRMA");
  const [theme, setTheme] = useState("light");
  const pathname = useActivePath();
  useEffect(() => {
    fetch("/api/settings")
      .then((res) => res.json())
      .then((data) => {
        if (data && data.logoUrl) setLogo(data.logoUrl);
        if (data && data.siteName) setSiteName(data.siteName);
      });
    // Theme init
    const saved = localStorage.getItem("theme") || "light";
    document.documentElement.setAttribute("data-bs-theme", saved);
    setTheme(saved);
  }, []);
  const handleTheme = () => {
    const current = document.documentElement.getAttribute("data-bs-theme");
    const next = current === "dark" ? "light" : "dark";
    document.documentElement.setAttribute("data-bs-theme", next);
    localStorage.setItem("theme", next);
    setTheme(next);
  };
  return (
    <nav
      className={`navbar navbar-expand-lg mb-4 sticky-top ${
        theme === "dark" ? "navbar-dark" : "navbar-light"
      }`}
      style={{
        backdropFilter: "blur(8px)",
        color: "white",
        boxShadow: "0 4px 24px 0 rgba(0,0,0,0.04)",
        borderBottom: "1.5px solid rgba(0,0,0,0.08)",
        transition: "background 0.3s, box-shadow 0.3s",
        zIndex: 1030,
      }}
    >
      <div className="container">
        <Link
          className="navbar-brand fw-bold d-flex align-items-center gap-2"
          href="/"
        >
          <Image
            src={logo}
            alt="Logo"
            height={32}
            style={{ maxHeight: 32 }}
            width={32}
          />
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto d-flex align-items-center gap-2">
            <li className="nav-item">
              <Link
                href="/"
                className={`btn btn-sm ${
                  theme === "dark" ? "btn-outline-light" : "btn-outline-dark"
                }${pathname === "/" ? " active" : ""}`}
              >
              <i className="bi bi-house-door-fill"></i>
              </Link>
            </li>
            <li className="nav-item">
              <Link
                  href="/products"
                  className={`btn btn-sm ${
                  theme === "dark" ? "btn-outline-light" : "btn-outline-dark"
                }${pathname.startsWith("/products") ? " active" : ""}`}
              >
              <i className="bi bi-basket2-fill"></i>
              </Link>
            </li>
            <li className="nav-item">
              <Link
                href="/gallery"
                className={`btn btn-sm ${
                  theme === "dark" ? "btn-outline-light" : "btn-outline-dark"
                }${pathname.startsWith("/gallery") ? " active" : ""}`}
              >
                <i className="bi bi-image-fill"></i>
              </Link>
            </li>
            <li className="nav-item">
              <Link
                href="/contact"
                className={`btn btn-sm ${
                  theme === "dark" ? "btn-outline-light" : "btn-outline-dark"
                }${pathname.startsWith("/contact") ? " active" : ""}`}
              >
                <i className="bi bi-person-raised-hand"></i>
              </Link>
            </li>
          </ul>
          <button
            className={`btn btn-sm ms-2 ${
              theme === "dark" ? "btn-light" : "btn-dark"
            }`}
            onClick={handleTheme}
            aria-label="Tema Değiştir"
            type="button"
          >
            {theme === "dark"
              ? <i className="bi bi-sun"></i>
              : <i className="bi bi-moon-fill"></i>
            }
          </button>
        </div>
      </div>
    </nav>
  );
}
