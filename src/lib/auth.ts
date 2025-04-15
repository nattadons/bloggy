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
    async signIn({ user }) {
      if (!user.email) return false;

      try {
        const existingUser = await prisma.user.findUnique({
          where: { email: user.email },
        });

        if (existingUser) {
          await prisma.user.update({
            where: { email: user.email },
            data: {
              name: user.name,
              image: user.image || existingUser.image,
            },
          });
        } else {
          await prisma.user.create({
            data: {
              email: user.email,
              name: user.name,
              image: user.image,
              role: "user",
            },
          });
        }

        return true;
      } catch (error) {
        console.error("Error saving user to database:", error);
        return false;
      }
    },

    async session({ session }) {
      if (session?.user?.email) {
        try {
          const user = await prisma.user.findUnique({
            where: { email: session.user.email },
          });

          if (user) {
            session.user.id = user.id;
            session.user.role = user.role;
          }
        } catch (error) {
          console.error("Error getting user from database:", error);
        }
      }
      return session;
    },

    async redirect({ url, baseUrl }) {
      // ใช้ baseUrl ที่ NextAuth ส่งมาให้โดยอ้างอิงจาก NEXTAUTH_URL (ไม่ต้องเช็ค VERCEL_URL แล้ว)
      if (url.startsWith(baseUrl)) {
        if (url.includes("/login") || url.includes("/api/auth/signin")) {
          return `${baseUrl}/blog`;
        }
        return url;
      }
      return `${baseUrl}/blog`;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};
