# Bloggy

A full-stack personal blogging platform built with Next.js, TypeScript, and Tailwind CSS where users can create, manage, and share blog posts.

## 📋 Overview

Bloggy is a modern blogging platform that allows users to create and share their own blog posts after signing in. The platform provides a clean, simple blogging experience where authenticated users can write, edit, and manage their content.

## 🌟 Features

### User Features
- **Social Authentication**: Secure sign-in with Google and Facebook using NextAuth.js
- **Content Management**: Create, edit, and delete your own blog posts
- **Rich Text Editor**: Format your blog posts with a powerful rich text editor
- **Image Upload**: Add cover images to your blog posts with Cloudinary integration
- **Comments System**: Engage with readers through comments
- **Save Posts**: Bookmark posts you like to read later
- **Profile Dashboard**: View and manage your posts and saved content

### Technical Features
- **Responsive Design**: Fully adaptive UI for mobile, tablet, and desktop
- **API Routes**: RESTful API for content management
- **Server-Side Authentication**: Secure API routes with NextAuth.js
- **Database Integration**: Prisma ORM with SQL database
- **Route Protection**: Middleware for protecting authenticated routes
- **Admin Panel**: Special dashboard for admin users to manage all content

## 🔧 Tech Stack

- **Framework**: Next.js (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Authentication**: NextAuth.js with Google and Facebook providers
- **Database**: Prisma with SQLite (can be changed to other SQL databases)
- **Image Storage**: Cloudinary
- **Rich Text Editor**: TipTap
- **UI Components**: Headless UI, Lucide React icons
- **Date Formatting**: date-fns
- **Sharing**: next-share

## 🚀 Getting Started

### Prerequisites

- Node.js (v16 or later)
- npm or yarn
- Cloudinary account (for image uploads)
- Google and Facebook OAuth credentials

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/bloggy.git
   cd bloggy
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

3. Set up environment variables:
   Create a `.env.local` file in the root directory with the following variables:
   ```
   # Database
   DATABASE_URL="file:./dev.db"
   
   # Authentication
   NEXTAUTH_URL="http://localhost:3000"
   NEXTAUTH_SECRET="your-nextauth-secret"
   
   # OAuth Providers
   GOOGLE_CLIENT_ID="your-google-client-id"
   GOOGLE_CLIENT_SECRET="your-google-client-secret"
   FACEBOOK_CLIENT_ID="your-facebook-client-id"
   FACEBOOK_CLIENT_SECRET="your-facebook-client-secret"
   
   # Cloudinary
   CLOUDINARY_CLOUD_NAME="your-cloud-name"
   CLOUDINARY_API_KEY="your-api-key"
   CLOUDINARY_API_SECRET="your-api-secret"
   ```

4. Initialize the database:
   ```bash
   npx prisma generate
   npx prisma migrate dev --name init
   ```

5. Start the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   ```

6. Open your browser and navigate to `http://localhost:3000`

## 📁 Project Structure

```
src/
├── app/                  # App router pages and layouts
│   ├── admin/            # Admin dashboard
│   ├── api/              # API routes
│   │   ├── auth/         # Authentication endpoints
│   │   ├── comments/     # Comments endpoints
│   │   ├── favorites/    # Favorites management
│   │   ├── posts/        # Blog posts endpoints
│   │   └── users/        # User-related endpoints
│   ├── blog/             # Blog pages
│   ├── components/       # UI components
│   │   ├── admin/        # Admin-specific components
│   │   ├── blog/         # Blog-related components
│   │   └── profile/      # Profile-related components
│   ├── context/          # React context providers
│   ├── images/           # Static images
│   ├── login/            # Authentication pages
│   └── profile/          # User profile pages
├── lib/                  # Utility functions and shared code
│   ├── auth.ts           # NextAuth configuration
│   ├── cloudinary.ts     # Cloudinary configuration
│   ├── prisma.ts         # Prisma client initialization
│   └── utils.ts          # Helper utilities
├── middleware.ts         # Next.js middleware for route protection
└── types/                # TypeScript type definitions
```

## 💻 Key Features Explained

### Authentication Flow

1. User navigates to the login page
2. User authenticates with Google or Facebook OAuth
3. Upon successful authentication, user information is saved in the database
4. User session is created with JWT
5. Protected routes check for valid session

### Post Management

- Create: Rich text editor with image upload
- Edit: Modify post content, title, excerpt, and cover image
- Delete: Remove posts with confirmation
- View: Display formatted content with related posts

### Comments System

- Add comments to posts when logged in
- Edit or delete your own comments
- Post authors can delete any comments on their posts

### Favorites System

- Save posts to read later
- View all saved posts in your profile
- Easily remove posts from your saved list

## 📱 Responsive Design

Bloggy is designed to work well on devices of all sizes:

- Mobile: 375px and up
- Tablet: 768px and up
- Desktop: 1024px and up

## 🔒 Security Considerations

- OAuth authentication with NextAuth.js
- Protected API routes with session validation
- Middleware for route protection
- Content sanitization to prevent XSS attacks

## 📄 Database Schema

The main entities in the database are:

- **User**: Represents an authenticated user
  - Has roles (user, admin)
  - Can have many posts, comments, and saved posts

- **Post**: A blog post created by a user
  - Contains title, content, excerpt, image URL
  - Can have many comments

- **Comment**: A comment on a blog post
  - Created by a user
  - Belongs to a post

## 🌐 Deployment

The application is designed to be deployed on Vercel, but can be deployed to any platform that supports Next.js applications.

### Deploying to Vercel

1. Push your code to a Git repository (GitHub, GitLab, BitBucket)
2. Import your repository in Vercel
3. Configure environment variables
4. Deploy

## 🧪 Future Enhancements

- **Analytics**: Track post views and engagement
- **Notifications**: Alert users about comments and interactions
- **Tags and Categories**: Better organization of content
- **Newsletter**: Email subscription for new posts
- **Search Improvements**: Advanced search with filters

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 👥 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 🙏 Acknowledgements

- [Next.js](https://nextjs.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [NextAuth.js](https://next-auth.js.org/)
- [Prisma](https://www.prisma.io/)
- [Cloudinary](https://cloudinary.com/)
- [TipTap](https://tiptap.dev/)
