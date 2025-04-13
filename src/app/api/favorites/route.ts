//api/favorites/route.ts
import { prisma } from "@/lib/prisma";  // Prisma Client
import { NextRequest, NextResponse } from "next/server";  // ใช้ NextRequest และ NextResponse

// POST: Save post
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
          connect: { id: postId },  // เชื่อมต่อ post ที่ต้องการบันทึก
        },
      },
    });

    return NextResponse.json({ message: "Post saved successfully" });
  } catch (error) {
    console.error("Save post error:", error);
    return NextResponse.json({ message: "Something went wrong" }, { status: 500 });
  }
}
