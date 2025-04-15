// app/profile/page.tsx
"use client";

import { useState, useEffect, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Post } from '@/app/components/PostCard';
import LoadingPage from '@/app/components/LoadingPage';
import ProfileHeader from '@/app/components/profile/ProfileHeader';
import SavedPostCard from '@/app/components/profile/SavedPostCard';
import TabNavigation from '@/app/components/profile/TabNavigation';
import PaginatedPosts from '@/app/components/profile/PaginatedPosts';

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

// API services
const api = {
  fetchUserProfile: async () => {
    const response = await fetch('/api/users/profile');
    if (!response.ok) throw new Error('Failed to fetch user profile');
    return response.json();
  },

  fetchSavedPosts: async (userId: string) => {
    const response = await fetch(`/api/users/${userId}/favorites`);
    if (!response.ok) throw new Error('Failed to fetch saved posts');
    return response.json();
  },

  unsavePost: async (userId: string, postId: string) => {
    const response = await fetch(`/api/users/${userId}/favorites?postId=${postId}`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error('Failed to unsave post');
    return response.json();
  }
};

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('posts');
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [savedPosts, setSavedPosts] = useState<Post[]>([]);

  // Redirect if not authenticated
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    }
  }, [status, router]);

  // Fetch user profile data
  const fetchUserProfile = useCallback(async () => {
    if (!session?.user?.id || status !== 'authenticated') return;

    setIsLoading(true);
    try {
      const profileData = await api.fetchUserProfile();
      setUserProfile(profileData);
    } catch (error) {
      console.error('Error fetching user profile:', error);
    } finally {
      setIsLoading(false);
    }
  }, [session?.user?.id, status]);

  useEffect(() => {
    fetchUserProfile();
  }, [fetchUserProfile]);

  // Fetch saved posts
  const fetchSavedPosts = useCallback(async () => {
    if (!session?.user?.id || status !== 'authenticated') return;

    setIsLoading(true);
    try {
      const response = await api.fetchSavedPosts(session.user.id);
      const savedPostsList = response.savedPosts || [];
      setSavedPosts(savedPostsList);

      // Update saved posts stats
      setUserProfile(prevProfile => {
        if (!prevProfile) return null;

        return {
          ...prevProfile,
          stats: {
            ...prevProfile.stats,
            savedPosts: savedPostsList.length
          }
        };
      });
    } catch (error) {
      console.error('Error fetching saved posts:', error);
    } finally {
      setIsLoading(false);
    }
  }, [session?.user?.id, status]);

  // Handle tab change
  const handleTabChange = useCallback((tab: string) => {
    setActiveTab(tab);

    if (tab === 'saved' && savedPosts.length === 0) {
      fetchSavedPosts();
    }
  }, [fetchSavedPosts, savedPosts.length]);

  // Handle post deletion (update user profile stats)
  const handlePostDelete = useCallback((postId: string) => {
    setUserProfile(prevProfile => {
      if (!prevProfile) return null;
      return {
        ...prevProfile,
        stats: {
          ...prevProfile.stats,
          posts: Math.max(0, prevProfile.stats.posts - 1)
        }
      };
    });
  }, []);

  const handleViewPost = useCallback((postId: string) => {
    router.push(`/blog/${postId}`);
  }, [router]);

  const handleUnsavePost = useCallback(async (e: React.MouseEvent, postId: string) => {
    e.preventDefault();
    e.stopPropagation();

    if (window.confirm('Are you sure you want to remove this post from your saved list?')) {
      try {
        if (!session?.user?.id) return;

        await api.unsavePost(session.user.id, postId);
        setSavedPosts(prevPosts => prevPosts.filter(post => post.id !== postId));
        setUserProfile(prevProfile => {
          if (!prevProfile) return null;
          return {
            ...prevProfile,
            stats: {
              ...prevProfile.stats,
              savedPosts: prevProfile.stats.savedPosts - 1
            }
          };
        });
      } catch (error) {
        console.error('Error unsaving post:', error);
        alert('Failed to remove the post from your saved list. Please try again.');
      }
    }
  }, [session?.user?.id]);

  // Loading and auth checks
  if (status === 'loading' || (isLoading && !userProfile)) {
    return <LoadingPage />;
  }

  if (!session?.user) {
    return null;
  }

  // Default stats
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
        {/* Profile Header Component */}
        <ProfileHeader user={session.user} stats={stats} />

        {/* Activity Overview */}
        <div className="relative overflow-hidden rounded-xl bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border border-white/20 dark:border-gray-700/20 shadow-lg mb-8 p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Activity Overview</h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
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

        {/* Tabs Navigation Component */}
        <TabNavigation activeTab={activeTab} onTabChange={handleTabChange} />

        {/* Tab Content */}
        <div className="mb-8">
          {activeTab === 'posts' && (
            session?.user?.id ? (
              <PaginatedPosts 
                userId={session.user.id} 
                onDeletePost={handlePostDelete} 
              />
            ) : null
          )}

          {activeTab === 'saved' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white text-center mb-6">
                Saved Blogs
              </h2>

              {isLoading ? (
                <div className="flex justify-center">
                  <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
                </div>
              ) : savedPosts.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {savedPosts.map(post => (
                    <SavedPostCard
                      key={post.id}
                      post={post}
                      onUnsave={handleUnsavePost}
                      onView={handleViewPost}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 px-4">
                  <div className="mx-auto max-w-md">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-400 dark:text-gray-500 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                    </svg>
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white">No saved posts</h3>
                    <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                      You haven't saved any posts yet. Browse the blog and save posts you like.
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
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}