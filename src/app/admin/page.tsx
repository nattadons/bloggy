"use client";

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import LoadingPage from '@/app/components/LoadingPage';
import PostList from '@/app/components/admin/PostList';
import { Post } from '@/app/components/PostCard';
import { Comment } from './types';

export type PostWithComments = Post & {
  comments?: Comment[];
};

export default function AdminPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [posts, setPosts] = useState<PostWithComments[]>([]);

  // Fetch all posts
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('/api/posts?limit=100');
        const data = await response.json();
        
        if (data && data.posts) {
          setPosts(data.posts);
        }
      } catch (error) {
        console.error('Error fetching posts:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (status === 'authenticated') {
      // ตรวจสอบว่าผู้ใช้เป็น admin หรือไม่
      if (session?.user?.role === 'admin') {
        fetchPosts();
      } else {
        // ถ้าไม่ใช่ admin ให้ redirect ไปหน้าหลัก
        router.push('/');
      }
    } else if (status === 'unauthenticated') {
      router.push('/login');
    }
  }, [status, router, session]);

  if (isLoading) {
    return <LoadingPage />;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Admin Dashboard</h1>
            <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
              Manage all posts and comments
            </p>
          </div>

          <PostList 
            posts={posts}
            setPosts={setPosts}
          />
        </div>
      </div>
    </div>
  );
}