// app/blog/[id]/page.tsx
"use client"

import { useParams, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { formatDistance } from 'date-fns';
import { Post } from '@/app/components/PostCard';
import LoadingPage from '@/app/components/LoadingPage';



export default function PostDetailPage() {
  const router = useRouter();
  const params = useParams();
  const postId = params.id as string;

  const [post, setPost] = useState<Post | null>(null);
  const [relatedPosts, setRelatedPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        setLoading(true);

        // ดึงข้อมูลจาก API
        const response = await fetch(`/api/posts/${postId}`);

        if (!response.ok) {
          if (response.status === 404) {
            router.push('/blog');
            return;
          }
          throw new Error('Failed to fetch post');
        }

        const data = await response.json();
        setPost(data.post);
        setRelatedPosts(data.relatedPosts || []);
      } catch (err) {
        console.error('Error fetching post:', err);
        setError('Could not load post. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    if (postId) {
      fetchPost();
    }
  }, [postId, router]);

  if (loading) {
    return (
      <LoadingPage />
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 mb-4">{error}</p>
          <Link href="/blog" className="text-blue-600 hover:underline">
            Back to Blog
          </Link>
        </div>
      </div>
    );
  }

  if (!post) {
    return null;
  }

  // แปลงวันที่ให้อยู่ในรูปแบบที่อ่านง่าย
  const formattedDate = formatDistance(
    new Date(post.createdAt),
    new Date(),
    { addSuffix: true }
  );

  // คำนวณเวลาในการอ่าน
  const wordCount = post.content ? post.content.split(/\s+/).length : 0;
  const readTime = `${Math.max(1, Math.ceil(wordCount / 200))} min`;

  // แยกแท็กออกมาเป็นอาร์เรย์ ถ้ามี
  const tags = post.tags ? post.tags.split(',').map(tag => tag.trim()) : [];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Hero Image Section */}
      <div className="relative w-full h-[50vh] md:h-[60vh] mb-8">
        <div className="absolute inset-0 bg-black/50 z-[1]" />
        <div className="relative w-full h-full">
          <Image
            src={post.image || '/images/default-image.jpg'}
            alt={post.title}
            fill
            priority
            className="object-cover"
          />
        </div>
        <div className="absolute inset-0 flex flex-col items-center justify-center z-[2] text-white px-4">
          <h1 className="text-3xl md:text-5xl font-bold text-center mb-4 max-w-4xl">
            {post.title}
          </h1>
          <div className="flex items-center space-x-4 text-gray-200 text-sm md:text-base">
            <div className="flex items-center">
              {post.author?.image ? (
                <div className="relative w-8 h-8 rounded-full overflow-hidden mr-2">
                  <Image
                    src={post.author.image}
                    alt={post.author.name || 'Author'}
                    fill
                    className="object-cover"
                  />
                </div>
              ) : (
                <div className="w-8 h-8 rounded-full bg-gray-200 mr-2 flex items-center justify-center">
                  <span className="text-gray-600 font-medium">
                    {post.author?.name?.[0] || 'A'}
                  </span>
                </div>
              )}
              <span>{post.author?.name || 'Anonymous'}</span>
            </div>
            <span>•</span>
            <span>{formattedDate}</span>
            <span>•</span>
            <span>{readTime} read</span>
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
        {tags.length > 0 && (
          <div className="mb-8 flex flex-wrap justify-center gap-2">
            {tags.map((tag, index) => (
              <span
                key={index}
                className="px-3 py-1 bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 rounded-full text-sm"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* เนื้อหาบทความ */}
        <article className="prose dark:prose-invert lg:prose-lg max-w-none bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 md:p-8">
          {/* แสดง Image */}
          <div className="my-8 overflow-hidden rounded-lg shadow-md">
            <div className="relative aspect-video w-full">
              <Image
                src={post.image || '/images/default-image.jpg'}
                alt={post.title || 'Blog image'}
                fill
                sizes="(max-width: 768px) 100vw, 768px"
                className="object-cover hover:scale-105 transition-transform duration-300"
                priority
              />
            </div>
          </div>
          {/* ถ้ามี excerpt ให้แสดงเป็น intro */}
          {post.excerpt && (
            <p className="text-lg font-medium text-gray-600 dark:text-gray-300 mb-8 border-l-4 border-blue-500 pl-4 italic">
              {post.excerpt}
            </p>
          )}



          {/* แสดงเนื้อหาหลัก */}
          <div>
            {post.content.split('\n').map((paragraph, index) => (
              paragraph.trim() ? <p key={index}>{paragraph}</p> : <br key={index} />
            ))}
          </div>
        </article>

        {/* ข้อมูลผู้เขียน */}
        <div className="mt-12 bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
          <div className="flex items-start space-x-4">
            {post.author?.image ? (
              <div className="relative w-16 h-16 rounded-full overflow-hidden flex-shrink-0">
                <Image
                  src={post.author.image}
                  alt={post.author.name || 'Author'}
                  fill
                  className="object-cover"
                />
              </div>
            ) : (
              <div className="w-16 h-16 rounded-full bg-gray-200 flex-shrink-0 flex items-center justify-center">
                <span className="text-2xl text-gray-600 font-medium">
                  {post.author?.name?.[0] || 'A'}
                </span>
              </div>
            )}
            <div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                {post.author?.name || 'Anonymous'}
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mt-1">
                Author of this post
              </p>
            </div>
          </div>
        </div>

        {/* โพสต์ที่เกี่ยวข้อง */}
        {relatedPosts.length > 0 && (
          <div className="mt-12">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 text-center">Related Posts</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {relatedPosts.map(relatedPost => (
                <Link href={`/blog/${relatedPost.id}`} key={relatedPost.id} className="block group">
                  <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden h-full hover:shadow-lg transition-shadow">
                    <div className="relative w-full h-48 overflow-hidden">
                      <Image
                        src={relatedPost.image || '/images/default-image.jpg'}
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
                        {relatedPost.excerpt || relatedPost.content.substring(0, 150) + '...'}
                      </p>
                      <div className="mt-3 flex items-center text-xs text-gray-500 dark:text-gray-400">
                        <span>{formatDistance(new Date(relatedPost.createdAt), new Date(), { addSuffix: true })}</span>
                        <span className="mx-2">•</span>
                        <span>
                          {`${Math.max(1, Math.ceil((relatedPost.content.split(/\s+/).length) / 200))} min read`}
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}