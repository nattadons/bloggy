//app/admin/page.tsx
"use client";

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Post } from '@/app/components/PostCard';
import LoadingPage from '@/app/components/LoadingPage';

// Define Comment type
type Comment = {
  id: string;
  content: string;
  createdAt: string;
  authorId: string;
  author: {
    id: string;
    name?: string | null;
    image?: string | null;
  };
};

type PostWithComments = Post & {
    comments?: Comment[];
  };
  

export default function AdminPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [posts, setPosts] = useState<PostWithComments[]>([]);
  const [expandedPost, setExpandedPost] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState<{ [key: string]: boolean }>({});
  const [isDeletingComment, setIsDeletingComment] = useState<{ [key: string]: boolean }>({});

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

  // Fetch comments for a post
  const fetchComments = async (postId: string) => {
    try {
      const response = await fetch(`/api/posts/${postId}/comments`);
      if (!response.ok) throw new Error('Failed to fetch comments');
      
      const comments = await response.json();
      
      setPosts(prevPosts => 
        prevPosts.map(post => 
          post.id === postId 
            ? { ...post, comments: comments } 
            : post
        )
      );
    } catch (error) {
      console.error('Error fetching comments:', error);
    }
  };

  // Toggle expanded post to show comments
  const toggleExpandPost = (postId: string) => {
    if (expandedPost === postId) {
      setExpandedPost(null);
    } else {
      setExpandedPost(postId);
      // Fetch comments if not already loaded
      const post = posts.find(p => p.id === postId);
      if (!post?.comments) {
        fetchComments(postId);
      }
    }
  };

  // Handle post deletion
  const handleDeletePost = async (postId: string) => {
    if (!confirm('Are you sure you want to delete this post? This action cannot be undone.')) {
      return;
    }

    try {
      setIsDeleting(prev => ({ ...prev, [postId]: true }));
      
      const response = await fetch(`/api/posts/${postId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete post');
      }

      // Remove post from state
      setPosts(prevPosts => prevPosts.filter(post => post.id !== postId));
    } catch (error) {
      console.error('Error deleting post:', error);
      alert('Failed to delete post. Please try again.');
    } finally {
      setIsDeleting(prev => ({ ...prev, [postId]: false }));
    }
  };

  // Handle comment deletion
  const handleDeleteComment = async (commentId: string, postId: string) => {
    if (!confirm('Are you sure you want to delete this comment? This action cannot be undone.')) {
      return;
    }

    try {
      setIsDeletingComment(prev => ({ ...prev, [commentId]: true }));
      
      const response = await fetch(`/api/comments/${commentId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete comment');
      }

      // Update post comments in state
      setPosts(prevPosts => 
        prevPosts.map(post => {
          if (post.id === postId && post.comments) {
            return {
              ...post,
              comments: post.comments.filter(comment => comment.id !== commentId)
            };
          }
          return post;
        })
      );
      
    } catch (error) {
      console.error('Error deleting comment:', error);
      alert('Failed to delete comment. Please try again.');
    } finally {
      setIsDeletingComment(prev => ({ ...prev, [commentId]: false }));
    }
  };

  // Format date helper
  const formatDate = (dateString: string | Date) => {
    return new Date(dateString).toLocaleString();
  };

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

          {/* Posts List */}
          <div className="divide-y divide-gray-200 dark:divide-gray-700">
            {posts.length > 0 ? (
              posts.map(post => (
                <div key={post.id} className="p-6">
                  <div className="flex flex-col md:flex-row justify-between">
                    <div className="flex-1">
                      <div className="flex items-start">
                        {/* Post Author Image */}
                        <div className="mr-4">
                          {post.author?.image ? (
                            <div className="relative w-10 h-10 rounded-full overflow-hidden">
                              <Image
                                src={post.author.image}
                                alt={post.author.name || 'Author'}
                                fill
                                className="object-cover"
                              />
                            </div>
                          ) : (
                            <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                              <span className="text-gray-600 font-medium">
                                {post.author?.name?.[0] || 'A'}
                              </span>
                            </div>
                          )}
                        </div>
                        
                        {/* Post Info */}
                        <div className="flex-1">
                          <h2 className="text-lg font-medium text-gray-900 dark:text-white">
                            {post.title}
                          </h2>
                          <div className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                            <span>By {post.author?.name || 'Anonymous'}</span>
                            <span className="mx-2">•</span>
                            <span>ID: {post.id}</span>
                            <span className="mx-2">•</span>
                            <span>{formatDate(post.createdAt)}</span>
                          </div>
                          <p className="mt-2 text-sm text-gray-600 dark:text-gray-300 line-clamp-2">
                            {post.excerpt || post.content.substring(0, 150)}...
                          </p>
                        </div>
                      </div>
                      
                      {/* Post Actions */}
                      <div className="mt-4 flex items-center">
                        <button
                          onClick={() => toggleExpandPost(post.id)}
                          className="inline-flex items-center px-3 py-1.5 text-xs font-medium rounded-md bg-blue-50 text-blue-700 dark:bg-blue-900 dark:text-blue-200 hover:bg-blue-100 dark:hover:bg-blue-800 transition-colors"
                        >
                          {expandedPost === post.id ? 'Hide Comments' : `Show Comments`}
                        </button>
                        <a
                          href={`/blog/${post.id}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="ml-2 inline-flex items-center px-3 py-1.5 text-xs font-medium rounded-md bg-gray-50 text-gray-700 dark:bg-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                        >
                          View Post
                        </a>
                        <button
                          onClick={() => handleDeletePost(post.id)}
                          disabled={isDeleting[post.id]}
                          className="ml-2 inline-flex items-center px-3 py-1.5 text-xs font-medium rounded-md bg-red-50 text-red-700 dark:bg-red-900 dark:text-red-200 hover:bg-red-100 dark:hover:bg-red-800 transition-colors disabled:opacity-50"
                        >
                          {isDeleting[post.id] ? (
                            <>
                              <svg className="animate-spin -ml-1 mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                              </svg>
                              Deleting...
                            </>
                          ) : (
                            'Delete Post'
                          )}
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Comments Section (Expandable) */}
                  {expandedPost === post.id && (
                    <div className="mt-6 pl-14">
                      <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-3">
                        Comments
                      </h3>
                      
                      {post.comments && post.comments.length > 0 ? (
                        <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
                          {post.comments.map(comment => (
                            <div key={comment.id} className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
                              <div className="flex justify-between items-start">
                                <div className="flex items-start space-x-2">
                                  {/* Comment Author Image */}
                                  {comment.author?.image ? (
                                    <div className="relative flex-shrink-0 w-8 h-8 rounded-full overflow-hidden">
                                      <Image
                                        src={comment.author.image}
                                        alt={comment.author.name || 'User'}
                                        fill
                                        className="object-cover"
                                      />
                                    </div>
                                  ) : (
                                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-600 flex items-center justify-center">
                                      <span className="text-gray-600 dark:text-gray-300 text-sm font-medium">
                                        {comment.author?.name?.[0] || 'U'}
                                      </span>
                                    </div>
                                  )}
                                  
                                  <div>
                                    <div className="flex items-center space-x-2">
                                      <span className="text-sm font-medium text-gray-900 dark:text-white">
                                        {comment.author?.name || 'Anonymous'}
                                      </span>
                                      <span className="text-xs text-gray-500 dark:text-gray-400">
                                        {formatDate(comment.createdAt)}
                                      </span>
                                    </div>
                                    <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">
                                      {comment.content}
                                    </p>
                                  </div>
                                </div>
                                
                                {/* Comment Actions */}
                                <button
                                  onClick={() => handleDeleteComment(comment.id, post.id)}
                                  disabled={isDeletingComment[comment.id]}
                                  className="inline-flex items-center px-2 py-1 text-xs font-medium rounded-md bg-red-50 text-red-700 dark:bg-red-900 dark:text-red-200 hover:bg-red-100 dark:hover:bg-red-800 transition-colors disabled:opacity-50"
                                >
                                  {isDeletingComment[comment.id] ? (
                                    <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                  ) : (
                                    'Delete'
                                  )}
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-4 text-sm text-gray-500 dark:text-gray-400">
                          {post.comments ? 'No comments found' : 'Loading comments...'}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))
            ) : (
              <div className="p-6 text-center">
                <p className="text-gray-500 dark:text-gray-400">
                  No posts found
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}