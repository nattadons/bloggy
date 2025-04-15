// app/api/comments/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth'; 
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    // ตรวจสอบว่ามีการล็อกอินหรือไม่
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user) {
      return NextResponse.json(
        { error: 'You must be logged in to comment' },
        { status: 401 }
      );
    }
    
    // รับข้อมูลจาก request body
    const { content, postId } = await request.json();
    
    // ตรวจสอบข้อมูลที่จำเป็น
    if (!content || !postId) {
      return NextResponse.json(
        { error: 'Content and postId are required' },
        { status: 400 }
      );
    }
    
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
    
    // สร้าง comment ใหม่
    const comment = await prisma.comment.create({
      data: {
        content,
        postId,
        authorId: session.user.id,
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
      },
    });
    
    return NextResponse.json(comment, { status: 201 });
    
  } catch (error) {
    console.error('Error creating comment:', error);
    return NextResponse.json(
      { error: 'Failed to create comment' },
      { status: 500 }
    );
  }
}