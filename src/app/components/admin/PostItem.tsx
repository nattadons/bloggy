import Image from 'next/image';
import CommentsList from './CommentsList';
import { PostWithComments } from '@/app/admin/page';

type PostItemProps = {
  post: PostWithComments;
  expandedPost: string | null;
  isDeleting: { [key: string]: boolean };
  isDeletingComment: { [key: string]: boolean };
  toggleExpandPost: (postId: string) => void;
  handleDeletePost: (postId: string) => void;
  handleDeleteComment: (commentId: string, postId: string) => void;
};

export default function PostItem({
  post,
  expandedPost,
  isDeleting,
  isDeletingComment,
  toggleExpandPost,
  handleDeletePost,
  handleDeleteComment
}: PostItemProps) {
  // Format date helper
  const formatDate = (dateString: string | Date) => {
    return new Date(dateString).toLocaleString();
  };

  return (
    <div className="p-6">
      <div className="flex flex-col md:flex-row justify-between">
        <div className="flex-1">
          <div className="flex items-start">
            {/* Post Author Image */}
            <div className="mr-4">
              {post.author?.image ? (
                <div className="relative w-10 h-10 rounded-full overflow-hidden">
                  <Image
                    src={post.author.image}
                    alt={post.author.name || 'Author'}
                    fill
                    className="object-cover"
                  />
                </div>
              ) : (
                <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                  <span className="text-gray-600 font-medium">
                    {post.author?.name?.[0] || 'A'}
                  </span>
                </div>
              )}
            </div>
            
            {/* Post Info */}
            <div className="flex-1">
              <h2 className="text-lg font-medium text-gray-900 dark:text-white">
                {post.title}
              </h2>
              <div className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                <span>By {post.author?.name || 'Anonymous'}</span>
                <span className="mx-2">•</span>
                <span>ID: {post.id}</span>
                <span className="mx-2">•</span>
                <span>{formatDate(post.createdAt)}</span>
              </div>
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-300 line-clamp-2">
                {post.excerpt || post.content.substring(0, 150)}...
              </p>
            </div>
          </div>
          
          {/* Post Actions */}
          <div className="mt-4 flex items-center">
            <button
              onClick={() => toggleExpandPost(post.id)}
              className="inline-flex items-center px-3 py-1.5 text-xs font-medium rounded-md bg-blue-50 text-blue-700 dark:bg-blue-900 dark:text-blue-200 hover:bg-blue-100 dark:hover:bg-blue-800 transition-colors"
            >
              {expandedPost === post.id ? 'Hide Comments' : 'Show Comments'}
            </button>
            <a
              href={`/blog/${post.id}`}
              target="_blank"
              rel="noopener noreferrer"
              className="ml-2 inline-flex items-center px-3 py-1.5 text-xs font-medium rounded-md bg-gray-50 text-gray-700 dark:bg-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
            >
              View Post
            </a>
            <button
              onClick={() => handleDeletePost(post.id)}
              disabled={isDeleting[post.id]}
              className="ml-2 inline-flex items-center px-3 py-1.5 text-xs font-medium rounded-md bg-red-50 text-red-700 dark:bg-red-900 dark:text-red-200 hover:bg-red-100 dark:hover:bg-red-800 transition-colors disabled:opacity-50"
            >
              {isDeleting[post.id] ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Deleting...
                </>
              ) : (
                'Delete Post'
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Comments Section (Expandable) */}
      {expandedPost === post.id && (
        <CommentsList
          post={post}
          isDeletingComment={isDeletingComment}
          handleDeleteComment={handleDeleteComment}
        />
      )}
    </div>
  );
}