import Image from 'next/image';
import { PostWithComments } from '@/app/admin/page';

type CommentsListProps = {
  post: PostWithComments;
  isDeletingComment: { [key: string]: boolean };
  handleDeleteComment: (commentId: string, postId: string) => void;
};

export default function CommentsList({
  post,
  isDeletingComment,
  handleDeleteComment
}: CommentsListProps) {
  // Format date helper
  const formatDate = (dateString: string | Date) => {
    return new Date(dateString).toLocaleString();
  };

  return (
    <div className="mt-6 pl-14">
      <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-3">
        Comments
      </h3>
      
      {post.comments && post.comments.length > 0 ? (
        <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
          {post.comments.map(comment => (
            <div key={comment.id} className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
              <div className="flex justify-between items-start">
                <div className="flex items-start space-x-2">
                  {/* Comment Author Image */}
                  {comment.author?.image ? (
                    <div className="relative flex-shrink-0 w-8 h-8 rounded-full overflow-hidden">
                      <Image
                        src={comment.author.image}
                        alt={comment.author.name || 'User'}
                        fill
                        className="object-cover"
                      />
                    </div>
                  ) : (
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-600 flex items-center justify-center">
                      <span className="text-gray-600 dark:text-gray-300 text-sm font-medium">
                        {comment.author?.name?.[0] || 'U'}
                      </span>
                    </div>
                  )}
                  
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-medium text-gray-900 dark:text-white">
                        {comment.author?.name || 'Anonymous'}
                      </span>
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        {formatDate(comment.createdAt)}
                      </span>
                    </div>
                    <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">
                      {comment.content}
                    </p>
                  </div>
                </div>
                
                {/* Comment Actions */}
                <button
                  onClick={() => handleDeleteComment(comment.id, post.id)}
                  disabled={isDeletingComment[comment.id]}
                  className="inline-flex items-center px-2 py-1 text-xs font-medium rounded-md bg-red-50 text-red-700 dark:bg-red-900 dark:text-red-200 hover:bg-red-100 dark:hover:bg-red-800 transition-colors disabled:opacity-50"
                >
                  {isDeletingComment[comment.id] ? (
                    <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  ) : (
                    'Delete'
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-4 text-sm text-gray-500 dark:text-gray-400">
          {post.comments ? 'No comments found' : 'Loading comments...'}
        </div>
      )}
    </div>
  );
}