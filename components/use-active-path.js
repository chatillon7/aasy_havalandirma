// Helper for client-side pathname detection in navbar
"use client";
import { usePathname } from "next/navigation";

export function useActivePath() {
  return usePathname();
}
