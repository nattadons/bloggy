import { useState } from 'react';
import PostItem from './PostItem';
import { PostWithComments } from '@/app/admin/page';

type PostListProps = {
  posts: PostWithComments[];
  setPosts: React.Dispatch<React.SetStateAction<PostWithComments[]>>;
};

export default function PostList({ posts, setPosts }: PostListProps) {
  const [expandedPost, setExpandedPost] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState<{ [key: string]: boolean }>({});
  const [isDeletingComment, setIsDeletingComment] = useState<{ [key: string]: boolean }>({});

  // Fetch comments for a post
  const fetchComments = async (postId: string) => {
    try {
      const response = await fetch(`/api/posts/${postId}/comments`);
      if (!response.ok) throw new Error('Failed to fetch comments');
      
      const comments = await response.json();
      
      setPosts(prevPosts => 
        prevPosts.map(post => 
          post.id === postId 
            ? { ...post, comments: comments } 
            : post
        )
      );
    } catch (error) {
      console.error('Error fetching comments:', error);
    }
  };

  // Toggle expanded post to show comments
  const toggleExpandPost = (postId: string) => {
    if (expandedPost === postId) {
      setExpandedPost(null);
    } else {
      setExpandedPost(postId);
      // Fetch comments if not already loaded
      const post = posts.find(p => p.id === postId);
      if (!post?.comments) {
        fetchComments(postId);
      }
    }
  };

  // Handle post deletion
  const handleDeletePost = async (postId: string) => {
    if (!confirm('Are you sure you want to delete this post? This action cannot be undone.')) {
      return;
    }

    try {
      setIsDeleting(prev => ({ ...prev, [postId]: true }));
      
      const response = await fetch(`/api/posts/${postId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete post');
      }

      // Remove post from state
      setPosts(prevPosts => prevPosts.filter(post => post.id !== postId));
    } catch (error) {
      console.error('Error deleting post:', error);
      alert('Failed to delete post. Please try again.');
    } finally {
      setIsDeleting(prev => ({ ...prev, [postId]: false }));
    }
  };

  // Handle comment deletion
  const handleDeleteComment = async (commentId: string, postId: string) => {
    if (!confirm('Are you sure you want to delete this comment? This action cannot be undone.')) {
      return;
    }

    try {
      setIsDeletingComment(prev => ({ ...prev, [commentId]: true }));
      
      const response = await fetch(`/api/comments/${commentId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete comment');
      }

      // Update post comments in state
      setPosts(prevPosts => 
        prevPosts.map(post => {
          if (post.id === postId && post.comments) {
            return {
              ...post,
              comments: post.comments.filter(comment => comment.id !== commentId)
            };
          }
          return post;
        })
      );
      
    } catch (error) {
      console.error('Error deleting comment:', error);
      alert('Failed to delete comment. Please try again.');
    } finally {
      setIsDeletingComment(prev => ({ ...prev, [commentId]: false }));
    }
  };

  return (
    <div className="divide-y divide-gray-200 dark:divide-gray-700">
      {posts.length > 0 ? (
        posts.map(post => (
          <PostItem 
            key={post.id}
            post={post}
            expandedPost={expandedPost}
            isDeleting={isDeleting}
            isDeletingComment={isDeletingComment}
            toggleExpandPost={toggleExpandPost}
            handleDeletePost={handleDeletePost}
            handleDeleteComment={handleDeleteComment}
          />
        ))
      ) : (
        <div className="p-6 text-center">
          <p className="text-gray-500 dark:text-gray-400">
            No posts found
          </p>
        </div>
      )}
    </div>
  );
}