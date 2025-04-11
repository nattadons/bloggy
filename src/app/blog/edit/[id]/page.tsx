"use client"

import { useState, useRef, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { useSession } from 'next-auth/react';
import LoadingPage from '@/app/components/LoadingPage';

export default function EditPostPage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const params = useParams();
  const postId = params.id as string;
  const { data: session, status } = useSession();

  const [formData, setFormData] = useState({
    title: '',
    excerpt: '',
    content: '',
    tags: '',
    image: null as File | null
  });

  // Fetch post data when component mounts
  useEffect(() => {
    const fetchPost = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(`/api/posts/${postId}`);
        
        if (!response.ok) {
          if (response.status === 404) {
            throw new Error('Post not found');
          } else {
            throw new Error('Failed to fetch post');
          }
        }

        const data = await response.json();
        const post = data.post;

        // Check if current user is the author
        if (session?.user?.id !== post.authorId) {
          throw new Error('You do not have permission to edit this post');
        }

        // Set form data
        setFormData({
          title: post.title,
          excerpt: post.excerpt || '',
          content: post.content,
          tags: post.tags || '',
          image: null
        });

        // Set image preview if post has an image
        if (post.image) {
          setImagePreview(post.image);
        }

        setError(null);
      } catch (error) {
        console.error('Error:', error);
        setError((error as Error).message);
      } finally {
        setIsLoading(false);
      }
    };

    // Only fetch if user is authenticated
    if (status === 'authenticated') {
      fetchPost();
    } else if (status === 'unauthenticated') {
      setError('You must be logged in to edit posts');
      setIsLoading(false);
    }
  }, [postId, session?.user?.id, status]);

  // Handle form input changes
  const handleInputChange = (e: { target: { name: any; value: any; }; }) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle image upload
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];

      // Check file size (5MB = 5 * 1024 * 1024 bytes)
      if (file.size > 5 * 1024 * 1024) {
        alert('File is too large. Please upload a file smaller than 5MB');
        return;
      }

      setFormData(prev => ({
        ...prev,
        image: file
      }));

      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Trigger file input click
  const handleImageButtonClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  // Remove selected image
  const handleRemoveImage = () => {
    setFormData(prev => ({
      ...prev,
      image: null
    }));
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Handle form submission
  const handleSubmit = async (e: { preventDefault: () => void; }) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Create FormData to send to API
      const formDataToSend = new FormData();
      formDataToSend.append('title', formData.title);
      formDataToSend.append('excerpt', formData.excerpt);
      formDataToSend.append('content', formData.content);
      formDataToSend.append('tags', formData.tags);

      // Add image to FormData if exists
      if (formData.image) {
        formDataToSend.append('image', formData.image);
      }

      // Send data to API
      const response = await fetch(`/api/posts/${postId}`, {
        method: 'PATCH',
        body: formDataToSend
      });

      // Check response
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Could not update post');
      }

      // On success, navigate back to blog page
      alert('Post updated successfully!');
      router.push('/blog');
      router.refresh();
    } catch (error) {
      console.error('Error updating post:', error);
      alert('Could not update post: ' + (error as Error).message);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Show loading state
  if (isLoading) {
    return (
      <LoadingPage></LoadingPage>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="min-h-screen py-6 sm:py-8 md:py-12 px-3 sm:px-4 md:px-6">
        <main className="max-w-3xl mx-auto">
          <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-6">
            <h2 className="text-lg font-medium text-red-800 mb-2">Error</h2>
            <p className="text-red-700">{error}</p>
            <Link href="/blog" className="mt-4 inline-block text-blue-600 hover:underline">
              Return to blog
            </Link>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-6 sm:py-8 md:py-12 px-3 sm:px-4 md:px-6">
      <main className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="mb-6 sm:mb-8 md:mb-10">
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Edit Post
          </h1>
          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300">
            Update your post content and details
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title */}
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Title *
            </label>
            <input
              id="title"
              name="title"
              type="text"
              required
              value={formData.title}
              onChange={handleInputChange}
              placeholder="Enter an interesting title"
              className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Excerpt */}
          <div>
            <label htmlFor="excerpt" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Excerpt *
            </label>
            <textarea
              id="excerpt"
              name="excerpt"
              required
              value={formData.excerpt}
              onChange={handleInputChange}
              rows={2}
              placeholder="Write a short description to attract readers"
              className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Image Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Cover Image
            </label>
            <div className="mt-1 flex flex-col space-y-2">
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleImageChange}
                accept="image/*"
                className="hidden"
              />

              {/* Image preview */}
              {imagePreview ? (
                <div className="relative w-full h-48 bg-gray-100 rounded-md overflow-hidden">
                  <Image
                    src={imagePreview}
                    alt="Preview"
                    fill
                    style={{ objectFit: 'cover' }}
                  />
                  <button
                    type="button"
                    onClick={handleRemoveImage}
                    className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                    aria-label="Remove image"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={handleImageButtonClick}
                  className="w-full py-3 px-4 border-2 border-dashed border-gray-300 rounded-md flex justify-center items-center text-gray-600 hover:border-blue-500 hover:text-blue-500 transition-colors"
                >
                  <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                  </svg>
                  Upload cover image
                </button>
              )}

              <p className="text-xs text-gray-500">
                Recommended: 1200×630 pixels, JPG or PNG format
              </p>
            </div>
          </div>

          {/* Content */}
          <div>
            <label htmlFor="content" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Content *
            </label>
            <textarea
              id="content"
              name="content"
              required
              value={formData.content}
              onChange={handleInputChange}
              rows={12}
              placeholder="Write your post content here..."
              className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Tags */}
          <div>
            <label htmlFor="tags" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Tags (separated by commas)
            </label>
            <input
              id="tags"
              name="tags"
              type="text"
              value={formData.tags}
              onChange={handleInputChange}
              placeholder="e.g. Technology, Education, Lifestyle"
              className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-4 pt-4">
            <Link
              href="/blog"
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={isSubmitting}
              className={`px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md ${isSubmitting
                ? 'opacity-70 cursor-not-allowed'
                : 'hover:bg-blue-700 hover:shadow-lg hover:scale-105 transition-all duration-300'
                }`}
            >
              {isSubmitting ? (
                <span className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Saving...
                </span>
              ) : (
                'Save Changes'
              )}
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}