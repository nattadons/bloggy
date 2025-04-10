"use client"
import Link from 'next/link';
import Image from 'next/image';
import { formatDistance } from 'date-fns';
import { useSession } from 'next-auth/react';
import { useState  } from 'react';
import { useRouter } from 'next/navigation';

// Define the Post type to match what we'll get from the database
export type Post = {
  id: string;
  title: string;
  excerpt?: string | null;
  content: string;
  tags?: string | null;
  image?: string | null;
  published: boolean;
  createdAt: string | Date;
  updatedAt: string | Date;
  authorId: string;
  author?: {
    id: string;
    name?: string | null;
    image?: string | null;
  };
};

type PostCardProps = {
  post: Post;
};

export function PostCard({ post }: PostCardProps) {
  const router = useRouter();
  const { data: session } = useSession();
  const [isDeleting, setIsDeleting] = useState(false);
  const isAuthor = session?.user?.id === post.authorId;

  // Format the date to be more readable
  const formattedDate = formatDistance(
    new Date(post.createdAt),
    new Date(),
    { addSuffix: true }
  );

  // Calculate read time (approximately 200 words per minute)
  const wordCount = post.content ? post.content.split(/\s+/).length : 0;
  const readTime = `${Math.max(1, Math.ceil(wordCount / 200))} min`;

  // Default image if none provided
  const imageSrc = post.image || '/images/default-image.jpg';

  // Handle edit post
  const handleEdit = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    router.push(`/blog/edit/${post.id}`);
  };

  // Handle delete post with confirmation
  const handleDelete = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (window.confirm('Are you sure you want to delete this post? This action cannot be undone.')) {
      try {
        setIsDeleting(true);
        const response = await fetch(`/api/posts/${post.id}`, {
          method: 'DELETE',
        });

        if (!response.ok) {
          throw new Error('Failed to delete post');
        }

        // Refresh the page to show updated posts list
        router.refresh();
      } catch (error) {
        console.error('Error deleting post:', error);
        alert('Failed to delete the post. Please try again.');
      } finally {
        setIsDeleting(false);
      }
    }
  };
  
  return (
    <div className="relative">
      {/* Author actions - only visible if the current user is the author */}
      {isAuthor && (
        <div className="absolute top-2 right-2 z-10 flex gap-2 ">
          <button
            onClick={handleEdit}
            className="p-1.5 text-blue-600 hover:text-blue-800 hover:bg-blue-100 rounded-full transition-colors"
            aria-label="Edit post"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </button>
          <button
            onClick={handleDelete}
            disabled={isDeleting}
            className="p-1.5 text-red-600 hover:text-red-800 hover:bg-red-100 rounded-full transition-colors disabled:opacity-50"
            aria-label="Delete post"
          >
            {isDeleting ? (
              <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            )}
          </button>
        </div>
      )}

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
              {/* Tags */}
              {post.tags && (
                <div className="mb-1 sm:mb-2 flex flex-wrap gap-1">
                  {post.tags.split(',').slice(0, 2).map((tag, index) => (
                    <span 
                      key={index} 
                      className="inline-block px-2 py-0.5 sm:py-1 text-xs font-medium bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-100 rounded-md"
                    >
                      {tag.trim()}
                    </span>
                  ))}
                  {post.tags.split(',').length > 2 && (
                    <span className="inline-block px-2 py-0.5 sm:py-1 text-xs font-medium text-gray-500">
                      +{post.tags.split(',').length - 2} more
                    </span>
                  )}
                </div>
              )}
              
              {/* Title */}
              <h3 className="text-base sm:text-lg md:text-xl font-bold text-gray-900 dark:text-white mb-1 sm:mb-2 line-clamp-2">
                {post.title}
              </h3>
              
              {/* Excerpt */}
              <p className="text-xs sm:text-sm md:text-base text-gray-600 dark:text-gray-300 mb-3 md:mb-4 line-clamp-2 sm:line-clamp-3 flex-grow">
                {post.excerpt || post.content.substring(0, 150) + '...'}
              </p>
              
              {/* Card Footer - Author Info & Date */}
              <div className="flex flex-col xs:flex-row sm:items-center justify-between mt-auto pt-2 sm:pt-3 text-xs text-gray-500 dark:text-gray-400 border-t border-gray-100 dark:border-gray-700 gap-2 sm:gap-0">
                <div className="flex items-center gap-1 sm:gap-2">
                  {post.author?.image ? (
                    <div className="relative w-5 h-5 sm:w-6 sm:h-6 rounded-full overflow-hidden flex-shrink-0">
                      <Image 
                        src={post.author.image}
                        alt={post.author.name || 'Author'}
                        fill
                        className="object-cover"
                      />
                    </div>
                  ) : (
                    <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-gray-200 dark:bg-gray-600 flex items-center justify-center flex-shrink-0">
                      <span className="text-xs font-medium text-gray-600 dark:text-gray-300">
                        {post.author?.name?.[0] || 'A'}
                      </span>
                    </div>
                  )}
                  <span className="truncate max-w-[100px] sm:max-w-full">By {post.author?.name || 'Anonymous'}</span>
                </div>
                <div className="flex items-center gap-1 sm:gap-2 text-xs">
                  <span className="truncate">{formattedDate}</span>
                  <span className="hidden xs:inline">•</span>
                  <span className="whitespace-nowrap">{readTime} read</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
}