// app/data/posts.ts
export const AuthorImage = 'https://plus.unsplash.com/premium_photo-1690407617542-2f210cf20d7e?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D';

export const mockPosts = [
  {
    id: '1',
    title: 'Getting Started with Next.js',
    excerpt: 'Learn the basics of Next.js and how to build your first application. We cover routing, data fetching, and deployment to get you started quickly.',
    content: `
      <p>Next.js is a powerful React framework that makes building web applications easier and more efficient. In this article, we'll explore the basics of Next.js and how to get started with your first project.</p>
      
      <h2>What is Next.js?</h2>
      <p>Next.js is a React framework that provides server-side rendering, static site generation, and many other features out of the box. It's designed to make building React applications more straightforward and productive.</p>
      
      <!-- เนื้อหาที่เหลือ -->
    `,
    author: 'John Doe',
    authorId: '1',
    authorBio: 'Senior Frontend Developer with 10+ years of experience in building web applications.',
    authorAvatar: AuthorImage,
   
    date: '2023-09-10',
    readTime: '5 min',
    coverImage: '/images/Bloggy.png',
    tags: ['Next.js', 'React', 'Web Development'],
  },
  // เพิ่มโพสต์อื่นๆ ที่เหลือ...
  {
    id: '2',
    title: 'Why TypeScript Makes Your Code Better',
    excerpt: 'Explore the benefits of using TypeScript in your projects and how it improves code quality. Learn about type safety and developer productivity improvements.',
    content: `
      <p>TypeScript has gained immense popularity in recent years, and for good reason. It adds static typing to JavaScript, which can help catch errors early and make your code more robust.</p>
      
      <!-- เนื้อหาที่เหลือ -->
    `,
    author: 'Jane Smith',
    authorId: '2',
    authorBio: 'TypeScript enthusiast and software engineer at a leading tech company.',
    authorAvatar: AuthorImage,

    date: '2023-09-08',
    readTime: '7 min',
    coverImage: '/images/Bloggy.png',
    tags: ['TypeScript', 'JavaScript', 'Programming'],
  },
  {
    id: '3',
    title: 'Styling with Tailwind CSS',
    excerpt: 'Discover how Tailwind CSS can speed up your development workflow and make design more consistent. We cover utility classes and customization options.',
    content: `
      <p>Tailwind CSS has revolutionized the way many developers approach styling their web applications. With its utility-first approach, it offers a different paradigm compared to traditional CSS frameworks.</p>
      
      <!-- เนื้อหาที่เหลือ -->
    `,
    author: 'Alex Johnson',
    authorId: '3',
    authorBio: 'UI/UX designer and frontend developer specializing in modern CSS frameworks.',
    authorAvatar: AuthorImage,
   
    date: '2023-09-05',
    readTime: '6 min',
    coverImage: '/images/Bloggy.png',
    tags: ['CSS', 'Tailwind CSS', 'Web Design'],
  },
];