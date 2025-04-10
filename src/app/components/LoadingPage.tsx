"use client"
import { useState, useEffect } from 'react';

const QUOTES = [
  "Bringing you inspiring stories... just a moment! ✨",
  "Your next favorite post is loading... ✨",
  "Words are coming together — almost there! ✨",
  "Good thoughts take time... thanks for waiting ✍️",
  "Loading ideas worth sharing... hang tight! 📚",
];

export default function LoadingPage() {
  const [quote, setQuote] = useState('');

  useEffect(() => {
    const randomQuote = QUOTES[Math.floor(Math.random() * QUOTES.length)];  
    setQuote(randomQuote);
  }, []);

  return (
    <div className="w-full min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-400 via-indigo-500 to-purple-600 text-white">
      <div className="relative">
        <div className="w-24 h-24 rounded-full bg-gradient-to-br from-white/30 to-white/10 flex items-center justify-center mb-4 animate-pulse">
          <div className="w-20 h-20 border-t-4 border-white rounded-full animate-spin"></div>
        </div>
        <div className="absolute top-0 right-0 w-6 h-6 rounded-full bg-white animate-ping"></div>
      </div>
      <p className="mt-8 text-2xl text-center font-medium max-w-xs animate-pulse">{quote}</p>
    </div>
  );
}