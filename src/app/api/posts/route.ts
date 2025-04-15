import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth'; 
import { prisma } from '@/lib/prisma';
import { cloudinary } from '@/lib/cloudinary';
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
        { error: 'Please login before creating post' },
        { status: 401 }
      );
    }

    // รับข้อมูลจาก form
    const formData = await request.formData();
    
    // ดึงข้อมูลจาก form
    const title = formData.get('title') as string;
    const excerpt = formData.get('excerpt') as string;
    const content = formData.get('content') as string;
    const tags = formData.get('tags') as string;
    const imageFile = formData.get('image') as File | null;
    
    // ตรวจสอบความถูกต้องของข้อมูล
    if (!title || !content) {
      return NextResponse.json(
        { error: "Please enter the article title and content." },
        { status: 400 }
      );
    }

    // ตัวแปรสำหรับเก็บ URL ของรูปภาพ
    let imageUrl: string | null = null;
    
    // จัดการกับการอัปโหลดรูปภาพ (ถ้ามี)
    if (imageFile) {
      try {
        // แปลงไฟล์เป็น buffer และอัปโหลดไปยัง Cloudinary
        const buffer = await imageFile.arrayBuffer();
        const base64Image = Buffer.from(buffer).toString('base64');
        const dataURI = `data:${imageFile.type};base64,${base64Image}`;
        
        const uploadResult = await new Promise((resolve, reject) => {
          cloudinary.uploader.upload(
            dataURI,
            {
              folder: 'blog_posts', // โฟลเดอร์ใน Cloudinary
              resource_type: 'image',
              transformation: [
                { width: 1200, height: 630, crop: 'fill' }, // ปรับขนาดรูปภาพให้เหมาะกับหน้าปก
                { quality: 'auto:good' } // ปรับคุณภาพอัตโนมัติ
              ]
            },
            (error, result) => {
              if (error) reject(error);
              else resolve(result);
            }
          );
        });
        
        // เก็บ URL ของรูปภาพ
        imageUrl = (uploadResult as any).secure_url;
        console.log('Image uploaded successfully:', imageUrl);
      } catch (uploadError) {
        console.error('Error uploading image:', uploadError);
        // ไม่ได้คืนค่าข้อผิดพลาดทันที เพื่อให้สามารถสร้างโพสต์ได้แม้การอัปโหลดรูปภาพล้มเหลว
      }
    }

    // บันทึกข้อมูลลงฐานข้อมูล
    const post = await prisma.post.create({
      data: {
        title,
        excerpt,
        content,
        tags,
        image: imageUrl, // เก็บ URL ของรูปภาพที่อัปโหลด
        authorId: session.user.id,
        published: true,
      },
    });

    // ส่งข้อมูลกลับไป
    return NextResponse.json({ success: true, post }, { status: 201 });
  } catch (error) {
    console.error('Error creating post:', error);
    return NextResponse.json(
      { error: "Failed to create the article." },
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
    // Get query parameters for filtering and pagination
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '5');
    const search = searchParams.get('search');
    const skip = (page - 1) * limit;
    
    // Build the where condition
    const where: any = {
      published: true,
    };
    
    // Add user filter if needed
    if (userId) {
      where.authorId = userId;
    }
    
    // Add search filter if provided - MODIFIED FOR MYSQL COMPATIBILITY
    if (search) {
      try {
        // MySQL compatible search (no mode: 'insensitive')
        where.OR = [
          { title: { contains: search } },
          { excerpt: { contains: search } },
          { content: { contains: search } },
          { tags: { contains: search } },
        ];
        
        // Alternatively, for better case-insensitive search in MySQL, you could use:
        // where.OR = [
        //   { title: { equals: search, mode: 'insensitive' } }, // Will error in MySQL
        //   { excerpt: { equals: search, mode: 'insensitive' } }, // Will error in MySQL
        //   { content: { equals: search, mode: 'insensitive' } }, // Will error in MySQL
        // ];
        
      } catch (searchError) {
        console.error('Error with search configuration:', searchError);
        // Log the error for debugging but don't let it crash
        console.log('Search term was:', search);
        
        // Return empty array to prevent app from crashing
        return NextResponse.json({ 
          posts: [],
          pagination: {
            total: 0,
            page: 1,
            limit: 5,
            totalPages: 1
          },
          error: 'Search configuration error'
        }, { status: 200 });
      }
    }
    
    // Build the query
    const query: any = {
      where,
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
      },
      skip,
      take: limit
    };
    
    // Fetch posts from database with pagination
    const posts = await prisma.post.findMany(query);
    
    // Get total count for pagination info
    const totalCount = await prisma.post.count({ where });
    
    // Ensure the API always returns valid pagination information
    const validPage = Math.max(1, page);
    const validLimit = Math.max(1, limit);
    const totalPages = Math.max(1, Math.ceil(totalCount / validLimit));
    
    return NextResponse.json({ 
      posts: Array.isArray(posts) ? posts : [],
      pagination: {
        total: totalCount,
        page: validPage,
        limit: validLimit,
        totalPages: totalPages
      }
    });
  } catch (error) {
    console.error('Error fetching posts:', error);
    // Return a safe default response on error
    return NextResponse.json(
      { 
        posts: [],
        pagination: {
          total: 0,
          page: 1,
          limit: 5,
          totalPages: 1
        },
        error: 'Failed to fetch posts'
      },
      { status: 500 }
    );
  }
}