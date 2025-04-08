"use client"

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';

export default function NewPostPage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    title: '',
    excerpt: '',
    content: '',
    tags: '',
    image: null as File | null
  });

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
      setFormData(prev => ({
        ...prev,
        image: file
      }));

      // Create a preview URL
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
      // In a real app, you would send data to an API or server
      // Example:
      // const formDataToSend = new FormData();
      // formDataToSend.append('title', formData.title);
      // formDataToSend.append('excerpt', formData.excerpt);
      // formDataToSend.append('content', formData.content);
      // formDataToSend.append('tags', formData.tags);
      // if (formData.image) {
      //   formDataToSend.append('image', formData.image);
      // }
      // const response = await fetch('/api/posts', {
      //   method: 'POST',
      //   body: formDataToSend
      // });

      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      // On success, navigate back to the blog page
      alert('Your blog post has been created successfully!');
      router.push('/blog');
    } catch (error) {
      console.error('Error creating post:', error);
      alert('Error creating post. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen py-6 sm:py-8 md:py-12 px-3 sm:px-4 md:px-6">
      <main className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="mb-6 sm:mb-8 md:mb-10">
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Create New Blog Post
          </h1>
          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300">
            Share your thoughts and stories with your readers
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
              placeholder="Enter an engaging title"
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
                Recommended: 1200×630 pixels, JPG or PNG format.
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
              placeholder="Write your blog post content here..."
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
              placeholder="e.g., technology, education, lifestyle"
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
                'Publish Post'
              )}
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}