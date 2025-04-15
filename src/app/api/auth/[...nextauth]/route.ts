// src/app/api/auth/[...nextauth]/route.ts
import NextAuth from "next-auth";
import { authOptions } from "@/lib/auth";

// สร้าง handler ของ NextAuth
const handler = NextAuth(authOptions);

// ส่งออกฟังก์ชัน handler แบบ App Router
export { handler as GET, handler as POST };