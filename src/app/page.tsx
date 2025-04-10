'use client';

import { useRouter } from 'next/navigation';
import { useTransition, useState } from 'react';
import { ArrowRight } from 'lucide-react';
import LoadingPage from './components/LoadingPage'; // หรือเส้นทางที่คุณเก็บไว้จริง ๆ

export default function Home() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [showLoading, setShowLoading] = useState(false);

  const handleClick = () => {
    setShowLoading(true);
    startTransition(() => {
      router.push('/blog');
    });
  };

  if (showLoading || isPending) {
    return <LoadingPage />;
  }

  return (
    <div className="h-screen w-full flex flex-col items-center justify-center bg-gradient-to-b from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 px-4 sm:px-6 md:px-8">
      <div className="w-full max-w-3xl px-4 sm:px-6 py-8 sm:py-12 md:py-16 text-center">
        <div className="mb-4 sm:mb-6 md:mb-8">
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-600 p-2 sm:p-3 md:p-5">
            Bloggy
          </h1>
        </div>

        <h2 className="text-md sm:text-2xl md:text-3xl font-bold mb-4 sm:mb-6 text-gray-800 dark:text-white">
          Share your thoughts with the world
        </h2>

        <p className="text-base sm:text-lg md:text-xl mb-8 sm:mb-10 md:mb-12 text-gray-600 dark:text-gray-300">
          A simple and elegant platform for writers, thinkers, and storytellers to publish their ideas and connect with readers.
        </p>

        <button
          onClick={handleClick}
          className="group inline-flex items-center justify-center px-6 text-sm sm:px-8 py-3 sm:py-4 text-base sm:text-lg font-medium text-white bg-blue-600 rounded-full hover:bg-blue-700 transition-colors duration-300"
        >
          Get Started
          <ArrowRight className="ml-2 w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform duration-200" />
        </button>
      </div>
    </div>
  );
}
