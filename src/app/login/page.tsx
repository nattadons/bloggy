'use client';

import Link from 'next/link';
import { useState } from 'react';
import { FcGoogle } from 'react-icons/fc';
import { FaFacebook } from 'react-icons/fa';

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [loadingProvider, setLoadingProvider] = useState('');

  const handleGoogleLogin = () => {
    setIsLoading(true);
    setLoadingProvider('google');
    // This would connect to your authentication logic
    console.log('Google login clicked');
    // Simulating a delay for demonstration
    setTimeout(() => {
      setIsLoading(false);
      setLoadingProvider('');
    }, 1000);
  };

  const handleFacebookLogin = () => {
    setIsLoading(true);
    setLoadingProvider('facebook');
    // This would connect to your authentication logic
    console.log('Facebook login clicked');
    // Simulating a delay for demonstration
    setTimeout(() => {
      setIsLoading(false);
      setLoadingProvider('');
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center py-6 sm:py-8 md:py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-xs sm:max-w-sm md:max-w-md space-y-6 sm:space-y-8">
        {/* Logo */}
        <div className="flex justify-center">
          <Link href="/" className="relative">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 p-2">
              Bloggy
            </h1>
            <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-12 sm:w-16 h-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full"></div>
          </Link>
        </div>

        {/* Login Card */}
        <div className="bg-white dark:bg-gray-800 shadow-xl sm:shadow-2xl rounded-xl sm:rounded-2xl overflow-hidden">
          {/* Card Header with Wave */}
          <div className="relative h-12 sm:h-16 bg-gradient-to-r from-blue-600 to-purple-600">
            <svg className="absolute bottom-0" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320">
              <path fill="#ffffff" fillOpacity="1" d="M0,96L48,112C96,128,192,160,288,160C384,160,480,128,576,112C672,96,768,96,864,112C960,128,1056,160,1152,160C1248,160,1344,128,1392,112L1440,96L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
            </svg>
            <div className="dark:hidden">
              <svg className="absolute bottom-0" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320">
                <path fill="#ffffff" fillOpacity="1" d="M0,96L48,112C96,128,192,160,288,160C384,160,480,128,576,112C672,96,768,96,864,112C960,128,1056,160,1152,160C1248,160,1344,128,1392,112L1440,96L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
              </svg>
            </div>
            <div className="hidden dark:block">
              <svg className="absolute bottom-0" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320">
                <path fill="#1f2937" fillOpacity="1" d="M0,96L48,112C96,128,192,160,288,160C384,160,480,128,576,112C672,96,768,96,864,112C960,128,1056,160,1152,160C1248,160,1344,128,1392,112L1440,96L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
              </svg>
            </div>
          </div>

          {/* Card Content */}
          <div className="px-4 sm:px-6 md:px-8 pt-4 sm:pt-6 pb-6 sm:pb-8">
            {/* Header */}
            <div className="text-center mb-6 sm:mb-8">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
                Welcome Back!
              </h2>
              <p className="mt-1 sm:mt-2 text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                Sign in to continue to your account
              </p>
            </div>

            {/* Social Login Buttons */}
            <div className="space-y-3 sm:space-y-4">
              {/* Google Button */}
              <button
                onClick={handleGoogleLogin}
                disabled={isLoading}
                className="group relative w-full flex items-center justify-center px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-300 dark:border-gray-600 rounded-lg text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 transition-all duration-300 overflow-hidden"
              >
                <span className="absolute inset-0 w-3 bg-gradient-to-r from-red-400 via-yellow-400 to-green-400 transition-all duration-500 ease-out group-hover:w-full opacity-0 group-hover:opacity-20"></span>
                <FcGoogle className="h-4 w-4 sm:h-5 sm:w-5 mr-2 sm:mr-3" />
                <span>{loadingProvider === 'google' ? 'Signing in...' : 'Continue with Google'}</span>
                {loadingProvider === 'google' && (
                  <svg className="animate-spin ml-2 h-3 w-3 sm:h-4 sm:w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                )}
              </button>

              {/* Facebook Button */}
              <button
                onClick={handleFacebookLogin}
                disabled={isLoading}
                className="group relative w-full flex items-center justify-center px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-300 dark:border-gray-600 rounded-lg text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 transition-all duration-300 overflow-hidden"
              >
                <span className="absolute inset-0 w-3 bg-blue-600 transition-all duration-500 ease-out group-hover:w-full opacity-0 group-hover:opacity-20"></span>
                <FaFacebook className="h-4 w-4 sm:h-5 sm:w-5 mr-2 sm:mr-3 text-blue-600" />
                <span>{loadingProvider === 'facebook' ? 'Signing in...' : 'Continue with Facebook'}</span>
                {loadingProvider === 'facebook' && (
                  <svg className="animate-spin ml-2 h-3 w-3 sm:h-4 sm:w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                )}
              </button>
            </div>

            {/* Footer */}
            <div className="mt-6 sm:mt-8 text-center">
              <p className="text-2xs sm:text-xs text-gray-500 dark:text-gray-400">
                Choose either option above to continue to Bloggy
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Text */}
        <div className="text-center">
          <p className="text-2xs sm:text-xs text-gray-500 dark:text-gray-400">
            By signing in, you acknowledge that this is a personal project and may not have formal policies yet.
          </p>
        </div>

      </div>
    </div>
  );
}