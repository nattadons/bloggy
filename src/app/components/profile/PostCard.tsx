// app/components/profile/PostCard.tsx
import Image from 'next/image';
import { Post } from '@/app/components/PostCard';

type PostCardProps = {
  post: Post;
  onEdit: (e: React.MouseEvent, postId: string) => void;
  onDelete: (e: React.MouseEvent, postId: string) => void;
  onView: (postId: string) => void;
};

export default function PostCard({ post, onEdit, onDelete, onView }: PostCardProps) {
  return (
    <div className="relative bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-xl shadow-md overflow-hidden transform transition-transform duration-300 hover:scale-[1.02] hover:shadow-lg">
      {/* Post Action Buttons */}
      <div className="absolute top-2 right-2 z-10 flex gap-2">
        <button
          onClick={(e) => onEdit(e, post.id)}
          className="p-1.5 bg-white/80 dark:bg-gray-800/80 text-blue-600 hover:text-blue-800 hover:bg-blue-100 rounded-full transition-colors shadow-sm"
          aria-label="Edit post"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
        </button>
        <button
          onClick={(e) => onDelete(e, post.id)}
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
        onClick={() => onView(post.id)}
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
  );
}