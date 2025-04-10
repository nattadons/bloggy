"use client";

import { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import { PostCard } from '@/app/components/PostCard';

// Define types
type Author = {
  id: string;
  name: string | null;
  image?: string | null;
};

type Post = {
  id: string;
  title: string;
  excerpt?: string | null;
  content: string;
  createdAt: Date;
  updatedAt: Date;
  published: boolean;
  author: Author;
  authorId: string;
  tags?: string | null;
};

type Pagination = {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
};

type SearchAndFilterProps = {
  initialPosts: Post[];
  userId?: string;
};

export default function SearchAndFilter({ initialPosts, userId }: SearchAndFilterProps) {
  const [posts, setPosts] = useState<Post[]>(initialPosts || []);
  const [pagination, setPagination] = useState<Pagination>({
    total: 0,
    page: 1,
    limit: 5,
    totalPages: 1
  });
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('all'); // 'all', 'my'
  const [debouncedSearch, setDebouncedSearch] = useState('');

  const loader = useRef<HTMLDivElement>(null);

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Reset posts when search query or tab changes
  useEffect(() => {
    const fetchInitialPosts = async () => {
      setLoading(true);
      try {
        const res = await fetch(
          `/api/posts?page=1&limit=5${activeTab === 'my' && userId ? `&userId=${userId}` : ''}${debouncedSearch ? `&search=${debouncedSearch}` : ''}`
        );

        if (!res.ok) {
          throw new Error(`HTTP error! Status: ${res.status}`);
        }

        const data = await res.json();

        // Ensure data has the expected structure
        if (data && Array.isArray(data.posts)) {
          setPosts(data.posts);

          if (data.pagination && typeof data.pagination === 'object') {
            setPagination({
              total: data.pagination.total || 0,
              page: data.pagination.page || 1,
              limit: data.pagination.limit || 5,
              totalPages: data.pagination.totalPages || 1
            });
          }
        } else {
          console.error('Unexpected API response format:', data);
          setPosts([]);
        }
      } catch (error) {
        console.error('Error fetching posts:', error);
        setPosts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchInitialPosts();
  }, [debouncedSearch, activeTab, userId]);

  // Fetch more posts
  const loadMorePosts = useCallback(async () => {
    // Safety check to prevent API calls when not needed
    if (loading || !pagination || pagination.page >= pagination.totalPages) return;

    setLoading(true);
    try {
      const nextPage = (pagination?.page || 1) + 1;
      const res = await fetch(
        `/api/posts?page=${nextPage}&limit=${pagination?.limit || 5}${activeTab === 'my' && userId ? `&userId=${userId}` : ''}${debouncedSearch ? `&search=${debouncedSearch}` : ''}`
      );

      if (!res.ok) {
        throw new Error(`HTTP error! Status: ${res.status}`);
      }

      const data = await res.json();

      // Ensure data has the expected structure
      if (data && Array.isArray(data.posts)) {
        setPosts(prevPosts => [...prevPosts, ...data.posts]);

        if (data.pagination && typeof data.pagination === 'object') {
          setPagination({
            total: data.pagination.total || 0,
            page: data.pagination.page || 1,
            limit: data.pagination.limit || 5,
            totalPages: data.pagination.totalPages || 1
          });
        }
      } else {
        console.error('Unexpected API response format:', data);
      }
    } catch (error) {
      console.error('Error fetching more posts:', error);
    } finally {
      setLoading(false);
    }
  }, [pagination, loading, activeTab, userId, debouncedSearch]);

  // Set up Intersection Observer for infinite scroll
  useEffect(() => {
    if (!loader.current || !pagination) return;

    const observer = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && !loading && pagination.page < pagination.totalPages) {
        loadMorePosts();
      }
    }, { threshold: 1.0 });

    observer.observe(loader.current);

    return () => {
      if (loader.current) {
        observer.unobserve(loader.current);
      }
    };
  }, [loadMorePosts, loading, pagination]);

  return (
    <>
      {/* Search and Filter Section */}
      <div className="mb-6">
        {/* Search Bar */}
        <div className="relative mb-4">
          <input
            type="text"
            placeholder="Search posts..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full py-2 px-4 pr-10 rounded-md border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
          />
          <svg
            className="absolute right-3 top-2.5 h-5 w-5 text-gray-400"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-200">
          <button
            onClick={() => setActiveTab('all')}
            className={`py-2 px-4 font-medium text-sm focus:outline-none ${activeTab === 'all'
              ? 'text-blue-600 border-b-2 border-blue-600'
              : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
          >
            All Blogs
          </button>
          <button
            onClick={() => setActiveTab('my')}
            className={`py-2 px-4 font-medium text-sm focus:outline-none ${activeTab === 'my'
              ? 'text-blue-600 border-b-2 border-blue-600'
              : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            disabled={!userId}
          >
            My Blogs
          </button>
        </div>
      </div>

      {/* Write New Post Button */}
      <div className="flex justify-end sm:justify-end mb-4 sm:mb-6">
        <Link
          href="/blog/new"
          className="inline-flex items-center px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm md:text-base bg-blue-600 text-white rounded-md hover:shadow-lg hover:scale-105 transition-all duration-300 ease-in-out group relative overflow-hidden"
        >
          <span className="relative z-10 flex items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="w-0 h-0 mr-0 transition-all duration-300 ease-in-out group-hover:w-4 group-hover:h-4 group-hover:mr-1"
            >
              <path fillRule="evenodd" d="M12 3.75a.75.75 0 01.75.75v6.75h6.75a.75.75 0 010 1.5h-6.75v6.75a.75.75 0 01-1.5 0v-6.75H4.5a.75.75 0 010-1.5h6.75V4.5a.75.75 0 01.75-.75z" clipRule="evenodd" />
            </svg>
            <span className="hidden xs:inline-block">Write</span> New Post
          </span>
          <span className="absolute w-0 h-full bg-gradient-to-r from-blue-500 to-purple-600 left-0 bottom-0 transition-all duration-300 ease-in-out group-hover:w-full"></span>
        </Link>
      </div>

      {/* Blog Posts Stack */}
      <div className="flex flex-col space-y-4 sm:space-y-6">
        {posts.length > 0 ? (
          <>
            {posts.map((post, index) => (
              <PostCard key={`${post.id}-${index}`} post={post} />
            ))}

            {/* Loading Indicator and Intersection Observer Target */}
            <div ref={loader} className="py-4 flex justify-center">
              {loading && (
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 rounded-full bg-blue-600 animate-pulse"></div>
                  <div className="w-4 h-4 rounded-full bg-blue-600 animate-pulse delay-75"></div>
                  <div className="w-4 h-4 rounded-full bg-blue-600 animate-pulse delay-150"></div>
                </div>
              )}

              {!loading && pagination && pagination.page >= pagination.totalPages && posts.length > 0 && (
                <p className="text-sm text-gray-500">No more posts to load</p>
              )}
            </div>
          </>
        ) : (
          <div className="text-center py-10">
            <p className="text-gray-500">
              {activeTab === 'all'
                ? 'No posts found. Try a different search query.'
                : 'You haven\'t created any posts yet.'}
            </p>
            {activeTab === 'my' && (
              <Link href="/blog/new" className="mt-4 inline-block px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
                Create Your First Post
              </Link>
            )}
          </div>
        )}
      </div>
    </>
  );
}