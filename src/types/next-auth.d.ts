import { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role?: string; // เพิ่ม property role
    } & DefaultSession["user"];
  }
  
  // ถ้าต้องการขยาย User model ด้วย (แนะนำให้ทำ)
  interface User {
    role?: string;
  }
}