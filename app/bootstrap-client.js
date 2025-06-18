"use client";
export default function BootstrapClient() {
  if (typeof window !== "undefined") {
    require('bootstrap/dist/js/bootstrap.bundle.min.js');
  }
  return null;
}
