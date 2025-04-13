// app/components/blog/FavoriteButton.tsx
"use client";

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { HeartIcon } from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolidIcon } from '@heroicons/react/24/solid';

interface FavoriteButtonProps {
  postId: string;
}

export default function FavoriteButton({ postId }: FavoriteButtonProps) {
  const { data: session } = useSession();
  const [isFavorite, setIsFavorite] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const checkIfFavorite = async () => {
      if (!session?.user?.id) return;
      
      try {
        const response = await fetch(`/api/users/${session.user.id}/favorites`);
        if (!response.ok) {
          throw new Error('Failed to fetch favorites');
        }
        
        const data = await response.json();
        const savedPosts = data.savedPosts || [];
        
        // Check if this post is in favorites
        const isSaved = savedPosts.some((post: any) => post.id === postId);
        setIsFavorite(isSaved);
      } catch (error) {
        console.error('Error checking favorite status:', error);
      }
    };

    checkIfFavorite();
  }, [postId, session]);

  const toggleFavorite = async () => {
    if (!session?.user?.id) {
      // Redirect to login page if not logged in
      return window.location.href = '/auth/signin?callbackUrl=' + encodeURIComponent(window.location.href);
    }

    setIsLoading(true);

    try {
      if (isFavorite) {
        // Remove from favorites if already saved
        const response = await fetch(`/api/users/${session.user.id}/favorites?postId=${postId}`, {
          method: 'DELETE',
        });
        
        if (!response.ok) {
          throw new Error('Failed to remove from favorites');
        }
        
        setIsFavorite(false);
      } else {
        // Add to favorites if not saved
        const response = await fetch(`/api/users/${session.user.id}/favorites`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ postId }),
        });
        
        if (!response.ok) {
          throw new Error('Failed to add to favorites');
        }
        
        setIsFavorite(true);
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={toggleFavorite}
      disabled={isLoading}
      className="group flex items-center space-x-2 transition-all duration-300"
      aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
    >
      <span className={`
        relative overflow-hidden rounded-full p-2 
        ${isFavorite 
          ? 'bg-pink-100 text-pink-500 dark:bg-pink-900 dark:text-pink-300' 
          : 'bg-gray-100 text-gray-500 dark:bg-gray-700 dark:text-gray-300'}
        hover:bg-pink-100 hover:text-pink-500 dark:hover:bg-pink-900 dark:hover:text-pink-300
        transition-colors duration-300 ${isLoading ? 'opacity-50 cursor-wait' : 'cursor-pointer'}
      `}>
        {isFavorite ? (
          <HeartSolidIcon className="h-6 w-6 animate-pulse" />
        ) : (
          <HeartIcon className="h-6 w-6 group-hover:scale-110 transition-transform duration-300" />
        )}
      </span>
      <span className={`
        font-medium ${isFavorite 
          ? 'text-pink-500 dark:text-pink-300' 
          : 'text-gray-700 dark:text-gray-300'} 
        group-hover:text-pink-500 dark:group-hover:text-pink-300 transition-colors duration-300
      `}>
        {isFavorite ? 'Saved' : session ? 'Save Post' : 'Login to Save'}
      </span>
    </button>
  );
}