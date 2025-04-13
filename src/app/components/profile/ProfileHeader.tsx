// app/components/profile/ProfileHeader.tsx
import Image from 'next/image';
import Link from 'next/link';

type ProfileHeaderProps = {
  user: any;
  stats: {
    posts: number;
    comments: number;
    savedPosts: number;
    totalViews: number;
    totalLikes: number;
  };
};

export default function ProfileHeader({ user, stats }: ProfileHeaderProps) {
  return (
    <div className="relative overflow-hidden rounded-3xl bg-white/30 dark:bg-gray-800/30 backdrop-blur-xl border border-white/20 dark:border-gray-700/20 shadow-xl mb-8">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-20 pointer-events-none">
        <svg className="absolute left-0 top-0 h-full w-full" width="100%" height="100%" viewBox="0 0 800 800" preserveAspectRatio="none">
          <defs>
            <pattern id="dot-pattern" width="30" height="30" patternUnits="userSpaceOnUse">
              <circle cx="15" cy="15" r="1" fill="currentColor" className="text-blue-500 dark:text-blue-300" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#dot-pattern)" />
        </svg>
      </div>
      
      {/* Gradient Orbs */}
      <div className="absolute -top-24 -left-24 w-64 h-64 rounded-full bg-gradient-to-r from-blue-400 to-purple-400 opacity-20 blur-3xl"></div>
      <div className="absolute -bottom-32 -right-32 w-80 h-80 rounded-full bg-gradient-to-r from-purple-400 to-pink-400 opacity-20 blur-3xl"></div>
      
      {/* Content */}
      <div className="relative z-10 p-6 sm:p-8 md:p-10">
        <div className="flex flex-col sm:flex-row items-center gap-6 sm:gap-10">
          {/* Profile Image with Animation */}
          <div className="relative group">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full opacity-75 group-hover:opacity-100 blur-sm group-hover:blur transition duration-500"></div>
            <div className="relative w-18 h-18 sm:w-18 sm:h-18 rounded-full overflow-hidden border-2 border-white dark:border-gray-700">
              {user.image ? (
                <Image
                  src={user.image}
                  alt={user.name || "Profile"}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-400 to-purple-500 text-white text-4xl font-bold">
                  {user.name?.charAt(0) || user.email?.charAt(0) || "?"}
                </div>
              )}
            </div>
          </div>
          
          {/* User Info */}
          <div className="text-center sm:text-left flex-1">
            <h1 className="text-xl sm:text-2xl md:text-2xl font-bold text-gray-900 dark:text-white">
              {user.name || "User"}
            </h1>
            <p className="mt-1 sm:mt-2 text-md sm:text-lg text-gray-700 dark:text-gray-300">
              {user.email}
            </p>

            {/* User Stats */}
            <div className="mt-4 flex flex-wrap justify-center sm:justify-start gap-4 sm:gap-6">
              <div className="bg-white/50 dark:bg-gray-700/50 backdrop-blur-sm px-4 py-2 rounded-xl">
                <p className="text-xs text-gray-500 dark:text-gray-400">Posts</p>
                <p className="text-xl font-bold text-gray-900 dark:text-white">{stats.posts}</p>
              </div>
              <div className="bg-white/50 dark:bg-gray-700/50 backdrop-blur-sm px-4 py-2 rounded-xl">
                <p className="text-xs text-gray-500 dark:text-gray-400">Comments</p>
                <p className="text-xl font-bold text-gray-900 dark:text-white">{stats.comments}</p>
              </div>
              <div className="bg-white/50 dark:bg-gray-700/50 backdrop-blur-sm px-4 py-2 rounded-xl">
                <p className="text-xs text-gray-500 dark:text-gray-400">Saved</p>
                <p className="text-xl font-bold text-gray-900 dark:text-white">{stats.savedPosts}</p>
              </div>
            </div>
          </div>
          
          {/* Action Button */}
          <div className="mt-4 sm:mt-0">
            <Link
              href="/blog/new"
              className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
              </svg>
              New Post
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}