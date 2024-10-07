'use client';

import { useState, useEffect } from 'react';
import { markdownToHtml } from 'lib/markdown';

interface MarkdownContentProps {
  content: string;
}

export default function MarkdownContent({ content }: MarkdownContentProps) {
  const [htmlContent, setHtmlContent] = useState('');

  useEffect(() => {
    markdownToHtml(content).then(setHtmlContent);
  }, [content]);

  return (
    <div style={containerStyle}>
      <div dangerouslySetInnerHTML={{ __html: htmlContent }} style={contentStyle} />
    </div>
  );
}

const containerStyle: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'center', // centers horizontally
  // alignItems: 'center', // centers vertically
  height: '100vh', // takes full viewport height for vertical centering
};

const contentStyle: React.CSSProperties = {
  textAlign: 'left', // optional, if you want text to be centered inside the markdown content
  maxWidth: '800px', // optional, set a max width if you want the content to be constrained
  width: '100%',
};
