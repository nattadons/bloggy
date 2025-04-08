// app/blog/[id]/page.tsx
"use client"

import { useParams, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { mockPosts } from '../../data/posts';

export default function PostDetailPage() {
  const router = useRouter();
  const params = useParams();
  const postId = params.id as string;
  
  const [post, setPost] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // ในโปรเจคจริง คุณจะดึงข้อมูลจาก API หรือฐานข้อมูล
    // ตัวอย่างเช่น: fetch(`/api/posts/${postId}`)
    
    // จำลองการดึงข้อมูล
    console.log("URL Parameters:", params);
    const foundPost = mockPosts.find(p => p.id === postId);
    
    if (foundPost) {
      setPost(foundPost);
    } else {
      // ถ้าไม่พบโพสต์ นำทางกลับไปยังหน้า blog
      router.push('/blog');
    }
    
    setLoading(false);
  }, [postId, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!post) {
    return null; // หน้านี้จะไม่แสดงผลเนื่องจาก router จะนำทางกลับไปยังหน้า blog แล้ว
  }

  // แปลงวันที่ให้อยู่ในรูปแบบที่อ่านง่าย
  const formattedDate = new Date(post.date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  // หาโพสต์ที่เกี่ยวข้อง (โพสต์อื่นๆ ที่ไม่ใช่โพสต์ปัจจุบัน)
  const relatedPosts = mockPosts.filter(p => p.id !== postId).slice(0, 2);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Hero Image Section - Updated z-index values */}
      <div className="relative w-full h-[50vh] md:h-[60vh] mb-8">
        {/* Changed z-index from 10 to 1 */}
        <div className="absolute inset-0 bg-black/50 z-1" />
        <div className="relative w-full h-full">
          <Image 
            src={post.coverImage || '/images/Bloggy.png'} 
            alt={post.title}
            fill
            priority
            className="object-cover"
          />
        </div>
        {/* Changed z-index from 20 to 2 */}
        <div className="absolute inset-0 flex flex-col items-center justify-center z-2 text-white px-4">
          <h1 className="text-3xl md:text-5xl font-bold text-center mb-4 max-w-4xl">
            {post.title}
          </h1>
          <div className="flex items-center space-x-4 text-gray-200 text-sm md:text-base">
            <div className="flex items-center">
              <div className="relative w-8 h-8 rounded-full overflow-hidden mr-2">
                <Image 
                  src={post.authorAvatar} 
                  alt={post.author} 
                  fill
                  className="object-cover"
                />
              </div>
              <span>{post.author}</span>
            </div>
            <span>•</span>
            <span>{formattedDate}</span>
            <span>•</span>
            <span>{post.readTime} read</span>
          </div>
        </div>
      </div>
        
      <main className="max-w-4xl mx-auto px-4 py-8">
        {/* ปุ่มกลับไปยังหน้า Blog */}
        <div className="mb-8">
          <Link 
            href="/blog" 
            className="inline-flex items-center text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Blog
          </Link>
        </div>
        
        {/* แท็ก */}
        <div className="mb-8 flex flex-wrap justify-center gap-2">
          {post.tags.map((tag: string) => (
            <span 
              key={tag} 
              className="px-3 py-1 bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 rounded-full text-sm"
            >
              {tag}
            </span>
          ))}
        </div>
        
        {/* เนื้อหาบทความ */}
        <article className="prose dark:prose-invert lg:prose-lg max-w-none bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 md:p-8">
          <div dangerouslySetInnerHTML={{ __html: post.content }} />
        </article>
        
        {/* ข้อมูลผู้เขียน */}
        <div className="mt-12 bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
          <div className="flex items-start space-x-4">
            <img 
              src={post.authorAvatar} 
              alt={post.author} 
              className="w-16 h-16 rounded-full object-cover"
            />
            <div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                {post.author}
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mt-1">
                {post.authorBio}
              </p>
            </div>
          </div>
        </div>
        
        {/* โพสต์ที่เกี่ยวข้อง */}
        <div className="mt-12">
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 text-center">Related Posts</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {relatedPosts.map(relatedPost => (
              <Link href={`/blog/${relatedPost.id}`} key={relatedPost.id} className="block group">
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden h-full hover:shadow-lg transition-shadow">
                  <div className="relative w-full h-48 overflow-hidden">
                    <Image 
                      src={relatedPost.coverImage || '/images/Bloggy.png'} 
                      alt={relatedPost.title}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                  </div>
                  <div className="p-4">
                    <h4 className="text-lg font-bold text-gray-900 dark:text-white mb-2 line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                      {relatedPost.title}
                    </h4>
                    <p className="text-gray-600 dark:text-gray-300 text-sm line-clamp-2">
                      {relatedPost.excerpt}
                    </p>
                    <div className="mt-3 flex items-center text-xs text-gray-500 dark:text-gray-400">
                      <span>{new Date(relatedPost.date).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      })}</span>
                      <span className="mx-2">•</span>
                      <span>{relatedPost.readTime} read</span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}