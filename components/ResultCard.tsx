
import React, { useState } from 'react';

interface ResultCardProps {
  title: string;
  content: string | string[];
  isList?: boolean;
}

const ResultCard: React.FC<ResultCardProps> = ({ title, content, isList = false }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    // If it's a list (especially tags), copy as comma-separated
    const textToCopy = Array.isArray(content) 
      ? (title.toLowerCase().includes('tag') ? content.join(', ') : content.join(' '))
      : content;
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden flex flex-col h-full">
      <div className="px-4 py-3 bg-zinc-800/50 flex justify-between items-center border-b border-zinc-700">
        <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-widest">{title}</h3>
        <button 
          onClick={handleCopy}
          className="text-xs text-red-500 hover:text-red-400 font-medium transition-colors"
        >
          {copied ? 'Copied!' : 'Copy'}
        </button>
      </div>
      <div className="p-4 flex-grow">
        {isList && Array.isArray(content) ? (
          <div className="flex flex-wrap gap-2">
            {content.map((item, idx) => (
              <span key={idx} className="bg-zinc-800 text-zinc-300 px-2 py-1 rounded text-sm border border-zinc-700">
                {item}
                {idx < content.length - 1 && title.toLowerCase().includes('tag') ? ',' : ''}
              </span>
            ))}
          </div>
        ) : (
          <p className="text-zinc-300 text-sm whitespace-pre-wrap leading-relaxed">
            {content}
          </p>
        )}
      </div>
    </div>
  );
};

export default ResultCard;
