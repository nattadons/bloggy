import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import FacebookProvider from "next-auth/providers/facebook";
import { prisma } from "@/lib/prisma"; // เชื่อมต่อกับ Prisma Client

export const authOptions = {
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
    signIn: "/login", // หน้าเข้าสู่ระบบที่กำหนดเอง
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
          }
        } catch (error) {
          console.error("Error getting user from database:", error);
        }
      }
      return session;
    },
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
