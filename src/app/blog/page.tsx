// app/blog/page.tsx
"use client"
import { useState } from 'react';
import Link from 'next/link';
import { PostCard } from '../components/PostCard';
import { mockPosts } from '../data/posts'; // แก้ไขนำเข้าข้อมูลจากไฟล์ที่แชร์กัน
import { useSession} from 'next-auth/react'

export default function BlogPage() {
    // State for search and active tab
    const { data: session} = useSession()
    const [searchQuery, setSearchQuery] = useState('');
    const [activeTab, setActiveTab] = useState('all'); // 'all', 'my'

    // Filter posts based on search query and active tab
    const filteredPosts = mockPosts.filter(post => {
        const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            post.excerpt.toLowerCase().includes(searchQuery.toLowerCase());

        // Assuming user ID 1 is the current user for demo purposes
        // In a real app, you would use the authenticated user's ID from your auth context
        const matchesTab = activeTab === 'all' || (activeTab === 'my' && post.authorId === '1');

        return matchesSearch && matchesTab;
    });

    return (
        <div className="min-h-screen py-6 sm:py-8 md:py-12 px-3 sm:px-4 md:px-6">
            {/* Main Content */}
            <main className="max-w-full sm:max-w-xl md:max-w-3xl lg:max-w-5xl xl:max-w-6xl mx-auto">
                {/* Header */}
                <div className="mb-4 sm:mb-6 md:mb-10 text-center">
                    <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-2 sm:mb-3 md:mb-4">Latest Blog Posts</h1>
                    <p className="text-sm sm:text-base md:text-lg text-gray-600 dark:text-gray-300 max-w-xs sm:max-w-lg md:max-w-2xl mx-auto">
                        Explore thoughtful articles written by our community of writers.
                    </p>
                    <p>{session?.user.name}</p>
                    <p>{session?.user.email}</p>
                    
                </div>

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
                            {/* Plus icon that appears on hover */}
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

                        {/* Background animation effect - สีสดใสมากขึ้นเมื่อ hover */}
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
                            <p className="text-gray-500">No posts found. Try a different search or category.</p>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}