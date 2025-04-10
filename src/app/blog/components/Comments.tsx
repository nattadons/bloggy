// app/components/Comments.tsx
"use client"

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import { formatDistance } from 'date-fns';

// กำหนดประเภทข้อมูลของ Comment
type Comment = {
  id: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  authorId: string;
  author: {
    id: string;
    name?: string | null;
    image?: string | null;
  };
};

type CommentsProps = {
  postId: string;
};

export default function Comments({ postId }: CommentsProps) {
  const { data: session, status } = useSession();
  const [comments, setComments] = useState<Comment[]>([]);
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // สถานะสำหรับการแก้ไข
  const [editingCommentId, setEditingCommentId] = useState<string | null>(null);
  const [editContent, setEditContent] = useState('');
  
  // สถานะสำหรับเมนูสามจุด
  const [activeMenuCommentId, setActiveMenuCommentId] = useState<string | null>(null);

  // ดึงข้อมูล comments
  useEffect(() => {
    const fetchComments = async () => {
      setLoading(true);
      try {
        const response = await fetch(`/api/posts/${postId}/comments`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch comments');
        }
        
        const data = await response.json();
        setComments(data);
        
      } catch (err: any) {
        console.error('Error fetching comments:', err);
        setError('Unable to load comments');
      } finally {
        setLoading(false);
      }
    };
    
    fetchComments();
  }, [postId]);

  // Click outside handler (global)
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      // ตรวจสอบว่าคลิกนั้นไม่ได้อยู่ในปุ่มเมนูหรือเมนูดรอปดาวน์
      const target = event.target as Element;
      const isOutsideMenu = !target.closest('[data-menu-button]') && !target.closest('[data-menu-dropdown]');
      
      if (isOutsideMenu && activeMenuCommentId !== null) {
        setActiveMenuCommentId(null);
      }
    };

    // เพิ่ม event listener เฉพาะเมื่อมีเมนูที่เปิดอยู่
    if (activeMenuCommentId !== null) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [activeMenuCommentId]);

  // ส่ง comment ใหม่
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!content.trim()) {
      return;
    }
    
    setSubmitting(true);
    
    try {
      const response = await fetch('/api/comments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content,
          postId,
        }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to add comment');
      }
      
      const newComment = await response.json();
      
      // เพิ่ม comment ใหม่ไปที่รายการ
      setComments([newComment, ...comments]);
      setContent(''); // รีเซ็ตฟอร์ม
      
    } catch (err) {
      console.error('Error adding comment:', err);
      setError('Failed to add comment');
    } finally {
      setSubmitting(false);
    }
  };

  // เปิด/ปิดเมนู
  const toggleMenu = (commentId: string, e: React.MouseEvent) => {
    e.stopPropagation(); // ป้องกันการ bubble ขึ้นไปที่ document
    
    if (activeMenuCommentId === commentId) {
      setActiveMenuCommentId(null);
    } else {
      setActiveMenuCommentId(commentId);
    }
  };

  // เริ่มต้นการแก้ไข comment
  const startEditing = (comment: Comment, e: React.MouseEvent) => {
    e.stopPropagation(); // ป้องกันการ bubble
    setActiveMenuCommentId(null); // ปิดเมนู
    setEditingCommentId(comment.id);
    setEditContent(comment.content);
  };

  // ยกเลิกการแก้ไข
  const cancelEditing = () => {
    setEditingCommentId(null);
    setEditContent('');
  };

  // บันทึกการแก้ไข comment
  const saveEdit = async (commentId: string) => {
    if (!editContent.trim()) {
      return;
    }
    
    try {
      const response = await fetch(`/api/comments/${commentId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content: editContent,
        }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to update comment');
      }
      
      const updatedComment = await response.json();
      
      // อัพเดทรายการความคิดเห็น
      setComments(comments.map(comment => 
        comment.id === commentId ? updatedComment : comment
      ));
      
      // รีเซ็ตสถานะการแก้ไข
      setEditingCommentId(null);
      setEditContent('');
      
    } catch (err) {
      console.error('Error updating comment:', err);
      setError('Failed to update comment');
    }
  };

  // ลบ comment
  const handleDelete = async (commentId: string, e: React.MouseEvent) => {
    e.stopPropagation(); // ป้องกันการ bubble
    setActiveMenuCommentId(null); // ปิดเมนู
    
    if (!confirm('Are you sure you want to delete this comment?')) {
      return;
    }
    
    try {
      const response = await fetch(`/api/comments/${commentId}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        throw new Error('Failed to delete comment');
      }
      
      // อัพเดทรายการความคิดเห็น
      setComments(comments.filter(comment => comment.id !== commentId));
      
    } catch (err) {
      console.error('Error deleting comment:', err);
      setError('Failed to delete comment');
    }
  };

  return (
    <div className="mt-12 bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
        Comments
      </h3>
      
      {/* Comment Form */}
      {status === 'authenticated' ? (
        <form onSubmit={handleSubmit} className="mb-8">
          <div className="mb-4">
            <textarea
              rows={3}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Add a comment..."
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              required
            />
          </div>
          
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={submitting}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 transition-colors"
            >
              {submitting ? 'Posting...' : 'Post Comment'}
            </button>
          </div>
        </form>
      ) : (
        <div className="bg-yellow-50 dark:bg-gray-800 border border-yellow-200 dark:border-gray-700 rounded-lg p-4 text-center mb-8">
          <p className="text-yellow-700 dark:text-yellow-400">
            Please <a href="/api/auth/signin" className="text-blue-600 hover:underline">sign in</a> to leave a comment.
          </p>
        </div>
      )}
      
      {/* Error Message */}
      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-200 rounded-md">
          {error}
        </div>
      )}
      
      {/* Comments List */}
      <div className="space-y-4">
        {loading ? (
          <div className="text-center py-4">Loading comments...</div>
        ) : comments.length === 0 ? (
          <div className="text-center py-4 text-gray-500 dark:text-gray-400">No comments yet. Be the first to comment!</div>
        ) : (
          comments.map(comment => (
            <div key={comment.id} className="border-b border-gray-200 dark:border-gray-700 pb-4 last:border-b-0">
              <div className="flex items-start space-x-3">
                {/* รูปโปรไฟล์ผู้เขียน */}
                <div className="flex-shrink-0">
                  {comment.author.image ? (
                    <div className="relative w-10 h-10 rounded-full overflow-hidden">
                      <Image 
                        src={comment.author.image} 
                        alt={comment.author.name || 'User'}
                        fill
                        className="object-cover"
                      />
                    </div>
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                      <span className="text-gray-600 font-medium">
                        {comment.author.name?.[0] || 'U'}
                      </span>
                    </div>
                  )}
                </div>
                
                {/* เนื้อหาความคิดเห็น */}
                <div className="flex-1 relative">
                  {editingCommentId === comment.id ? (
                    /* ฟอร์มแก้ไขความคิดเห็น */
                    <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3">
                      <div className="flex justify-between items-center mb-2">
                        <h4 className="font-medium text-gray-900 dark:text-white">
                          {comment.author.name || 'Anonymous'}
                        </h4>
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          Editing...
                        </span>
                      </div>
                      <textarea
                        value={editContent}
                        onChange={(e) => setEditContent(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm mb-2 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white text-sm"
                        rows={3}
                      />
                      <div className="flex justify-end space-x-2">
                        <button
                          onClick={cancelEditing}
                          className="px-3 py-1 text-xs text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={() => saveEdit(comment.id)}
                          className="px-3 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700"
                        >
                          Save
                        </button>
                      </div>
                    </div>
                  ) : (
                    /* แสดงความคิดเห็น */
                    <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3">
                      <div className="flex justify-between items-start">
                        <h4 className="font-medium text-gray-900 dark:text-white">
                          {comment.author.name || 'Anonymous'}
                        </h4>
                        <div className="flex items-center space-x-2">
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            {formatDistance(new Date(comment.createdAt), new Date(), { addSuffix: true })}
                          </span>
                          
                          {/* ปุ่มสามจุด (แสดงเฉพาะเจ้าของความคิดเห็น) */}
                          {session?.user?.id === comment.authorId && (
                            <div className="relative">
                              <button
                                data-menu-button={comment.id}
                                onClick={(e) => toggleMenu(comment.id, e)}
                                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors focus:outline-none"
                                aria-label="Comment options"
                              >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                  <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                                </svg>
                              </button>
                              
                              {/* Dropdown Menu */}
                              {activeMenuCommentId === comment.id && (
                                <div 
                                  data-menu-dropdown={comment.id}
                                  className="absolute right-0 mt-1 w-36 bg-white dark:bg-gray-700 rounded-md shadow-lg z-50 border border-gray-200 dark:border-gray-600"
                                >
                                  <div className="py-1">
                                    <button
                                      onClick={(e) => startEditing(comment, e)}
                                      className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600 flex items-center"
                                    >
                                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" viewBox="0 0 20 20" fill="currentColor">
                                        <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                                      </svg>
                                      Edit
                                    </button>
                                    <button
                                      onClick={(e) => handleDelete(comment.id, e)}
                                      className="w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-600 flex items-center"
                                    >
                                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                                      </svg>
                                      Delete
                                    </button>
                                  </div>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                      <p className="mt-1 text-gray-700 dark:text-gray-300">
                        {comment.content}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}