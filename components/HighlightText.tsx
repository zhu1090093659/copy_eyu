interface HighlightTextProps {
  text: string;
  query: string;
  className?: string;
}

export function HighlightText({ text, query, className = "" }: HighlightTextProps) {
  if (!query.trim()) {
    return <span className={className}>{text}</span>;
  }

  const keywords = query.trim().split(/\s+/);
  let highlightedText = text;
  
  keywords.forEach(keyword => {
    if (keyword.length > 1) {
      const regex = new RegExp(`(${keyword})`, 'gi');
      highlightedText = highlightedText.replace(
        regex,
        `<mark class="bg-yellow-200 text-yellow-900 rounded px-1">$1</mark>`
      );
    }
  });

  return (
    <span 
      className={className}
      dangerouslySetInnerHTML={{ __html: highlightedText }}
    />
  );
} 