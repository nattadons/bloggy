"use client"
import Link from 'next/link';
import Image from 'next/image';

// Define the post type
type Post = {
  id: string;
  title: string;
  excerpt: string;
  author: string;
  date: string;
  readTime: string;
  coverImage?: string; // New property for the post image
  authorAvatar?: string; // Optional author avatar
};

type PostCardProps = {
  post: Post;
};

export function PostCard({ post }: PostCardProps) {
  // Format the date to be more readable
  const formattedDate = new Date(post.date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  // Default image if none provided
  const imageSrc = post.coverImage || '/images/default-post-image.jpg';
  
  return (
    <Link href={`/blog/${post.id}`} className="block w-full">
      <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 hover:translate-y-[-4px] bg-white dark:bg-gray-800 flex flex-col md:flex-row h-full">
        {/* Card Image - Full width on mobile, left side on md+ screens */}
        <div className="relative w-full md:w-2/5 h-48 md:h-auto overflow-hidden">
          <Image 
            src={imageSrc}
            alt={post.title}
            fill
            className="object-cover transition-transform duration-500 hover:scale-105"
            sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 33vw"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
        </div>
        
        {/* Card Content - Right side on md+ screens */}
        <div className="flex flex-col flex-grow p-3 sm:p-4 md:p-6 relative">
          {/* Colored bar on top of content */}
          <div className="h-1 absolute top-0 left-0 right-0 bg-gradient-to-r from-blue-500 to-purple-600"></div>
          
          <div className="flex flex-col h-full">
            {/* Category Tag */}
            <div className="mb-1 sm:mb-2">
              <span className="inline-block px-2 py-0.5 sm:py-1 text-xs font-medium bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-100 rounded-md">Blog</span>
            </div>
            
            {/* Title */}
            <h3 className="text-base sm:text-lg md:text-xl font-bold text-gray-900 dark:text-white mb-1 sm:mb-2 line-clamp-2">
              {post.title}
            </h3>
            
            {/* Excerpt */}
            <p className="text-xs sm:text-sm md:text-base text-gray-600 dark:text-gray-300 mb-3 md:mb-4 line-clamp-2 sm:line-clamp-3 flex-grow">
              {post.excerpt}
            </p>
            
            {/* Card Footer - Author Info & Date */}
            <div className="flex flex-col xs:flex-row sm:items-center justify-between mt-auto pt-2 sm:pt-3 text-xs text-gray-500 dark:text-gray-400 border-t border-gray-100 dark:border-gray-700 gap-2 sm:gap-0">
              <div className="flex items-center gap-1 sm:gap-2">
                {post.authorAvatar ? (
                  <div className="relative w-5 h-5 sm:w-6 sm:h-6 rounded-full overflow-hidden flex-shrink-0">
                    <Image 
                      src={post.authorAvatar}
                      alt={post.author}
                      fill
                      className="object-cover"
                    />
                  </div>
                ) : (
                  <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-gray-200 dark:bg-gray-600 flex items-center justify-center flex-shrink-0">
                    <span className="text-xs font-medium text-gray-600 dark:text-gray-300">
                      {post.author.charAt(0)}
                    </span>
                  </div>
                )}
                <span className="truncate max-w-[100px] sm:max-w-full">By {post.author}</span>
              </div>
              <div className="flex items-center gap-1 sm:gap-2 text-xs">
                <span className="truncate">{formattedDate}</span>
                <span className="hidden xs:inline">•</span>
                <span className="whitespace-nowrap">{post.readTime} read</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}