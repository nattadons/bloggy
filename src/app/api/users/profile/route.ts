import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { prisma } from '@/lib/prisma';

/**
 * API handler for getting user profile information
 * GET /api/users/profile
 */
export async function GET(request: NextRequest) {
  try {
    // Check if user is authenticated
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user?.id) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    // Get user data
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
    });

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Count user posts
    const postsCount = await prisma.post.count({
      where: { authorId: session.user.id }
    });

    // Count user comments
    const commentsCount = await prisma.comment.count({
      where: { authorId: session.user.id }
    });

    // Combine data for response
    const userData = {
      id: user.id,
      name: user.name,
      email: user.email,
      image: user.image,
      stats: {
        posts: postsCount,
        comments: commentsCount,
        // Add placeholder stats for future features
        savedPosts: 0,
        totalViews: 0,
        totalLikes: 0
      }
    };

    return NextResponse.json(userData);
  } catch (error) {
    console.error('Error fetching user profile:', error);
    return NextResponse.json(
      { error: 'Failed to fetch user profile' },
      { status: 500 }
    );
  }
}