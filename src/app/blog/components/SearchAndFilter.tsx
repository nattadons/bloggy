"use client";

import { useState } from 'react';
import Link from 'next/link';
import { PostCard } from '@/app/components/PostCard';


// Define Post type
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
  createdAt: Date; // เปลี่ยนเป็น Date
  updatedAt: Date;
  published: boolean;
  author: Author;
  authorId: string;
  tags?: string | null;
};

type SearchAndFilterProps = {
  initialPosts: Post[];
  userId?: string;
};

export default function SearchAndFilter({ initialPosts, userId }: SearchAndFilterProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('all'); // 'all', 'my'
  
  // Filter posts based on search query and active tab
  const filteredPosts = initialPosts.filter(post => {
    const matchesSearch = (
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (post.excerpt && post.excerpt.toLowerCase().includes(searchQuery.toLowerCase()))
    );
    
    const matchesTab = activeTab === 'all' || (activeTab === 'my' && post.authorId === userId);
    
    return matchesSearch && matchesTab;
  });

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
        {filteredPosts.length > 0 ? (
          filteredPosts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))
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