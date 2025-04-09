import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

// Middleware ทำงานก่อนที่จะเข้าถึงหน้าต่างๆ
export async function middleware(request: NextRequest) {
    // ตรวจสอบ path ที่ผู้ใช้กำลังเข้าถึง
    const path = request.nextUrl.pathname;
    console.log("Middleware running for path:", request.nextUrl.pathname);
    console.log("Middleware running for path:", path); // ตรวจสอบว่า middleware ทำงาน
    // กำหนดหน้าที่ต้องล็อกอินก่อนเข้าถึง
    const isProtectedPath =
        path.startsWith('/blog/new') ||
        path.startsWith('/blog/edit') ||
        path.startsWith('/profile');
    console.log("Is protected path:", isProtectedPath); // ตรวจสอบว่าตรวจจับ path ได้ถูกต้อง
    // ถ้าเป็นหน้าที่ต้องป้องกัน
    if (isProtectedPath) {
        // ตรวจสอบ session token
        const token = await getToken({
            req: request,
            secret: process.env.NEXTAUTH_SECRET
        });
    console.log("Token exists:", !!token); // ตรวจสอบว่ามี token หรือไม่
        // ถ้าไม่มี token (ไม่ได้ล็อกอิน) ให้ redirect ไปหน้า login
        if (!token) {
            const loginUrl = new URL('/login', request.url);
            return NextResponse.redirect(loginUrl);
        }
    }

    // ถ้ามี token หรือไม่ใช่หน้าที่ต้องป้องกัน ปล่อยให้เข้าถึงต่อไป
    return NextResponse.next();
}

// กำหนดว่า middleware นี้จะทำงานกับ path ไหนบ้าง
export const config = {
    matcher: [
        '/blog/new',
        '/blog/edit/:path*',
        '/profile/:path*'
    ],
};