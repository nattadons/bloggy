//app/api/favorites/[id]/route.ts
import { prisma } from "@/lib/prisma";  // Prisma Client
import { NextRequest, NextResponse } from "next/server";  // ใช้ NextRequest และ NextResponse

// POST: Unsave post
export async function POST(req: NextRequest) {
  const { userId, postId } = await req.json();  // รับข้อมูลจาก body

  if (!userId || !postId) {
    return NextResponse.json({ message: "Missing userId or postId" }, { status: 400 });
  }

  try {
    await prisma.user.update({
      where: { id: userId },
      data: {
        savedPosts: {
          disconnect: { id: postId },  // ตัดการเชื่อมต่อ post ที่ต้องการลบ
        },
      },
    });

    return NextResponse.json({ message: "Post unsaved successfully" });
  } catch (error) {
    console.error("Unsave post error:", error);
    return NextResponse.json({ message: "Something went wrong" }, { status: 500 });
  }
}
