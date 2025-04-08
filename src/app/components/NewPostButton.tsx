// app/components/NewPostButton.tsx
"use client"
import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';

interface NewPostButtonProps {
  floating?: boolean;
}

export const NewPostButton = ({ floating = false }: NewPostButtonProps) => {
  const [isHovered, setIsHovered] = useState(false);

  if (floating) {
    return (
      <motion.div
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className="relative"
      >
        <Link
          href="/blog/new"
          className="flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 rounded-full 
                    bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg 
                    hover:from-blue-700 hover:to-indigo-700 transition-all duration-300"
          aria-label="Create new post"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            className="h-6 w-6" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
        </Link>
        
        {/* Tooltip */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8, y: -10 }}
          animate={isHovered ? { opacity: 1, scale: 1, y: 0 } : { opacity: 0, scale: 0.8, y: -10 }}
          transition={{ duration: 0.2 }}
          className="absolute -top-10 left-1/2 transform -translate-x-1/2 px-3 py-1.5 
                    bg-gray-900 text-white text-xs rounded-md whitespace-nowrap z-10"
        >
          Create new post
          {/* Arrow */}
          <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 
                          border-l-4 border-r-4 border-t-4 border-transparent 
                          border-t-gray-900"></div>
        </motion.div>
      </motion.div>
    );
  }

  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <Link
        href="/blog/new"
        className="group inline-flex items-center gap-2 px-4 sm:px-5 py-2 sm:py-2.5 
                  text-sm md:text-base font-medium bg-gradient-to-r from-blue-600 to-indigo-600 
                  text-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300
                  hover:from-blue-700 hover:to-indigo-700 relative overflow-hidden"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Background highlight effect */}
        <motion.div 
          className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20"
          animate={isHovered ? { scale: 1.5, opacity: 0.2 } : { scale: 0, opacity: 0 }}
          transition={{ duration: 0.5 }}
        />
        
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          className="h-4 w-4 md:h-5 md:w-5 transform group-hover:rotate-12 transition-transform duration-300" 
          fill="none" 
          viewBox="0 0 24 24" 
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
        <span className="relative z-10">New Post</span>
      </Link>
    </motion.div>
  );
};