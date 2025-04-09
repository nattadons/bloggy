'use client';

import { SessionProvider } from "next-auth/react";

// สร้าง AuthProvider สำหรับครอบ component อื่นๆ เพื่อให้ใช้งาน session ได้
export default function AuthProvider({ children }: { children: React.ReactNode }) {
  return <SessionProvider>{children}</SessionProvider>;
}

