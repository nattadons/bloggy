"use client"

import { useState } from 'react';
import {
  FacebookShareButton,
  FacebookIcon,
  LineShareButton,
  LineIcon,
  TwitterShareButton,
  TwitterIcon,
  LinkedinShareButton,
  LinkedinIcon,
  EmailShareButton,
  EmailIcon,
  WhatsappShareButton,
  WhatsappIcon,
  TelegramShareButton,
  TelegramIcon
} from 'next-share';
import { Link as LinkIcon, Check } from 'lucide-react';

type ShareButtonsProps = {
  title: string;
  url: string;
  excerpt?: string;
};

export default function ShareButtons({ title, url, excerpt }: ShareButtonsProps) {
  const [copied, setCopied] = useState(false);
  
  // Handle copy link to clipboard
  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000); // Reset after 2 seconds
    } catch (err) {
      console.error('Failed to copy link:', err);
    }
  };

  return (
    <div className="flex flex-col items-center my-6">
      <h3 className="text-lg font-medium text-gray-800 dark:text-white mb-2">
        Share this post
      </h3>
      <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 text-center max-w-md">
        If you found this article helpful, please share it with your friends and colleagues!
      </p>
      
      <div className="flex flex-wrap justify-center gap-2 mb-4">
        <FacebookShareButton url={url} quote={title}>
          <FacebookIcon size={40} round />
        </FacebookShareButton>
        
        <TwitterShareButton url={url} title={title}>
          <TwitterIcon size={40} round />
        </TwitterShareButton>
        
        <LinkedinShareButton url={url} title={title} summary={excerpt || ''}>
          <LinkedinIcon size={40} round />
        </LinkedinShareButton>
        
        <WhatsappShareButton url={url} title={title} separator=" - ">
          <WhatsappIcon size={40} round />
        </WhatsappShareButton>
        
        <TelegramShareButton url={url} title={title}>
          <TelegramIcon size={40} round />
        </TelegramShareButton>
        
        <LineShareButton url={url} title={title}>
          <LineIcon size={40} round />
        </LineShareButton>
        
        <EmailShareButton url={url} subject={title} body={`Check out this post: ${title}\n${excerpt || ''}\n\n${url}`}>
          <EmailIcon size={40} round />
        </EmailShareButton>
        
        {/* Copy Link Button */}
        <button
          onClick={handleCopyLink}
          className={`flex items-center justify-center w-10 h-10 rounded-full transition-all ${
            copied
              ? 'bg-green-500 text-white'
              : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
          }`}
          aria-label="Copy link to clipboard"
        >
          {copied ? <Check size={20} /> : <LinkIcon size={20} />}
        </button>
      </div>
      
      <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
        URL: {url.length > 40 ? url.substring(0, 40) + '...' : url}
      </p>
    </div>
  );
}