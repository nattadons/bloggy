import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
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