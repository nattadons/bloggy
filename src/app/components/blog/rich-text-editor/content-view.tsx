'use client'

interface ContentViewProps {
  content: string;
}

export default function ContentView({ content }: ContentViewProps) {
  return (
    <div 
      className="prose dark:prose-invert lg:prose-lg max-w-none"
      dangerouslySetInnerHTML={{ __html: content }} 
    />
  );
}