"use client";

import { useState, useEffect, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { Post } from '@/app/components/PostCard';
import LoadingPage from '@/app/components/LoadingPage';

// Define user profile data type
type UserProfile = {
  id: string;
  name: string | null;
  email: string;
  image: string | null;
  stats: {
    posts: number;
    comments: number;
    savedPosts: number;
    totalViews: number;
    totalLikes: number;
  };
};

// API services - centralized data fetching functions
const api = {
  fetchUserProfile: async () => {
    const response = await fetch('/api/users/profile');
    if (!response.ok) throw new Error('Failed to fetch user profile');
    return response.json();
  },
  
  fetchUserPosts: async (userId: string) => {
    const response = await fetch(`/api/posts?userId=${userId}`);
    if (!response.ok) throw new Error('Failed to fetch user posts');
    return response.json();
  },
  
  deletePost: async (postId: string) => {
    const response = await fetch(`/api/posts/${postId}`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error('Failed to delete post');
    return response.json();
  }
};

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [userPosts, setUserPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('posts'); // 'posts', 'saved'
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);

  // Redirect if not authenticated
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    }
  }, [status, router]);

  // Memoized data fetching functions with useCallback
  const fetchUserData = useCallback(async () => {
    if (!session?.user?.id || status !== 'authenticated') return;
    
    setIsLoading(true);
    try {
      // Fetch both profile and posts in parallel
      const [profileData, postsData] = await Promise.all([
        api.fetchUserProfile(),
        api.fetchUserPosts(session.user.id)
      ]);
      
      setUserProfile(profileData);
      setUserPosts(postsData.posts || []);
    } catch (error) {
      console.error('Error fetching user data:', error);
    } finally {
      setIsLoading(false);
    }
  }, [session?.user?.id, status]);

  // Single combined data fetch effect
  useEffect(() => {
    fetchUserData();
  }, [fetchUserData]);

  // Handle edit post - memoized to prevent recreation on renders
  const handleEditPost = useCallback((e: React.MouseEvent, postId: string) => {
    e.preventDefault();
    e.stopPropagation();
    router.push(`/blog/edit/${postId}`);
  }, [router]);

  // Handle delete post with confirmation - memoized
  const handleDeletePost = useCallback(async (e: React.MouseEvent, postId: string) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (window.confirm('Are you sure you want to delete this post? This action cannot be undone.')) {
      try {
        await api.deletePost(postId);
        
        // Update the posts list by removing the deleted post
        setUserPosts(prevPosts => prevPosts.filter(post => post.id !== postId));
        
        // Update profile stats if we have a profile
        setUserProfile(prevProfile => {
          if (!prevProfile) return null;
          
          return {
            ...prevProfile,
            stats: {
              ...prevProfile.stats,
              posts: prevProfile.stats.posts - 1
            }
          };
        });
      } catch (error) {
        console.error('Error deleting post:', error);
        alert('Failed to delete the post. Please try again.');
      }
    }
  }, []);

  // Handle view post - memoized
  const handleViewPost = useCallback((postId: string) => {
    router.push(`/blog/${postId}`);
  }, [router]);

  // Handle tab change - memoized
  const handleTabChange = useCallback((tab: string) => {
    setActiveTab(tab);
  }, []);

  // Show loading state only when necessary
  if (status === 'loading' || (isLoading && !userProfile)) {
    return <LoadingPage />;
  }

  // If no session, return null (will redirect via useEffect)
  if (!session?.user) {
    return null;
  }

  // Extract stats from profile for easier access
  const stats = userProfile?.stats || {
    posts: 0,
    comments: 0,
    savedPosts: 0,
    totalViews: 0,
    totalLikes: 0
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        {/* Profile Header - Glassmorphism Card */}
        <div className="relative overflow-hidden rounded-3xl bg-white/30 dark:bg-gray-800/30 backdrop-blur-xl border border-white/20 dark:border-gray-700/20 shadow-xl mb-8">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-20 pointer-events-none">
            <svg className="absolute left-0 top-0 h-full w-full" width="100%" height="100%" viewBox="0 0 800 800" preserveAspectRatio="none">
              <defs>
                <pattern id="dot-pattern" width="30" height="30" patternUnits="userSpaceOnUse">
                  <circle cx="15" cy="15" r="1" fill="currentColor" className="text-blue-500 dark:text-blue-300" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#dot-pattern)" />
            </svg>
          </div>
          
          {/* Gradient Orbs */}
          <div className="absolute -top-24 -left-24 w-64 h-64 rounded-full bg-gradient-to-r from-blue-400 to-purple-400 opacity-20 blur-3xl"></div>
          <div className="absolute -bottom-32 -right-32 w-80 h-80 rounded-full bg-gradient-to-r from-purple-400 to-pink-400 opacity-20 blur-3xl"></div>
          
          {/* Content */}
          <div className="relative z-10 p-6 sm:p-8 md:p-10">
            <div className="flex flex-col sm:flex-row items-center gap-6 sm:gap-10">
              {/* Profile Image with Animation */}
              <div className="relative group">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full opacity-75 group-hover:opacity-100 blur-sm group-hover:blur transition duration-500"></div>
                <div className="relative w-18 h-18 sm:w-18 sm:h-18 rounded-full overflow-hidden border-2 border-white dark:border-gray-700">
                  {session.user.image ? (
                    <Image
                      src={session.user.image}
                      alt={session.user.name || "Profile"}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-400 to-purple-500 text-white text-4xl font-bold">
                      {session.user.name?.charAt(0) || session.user.email?.charAt(0) || "?"}
                    </div>
                  )}
                </div>
              </div>
              
              {/* User Info */}
              <div className="text-center sm:text-left flex-1">
                <h1 className="text-xl sm:text-2xl md:text-2xl font-bold text-gray-900 dark:text-white">
                  {session.user.name || "User"}
                </h1>
                <p className="mt-1 sm:mt-2 text-md sm:text-lg text-gray-700 dark:text-gray-300">
                  {session.user.email}
                </p>

                {/* User Stats */}
                <div className="mt-4 flex flex-wrap justify-center sm:justify-start gap-4 sm:gap-6">
                  <div className="bg-white/50 dark:bg-gray-700/50 backdrop-blur-sm px-4 py-2 rounded-xl">
                    <p className="text-xs text-gray-500 dark:text-gray-400">Posts</p>
                    <p className="text-xl font-bold text-gray-900 dark:text-white">{stats.posts}</p>
                  </div>
                  <div className="bg-white/50 dark:bg-gray-700/50 backdrop-blur-sm px-4 py-2 rounded-xl">
                    <p className="text-xs text-gray-500 dark:text-gray-400">Comments</p>
                    <p className="text-xl font-bold text-gray-900 dark:text-white">{stats.comments}</p>
                  </div>
                  <div className="bg-white/50 dark:bg-gray-700/50 backdrop-blur-sm px-4 py-2 rounded-xl">
                    <p className="text-xs text-gray-500 dark:text-gray-400">Saved</p>
                    <p className="text-xl font-bold text-gray-900 dark:text-white">{stats.savedPosts}</p>
                  </div>
                </div>
              </div>
              
              {/* Action Button */}
              <div className="mt-4 sm:mt-0">
                <Link
                  href="/blog/new"
                  className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                  </svg>
                  New Post
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* User Activity Card */}
        <div className="relative overflow-hidden rounded-xl bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border border-white/20 dark:border-gray-700/20 shadow-lg mb-8 p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Activity Overview</h3>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {/* Activity Card 1 */}
            <div className="bg-gradient-to-br from-blue-400/20 to-purple-400/20 p-4 rounded-lg">
              <div className="flex items-center mb-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600 dark:text-blue-400 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M4 5a2 2 0 012-2h8a2 2 0 012 2v10a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm9 1a1 1 0 10-2 0v6a1 1 0 102 0V6zm-4 1a1 1 0 10-2 0v4a1 1 0 102 0V7z" clipRule="evenodd" />
                </svg>
                <h4 className="font-medium text-gray-900 dark:text-white">Content Stats</h4>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                You've written {stats.posts} blog posts and {stats.comments} comments.
              </p>
            </div>
          </div>
        </div>

        {/* Tabs Navigation */}
        <div className="flex justify-center mb-8">
          <div className="inline-flex p-1 rounded-lg bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm shadow-md">
            <button
              onClick={() => handleTabChange('posts')}
              className={`px-4 py-2 rounded-lg transition-all duration-300 ${
                activeTab === 'posts'
                  ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg'
                  : 'text-gray-700 dark:text-gray-300 hover:bg-white/30 dark:hover:bg-gray-700/30'
              }`}
            >
              My Posts
            </button>
            <button
              onClick={() => handleTabChange('saved')}
              className={`px-4 py-2 rounded-lg transition-all duration-300 ${
                activeTab === 'saved'
                  ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg'
                  : 'text-gray-700 dark:text-gray-300 hover:bg-white/30 dark:hover:bg-gray-700/30'
              }`}
            >
              Saved Blogs
            </button>
          </div>
        </div>

        {/* Tab Content */}
        <div className="mb-8">
          {activeTab === 'posts' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white text-center mb-6">
                Your Posts
              </h2>
              
              {userPosts.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {userPosts.map(post => (
                    <div key={post.id} className="relative bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-xl shadow-md overflow-hidden transform transition-transform duration-300 hover:scale-[1.02] hover:shadow-lg">
                      {/* Post Action Buttons */}
                      <div className="absolute top-2 right-2 z-10 flex gap-2">
                        <button
                          onClick={(e) => handleEditPost(e, post.id)}
                          className="p-1.5 bg-white/80 dark:bg-gray-800/80 text-blue-600 hover:text-blue-800 hover:bg-blue-100 rounded-full transition-colors shadow-sm"
                          aria-label="Edit post"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </button>
                        <button
                          onClick={(e) => handleDeletePost(e, post.id)}
                          className="p-1.5 bg-white/80 dark:bg-gray-800/80 text-red-600 hover:text-red-800 hover:bg-red-100 rounded-full transition-colors shadow-sm"
                          aria-label="Delete post"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                      
                      <div 
                        className="cursor-pointer" 
                        onClick={() => handleViewPost(post.id)}
                      >
                        <div className="relative w-full h-40">
                          <Image
                            src={post.image || '/images/default-image.jpg'}
                            alt={post.title}
                            fill
                            className="object-cover"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                          <div className="absolute bottom-0 left-0 right-0 p-4">
                            <h3 className="text-lg font-bold text-white line-clamp-2">
                              {post.title}
                            </h3>
                          </div>
                        </div>
                        <div className="p-4">
                          <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2 mb-2">
                            {post.excerpt || post.content.substring(0, 150) + '...'}
                          </p>
                          <div className="flex justify-between items-center mt-4 text-xs text-gray-500 dark:text-gray-400">
                            <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                            <span className="whitespace-nowrap">
                              {post.content ? `${Math.max(1, Math.ceil(post.content.split(/\s+/).length / 200))} min read` : '1 min read'}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
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
              )}
            </div>
          )}
          
          {activeTab === 'saved' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white text-center mb-6">
                Saved Blogs
              </h2>
              
              {/* UI for saved blogs (placeholder) */}
              <div className="text-center py-12 px-4">
                <div className="mx-auto max-w-md">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-400 dark:text-gray-500 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                  </svg>
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white">No saved posts</h3>
                  <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                    Your saved blog posts will appear here once this feature is implemented.
                  </p>
                  <div className="mt-6">
                    <Link
                      href="/blog"
                      className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-full shadow hover:shadow-lg transition-all duration-300"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                      Explore Blog
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}