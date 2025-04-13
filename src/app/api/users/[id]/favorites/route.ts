// app/api/users/[id]/favorites/route.ts
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

// GET: ดึงโพสต์โปรดของผู้ใช้
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const userId = params.id;

  if (!userId) {
    return NextResponse.json(
      { message: "Missing userId parameter" },
      { status: 400 }
    );
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        savedPosts: {
          include: {
            author: {
              select: {
                id: true,
                name: true,
                image: true,
              },
            },
            // สามารถเพิ่ม include อื่นๆ ตามต้องการ เช่น categories, comments, ฯลฯ
          },
        },
      },
    });

    if (!user) {
      return NextResponse.json(
        { message: "User not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ savedPosts: user.savedPosts });
  } catch (error) {
    console.error("Get saved posts error:", error);
    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 500 }
    );
  }
}

// POST: เพิ่มโพสต์เข้ารายการโปรด
export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const userId = params.id;
  const { postId } = await req.json();

  if (!userId || !postId) {
    return NextResponse.json(
      { message: "Missing userId or postId" },
      { status: 400 }
    );
  }

  try {
    await prisma.user.update({
      where: { id: userId },
      data: {
        savedPosts: {
          connect: { id: postId },
        },
      },
    });

    return NextResponse.json({ message: "Post saved successfully" });
  } catch (error) {
    console.error("Save post error:", error);
    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 500 }
    );
  }
}

// DELETE: ลบโพสต์จากรายการโปรด
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const userId = params.id;
  const url = new URL(req.url);
  const postId = url.searchParams.get("postId");

  if (!userId || !postId) {
    return NextResponse.json(
      { message: "Missing userId or postId" },
      { status: 400 }
    );
  }

  try {
    await prisma.user.update({
      where: { id: userId },
      data: {
        savedPosts: {
          disconnect: { id: postId },
        },
      },
    });

    return NextResponse.json({ message: "Post unsaved successfully" });
  } catch (error) {
    console.error("Unsave post error:", error);
    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 500 }
    );
  }
}