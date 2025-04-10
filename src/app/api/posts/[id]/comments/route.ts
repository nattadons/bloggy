// app/api/posts/[id]/comments/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma'; // ปรับการ import ให้ถูกต้องตามการ export ในไฟล์ prisma

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } } // เปลี่ยนจาก postId เป็น id ให้ตรงกับชื่อไฟล์ [id]
) {
  try {
    const postId = params.id; // เปลี่ยนจาก params.postId เป็น params.id
    
    // ตรวจสอบว่า post ที่ระบุมีอยู่จริง
    const post = await prisma.post.findUnique({
      where: { id: postId },
    });
    
    if (!post) {
      return NextResponse.json(
        { error: 'Post not found' },
        { status: 404 }
      );
    }
    
    // ดึงข้อมูล comments ของ post
    const comments = await prisma.comment.findMany({
      where: { postId },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' }, // แสดงความคิดเห็นล่าสุดก่อน
    });
    
    return NextResponse.json(comments);
    
  } catch (error) {
    console.error('Error fetching comments:', error);
    return NextResponse.json(
      { error: 'Failed to fetch comments' },
      { status: 500 }
    );
  }
}