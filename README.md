Bloggy
A minimalist personal blogging platform built with Next.js, TypeScript, and Tailwind CSS.
📋 Overview
Bloggy is a full-stack web application that allows users to create and share their own blog posts after signing in. The platform provides a clean, simple blogging experience where authenticated users can write, edit, and manage their content.
🌟 Features

User Authentication: Secure sign-in and sign-out functionality using NextAuth.js
Content Management: Create, edit, and delete your own blog posts
Responsive Design: Fully responsive UI that works on mobile, tablet, and desktop
Rich Text Editing: Simple yet powerful editor for writing your blog posts
Post Discovery: Browse all published posts on the homepage
Individual Post Pages: Dedicated pages for each blog post with unique URLs

🔧 Tech Stack

Framework: Next.js (App Router)
Language: TypeScript
Styling: Tailwind CSS
Authentication: NextAuth.js
Database: Prisma with SQLite
Deployment: Vercel

🚀 Getting Started
Prerequisites

Node.js (v16 or later)
npm or yarn

Installation

Clone the repository:
bashgit clone https://github.com/yourusername/bloggy.git
cd bloggy

Install dependencies:
bashnpm install
# or
yarn install

Set up environment variables:
Create a .env.local file in the root directory with the following variables:
DATABASE_URL="file:./dev.db"
NEXTAUTH_SECRET="your-nextauth-secret"
NEXTAUTH_URL="http://localhost:3000"

Initialize the database:
bashnpx prisma migrate dev --name init

Start the development server:
bashnpm run dev
# or
yarn dev

Open your browser and navigate to http://localhost:3000
