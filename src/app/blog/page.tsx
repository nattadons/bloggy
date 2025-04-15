// app/blog/page.tsx
import Link from 'next/link';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth'; 
import { prisma } from '@/lib/prisma';
import SearchAndFilter from '../components/blog/SearchAndFilter';

// ฟังก์ชันสำหรับดึงข้อมูลโพสต์เริ่มต้น (5 โพสต์แรก)
async function getInitialPosts() {
  try {
    const posts = await prisma.post.findMany({
      where: {
        published: true,
      },
      orderBy: {
        createdAt: 'desc'
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
      take: 5 // ดึงเพียง 5 โพสต์แรก
    });
    
    return posts;
  } catch (error) {
    console.error('Error fetching posts:', error);
    return [];
  }
}

export default async function BlogPage() {
  // ดึงข้อมูล session และโพสต์พร้อมกัน
  const [session, initialPosts] = await Promise.all([
    getServerSession(authOptions),
    getInitialPosts()
  ]);

  return (
    <div className="min-h-screen py-6 sm:py-8 md:py-12 px-3 sm:px-4 md:px-6">
      <main className="max-w-full sm:max-w-xl md:max-w-3xl lg:max-w-5xl xl:max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-4 sm:mb-6 md:mb-10 text-center">
          <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-2 sm:mb-3 md:mb-4">Latest Blog Posts</h1>
          <p className="text-sm sm:text-base md:text-lg text-gray-600 dark:text-gray-300 max-w-xs sm:max-w-lg md:max-w-2xl mx-auto">
            Explore thoughtful articles written by our community of writers.
          </p>
          {session?.user?.name && (
            <p className="mt-2 text-sm text-gray-600">Welcome, {session.user.name}!</p>
          )}
        </div>

        {/* Client Component สำหรับการค้นหา, กรองข้อมูล และ infinite scroll */}
        <SearchAndFilter 
          initialPosts={initialPosts} 
          userId={session?.user?.id} 
        />
      </main>
    </div>
  );
}