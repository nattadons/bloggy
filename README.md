# Bloggy

A minimalist personal blogging platform built with Next.js, TypeScript, and Tailwind CSS.

## 📋 Overview

Bloggy is a full-stack web application that allows users to create and share their own blog posts after signing in. The platform provides a clean, simple blogging experience where authenticated users can write, edit, and manage their content.

## 🌟 Features

- **User Authentication**: Secure sign-in and sign-out functionality using NextAuth.js
- **Content Management**: Create, edit, and delete your own blog posts
- **Responsive Design**: Fully responsive UI that works on mobile, tablet, and desktop
- **Rich Text Editing**: Simple yet powerful editor for writing your blog posts
- **Post Discovery**: Browse all published posts on the homepage
- **Individual Post Pages**: Dedicated pages for each blog post with unique URLs

## 🔧 Tech Stack

- **Framework**: Next.js (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Authentication**: NextAuth.js
- **Database**: Prisma with SQLite
- **Deployment**: Vercel

## 🚀 Getting Started

### Prerequisites

- Node.js (v16 or later)
- npm or yarn

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
   DATABASE_URL="file:./dev.db"
   NEXTAUTH_SECRET="your-nextauth-secret"
   NEXTAUTH_URL="http://localhost:3000"
   ```

4. Initialize the database:
   ```bash
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
bloggy/
├── app/                  # App router pages and layouts
│   ├── api/              # API routes
│   ├── posts/            # Post-related pages
│   └── ...
├── components/           # Reusable UI components
├── lib/                  # Utility functions and shared code
├── prisma/               # Database schema and migrations
├── public/               # Static assets
└── styles/               # Global styles
```

## 💻 Development

### Database Schema

The main entities in the database are:

- **User**: Represents an authenticated user
- **Post**: A blog post created by a user

### Authentication Flow

1. User navigates to the sign-in page
2. User authenticates with their credentials
3. Upon successful authentication, the user is redirected to the homepage
4. Authenticated users can create and manage their posts

### Post Management

- Only authenticated users can create posts
- Users can only edit or delete their own posts
- All published posts are visible to everyone on the homepage

## 🔒 Security Considerations

- Authentication is handled by NextAuth.js
- User-generated content is sanitized to prevent XSS attacks
- API routes are protected with session validation

## 📱 Responsive Design

Bloggy is designed to work well on devices of all sizes:

- Mobile: 375px and up
- Tablet: 768px and up
- Desktop: 1024px and up

## 🔄 Continuous Integration

This project uses GitHub Actions for continuous integration to ensure code quality.

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 👥 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 🙏 Acknowledgements

- [Next.js](https://nextjs.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [NextAuth.js](https://next-auth.js.org/)
- [Prisma](https://www.prisma.io/)
