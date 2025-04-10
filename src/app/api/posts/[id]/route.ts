// app/api/posts/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const postId = params.id;
    
    // ดึงข้อมูลโพสต์ตาม ID พร้อมข้อมูลผู้เขียน
    const post = await prisma.post.findUnique({
      where: { id: postId },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            image: true,
            email: true,
          }
        }
      }
    });
    
    if (!post) {
      return NextResponse.json(
        { error: 'Post not found' },
        { status: 404 }
      );
    }
    
    // ดึงโพสต์ที่เกี่ยวข้อง (เช่น 2 โพสต์ล่าสุดที่ไม่ใช่โพสต์นี้)
    const relatedPosts = await prisma.post.findMany({
      where: {
        id: { not: postId },
        published: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        author: {
          select: {
            name: true,
            image: true,
          }
        }
      },
      take: 2,
    });
    
    return NextResponse.json({ post, relatedPosts });
  } catch (error) {
    console.error('Error fetching post:', error);
    return NextResponse.json(
      { error: 'Failed to fetch post' },
      { status: 500 }
    );
  }
}