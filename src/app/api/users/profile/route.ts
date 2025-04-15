import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth'; 
import { prisma } from '@/lib/prisma';

/**
 * API handler for getting user profile information
 * GET /api/users/profile
 */
// ในไฟล์ app/api/users/profile/route.ts
export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  
  if (!session?.user?.id) {
    return NextResponse.json(
      { message: "Not authenticated" },
      { status: 401 }
    );
  }
  
  try {
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      include: {
        posts: true,
        comments: true,
        savedPosts: true,
        // รวมถึงความสัมพันธ์อื่นๆ ตามต้องการ
      },
    });
    
    if (!user) {
      return NextResponse.json(
        { message: "User not found" },
        { status: 404 }
      );
    }
    
    // คำนวณสถิติ
    const stats = {
      posts: user.posts.length,
      comments: user.comments.length,
      savedPosts: user.savedPosts.length, // นับจำนวนโพสต์โปรด
      
    };
    
    return NextResponse.json({
      id: user.id,
      name: user.name,
      email: user.email,
      image: user.image,
      stats,
    });
  } catch (error) {
    console.error("Profile error:", error);
    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 500 }
    );
  }
}