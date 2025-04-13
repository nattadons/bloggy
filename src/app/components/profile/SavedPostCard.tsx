// app/components/profile/SavedPostCard.tsx
import Image from 'next/image';
import { Post } from '@/app/components/PostCard';

type SavedPostCardProps = {
  post: Post;
  onUnsave: (e: React.MouseEvent, postId: string) => void;
  onView: (postId: string) => void;
};

export default function SavedPostCard({ post, onUnsave, onView }: SavedPostCardProps) {
  return (
    <div className="relative bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-xl shadow-md overflow-hidden transform transition-transform duration-300 hover:scale-[1.02] hover:shadow-lg">
      {/* ปุ่มยกเลิกการบันทึก */}
      <div className="absolute top-2 right-2 z-10 flex gap-2">
        <button
          onClick={(e) => onUnsave(e, post.id)}
          className="p-1.5 bg-white/80 dark:bg-gray-800/80 text-pink-600 hover:text-pink-800 hover:bg-pink-100 rounded-full transition-colors shadow-sm"
          aria-label="Remove from saved"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
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
            <span className="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 text-pink-500 mr-1">
                <path d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
              </svg>
              <span className="whitespace-nowrap">
                {post.content ? `${Math.max(1, Math.ceil(post.content.split(/\s+/).length / 200))} min read` : '1 min read'}
              </span>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}