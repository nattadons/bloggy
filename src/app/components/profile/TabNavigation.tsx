// app/components/profile/TabNavigation.tsx
type TabNavigationProps = {
    activeTab: string;
    onTabChange: (tab: string) => void;
  };
  
  export default function TabNavigation({ activeTab, onTabChange }: TabNavigationProps) {
    return (
      <div className="flex justify-center mb-8">
        <div className="inline-flex p-1 rounded-lg bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm shadow-md">
          <button
            onClick={() => onTabChange('posts')}
            className={`px-4 py-2 rounded-lg transition-all duration-300 ${
              activeTab === 'posts'
                ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg'
                : 'text-gray-700 dark:text-gray-300 hover:bg-white/30 dark:hover:bg-gray-700/30'
            }`}
          >
            My Posts
          </button>
          <button
            onClick={() => onTabChange('saved')}
            className={`px-4 py-2 rounded-lg transition-all duration-300 ${
              activeTab === 'saved'
                ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg'
                : 'text-gray-700 dark:text-gray-300 hover:bg-white/30 dark:hover:bg-gray-700/30'
            }`}
          >
            Saved Blogs
          </button>
        </div>
      </div>
    );
  }