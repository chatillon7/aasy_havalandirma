// Helper for client-side admin path detection
"use client";
import { usePathname } from "next/navigation";

export default function HideNavbar({ children }) {
  const pathname = usePathname();
  const isAdmin = pathname.startsWith("/admin");
  return <>{!isAdmin && children}</>;
}
