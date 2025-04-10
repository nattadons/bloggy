import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    domains: ['plus.unsplash.com', 'images.unsplash.com', 'example.com','lh3.googleusercontent.com',  // Google user profile images
      'platform-lookaside.fbsbx.com',  // Facebook user profile images
      'graph.facebook.com','res.cloudinary.com',  ]// Another domain for Facebook images   ], // Add your image domains here
  },
};

export default nextConfig;
