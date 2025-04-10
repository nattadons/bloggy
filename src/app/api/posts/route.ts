import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { prisma } from '@/lib/prisma';

/**
 * API handler for creating new blog posts
 * POST /api/posts
 */
export async function POST(request: NextRequest) {
  try {
    // ตรวจสอบว่าผู้ใช้ล็อกอินแล้วหรือไม่
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user?.id) {
      return NextResponse.json(
        { error: 'กรุณาเข้าสู่ระบบก่อนสร้างบทความ' },
        { status: 401 }
      );
    }

    // รับข้อมูลจาก form
    const formData = await request.formData();
    console.log('Form data:', formData); // Debugging line
    
    // ดึงข้อมูลจาก form
    const title = formData.get('title') as string;
    const excerpt = formData.get('excerpt') as string;
    const content = formData.get('content') as string;
    const tags = formData.get('tags') as string;
    
    // ตรวจสอบความถูกต้องของข้อมูล
    if (!title || !content) {
      return NextResponse.json(
        { error: 'กรุณากรอกหัวข้อและเนื้อหาบทความ' },
        { status: 400 }
      );
    }

    // บันทึกข้อมูลลงฐานข้อมูล
    const post = await prisma.post.create({
      data: {
        title,
        excerpt,
        content,
        tags,
        authorId: session.user.id,
        published: true,
      },
    });

    // ส่งข้อมูลกลับไป
    return NextResponse.json({ success: true, post }, { status: 201 });
  } catch (error) {
    console.error('Error creating post:', error);
    return NextResponse.json(
      { error: 'ไม่สามารถสร้างบทความได้' },
      { status: 500 }
    );
  }
}

/**
 * API handler for getting all blog posts
 * GET /api/posts
 */
export async function GET(request: NextRequest) {
  try {
    // Get query parameters for filtering
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    
    // Build the query
    const query: any = {
      where: {
        published: true,
      },
      orderBy: {
        createdAt: 'desc' // Most recent first
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            image: true,
          }
        }
      }
    };
    
    // Add user filter if needed
    if (userId) {
      query.where.authorId = userId;
    }
    
    // Fetch posts from database
    const posts = await prisma.post.findMany(query);
    
    return NextResponse.json({ posts });
  } catch (error) {
    console.error('Error fetching posts:', error);
    return NextResponse.json(
      { error: 'Failed to fetch posts' },
      { status: 500 }
    );
  }
}