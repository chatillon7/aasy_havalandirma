"use client";
export default function BootstrapClient() {
  if (typeof window !== "undefined") {
    import('bootstrap/dist/js/bootstrap.bundle.min.js');
  }
  return null;
}
