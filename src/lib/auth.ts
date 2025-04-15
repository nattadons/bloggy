import NextAuth, { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import FacebookProvider from "next-auth/providers/facebook";
import { prisma } from "@/lib/prisma";

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    }),
    FacebookProvider({
      clientId: process.env.FACEBOOK_CLIENT_ID || "",
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET || "",
    }),
  ],
  pages: {
    signIn: "/login",
  },
  callbacks: {
    async signIn({ user }: { user: { email?: string | null; name?: string | null; image?: string | null } }) {
      if (!user.email) return false;

      try {
        // เช็คว่าผู้ใช้มีในฐานข้อมูลหรือไม่
        const existingUser = await prisma.user.findUnique({
          where: { email: user.email },
        });

        if (existingUser) {
          // ถ้ามี, อัปเดตข้อมูลผู้ใช้
          await prisma.user.update({
            where: { email: user.email },
            data: {
              name: user.name,
              image: user.image || existingUser.image,
            },
          });
        } else {
          // ถ้ายังไม่มี, สร้างผู้ใช้ใหม่
          await prisma.user.create({
            data: {
              email: user.email,
              name: user.name,
              image: user.image,
              role: "user", // ตั้งค่าเริ่มต้นเป็น 'user' สำหรับผู้ใช้ใหม่
            },
          });
        }

        return true;
      } catch (error) {
        console.error("Error saving user to database:", error);
        return false;
      }
    },
    async session({ session, token }: { session: any; token: any }) {
      // หาก session มี user.email ให้เพิ่ม id จากฐานข้อมูล
      if (session?.user?.email) {
        try {
          const user = await prisma.user.findUnique({
            where: { email: session.user.email },
          });

          if (user) {
            session.user.id = user.id;
            session.user.role = user.role; // เพิ่ม role เข้าไปใน session
          }
        } catch (error) {
          console.error("Error getting user from database:", error);
        }
      }
      return session;
    },
    async redirect({ url, baseUrl }) {
      // ตั้งค่า baseUrl โดยอัตโนมัติในสภาพแวดล้อม Vercel
      baseUrl = process.env.VERCEL_URL
        ? `https://${process.env.VERCEL_URL}`
        : process.env.NEXTAUTH_URL || "http://localhost:3000";
      
      // ตรวจสอบว่า URL เริ่มต้นด้วย baseUrl หรือไม่
      if (url.startsWith(baseUrl)) {
        // ถ้า URL มาจากหน้า login หรือ signin ให้ redirect ไปที่หน้า blog
        if (url.includes('/login') || url.includes('/api/auth/signin')) {
          return `${baseUrl}/blog`;
        }
        return url;
      } else {
        // ถ้า URL ไม่ได้เริ่มต้นด้วย baseUrl ให้ redirect ไปที่หน้า blog
        return `${baseUrl}/blog`;
      }
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};