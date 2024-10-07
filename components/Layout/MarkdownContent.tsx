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

  return <div dangerouslySetInnerHTML={{ __html: htmlContent }} />;
}
