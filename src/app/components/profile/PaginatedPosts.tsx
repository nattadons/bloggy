// app/components/profile/PaginatedPosts.tsx
'use client';

import { useState, useEffect, useCallback } from 'react';
import { Post } from '@/app/components/PostCard';
import PostCard from '@/app/components/profile/PostCard';
import PaginationControl from '@/app/components/profile/PaginationControl';
import Link from 'next/link';

interface PaginatedPostsProps {
  userId: string;
  onDeletePost?: (postId: string) => void;
}

// API service for posts
const api = {
  fetchUserPosts: async (userId: string, page = 1, limit = 5) => {
    const response = await fetch(`/api/posts?userId=${userId}&page=${page}&limit=${limit}`);
    if (!response.ok) throw new Error('Failed to fetch user posts');
    return response.json();
  }
};

export default function PaginatedPosts({ userId, onDeletePost }: PaginatedPostsProps) {
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalPosts, setTotalPosts] = useState(0);
  const [postsPerPage, setPostsPerPage] = useState(5);
  const [usePaginationStyle, setUsePaginationStyle] = useState(false); // Use true for normal pagination, false for "Load More"

  // Function to fetch posts
  const fetchPosts = useCallback(async (pageNum = 1, replace = true) => {
    if (!userId) return;

    setIsLoading(true);
    try {
      const data = await api.fetchUserPosts(userId, pageNum, postsPerPage);
      
      // Update pagination info
      setTotalPages(data.pagination.totalPages);
      setTotalPosts(data.pagination.total);
      
      // Update posts list
      if (replace || pageNum === 1) {
        setPosts(data.posts || []);
      } else {
        // Append posts for "Load More" functionality
        setPosts(prev => [...prev, ...(data.posts || [])]);
      }
    } catch (error) {
      console.error('Error fetching posts:', error);
    } finally {
      setIsLoading(false);
    }
  }, [userId, postsPerPage]);

  // Initial fetch on component mount
  useEffect(() => {
    fetchPosts(1, true);
  }, [fetchPosts]);

  // Handle page change for traditional pagination
  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    fetchPosts(newPage, true);
    
    // Scroll to top when changing pages
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Handle "Load More" functionality
  const handleLoadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchPosts(nextPage, false);
  };

  // Handle post deletion
  const handleDelete = async (e: React.MouseEvent, postId: string) => {
    e.preventDefault();
    e.stopPropagation();

    if (window.confirm('Are you sure you want to delete this post? This action cannot be undone.')) {
      try {
        const response = await fetch(`/api/posts/${postId}`, {
          method: 'DELETE',
        });
        
        if (!response.ok) {
          throw new Error('Failed to delete post');
        }
        
        // Remove post from local state
        setPosts(prev => prev.filter(post => post.id !== postId));
        
        // Update total count
        setTotalPosts(prev => prev - 1);
        
        // Call optional callback
        if (onDeletePost) {
          onDeletePost(postId);
        }
      } catch (error) {
        console.error('Error deleting post:', error);
        alert('Failed to delete the post. Please try again.');
      }
    }
  };

  // Handle edit post
  const handleEdit = (e: React.MouseEvent, postId: string) => {
    e.preventDefault();
    e.stopPropagation();
    window.location.href = `/blog/edit/${postId}`;
  };

  // Handle view post
  const handleView = (postId: string) => {
    window.location.href = `/blog/${postId}`;
  };

  // Toggle between pagination styles
  const togglePaginationStyle = () => {
    setUsePaginationStyle(prev => !prev);
    setPage(1);
    setPosts([]);
    fetchPosts(1, true);
  };

  // Render empty state
  if (posts.length === 0 && !isLoading) {
    return (
      <div className="text-center py-12 px-4">
        <div className="mx-auto max-w-md">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-400 dark:text-gray-500 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
          </svg>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">No posts yet</h3>
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
            Get started by creating your first blog post.
          </p>
          <div className="mt-6">
            <Link
              href="/blog/new"
              className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-full shadow hover:shadow-lg transition-all duration-300"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
              </svg>
              Create New Post
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with post count and pagination style switcher */}
      <div className="flex flex-wrap justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          Your Posts ({totalPosts})
        </h2>
        
        {totalPages > 1 && (
          <div className="mt-2 sm:mt-0">
            <button 
              onClick={togglePaginationStyle}
              className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
            >
              {usePaginationStyle ? 'Switch to Load More' : 'Switch to Pagination'}
            </button>
          </div>
        )}
      </div>

      {/* Posts Grid */}
      {isLoading && posts.length === 0 ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {posts.map(post => (
            <PostCard
              key={post.id}
              post={post}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onView={handleView}
            />
          ))}
        </div>
      )}

      {/* Pagination Control */}
      {totalPages > 1 && (
        <PaginationControl
          currentPage={page}
          totalPages={totalPages}
          isLoading={isLoading}
          onPageChange={handlePageChange}
          loadMore={handleLoadMore}
          loadMoreStyle={!usePaginationStyle}
        />
      )}
    </div>
  );
}