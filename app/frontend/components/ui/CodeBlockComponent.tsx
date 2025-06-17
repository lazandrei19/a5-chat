import React, { useState, useEffect, useRef } from 'react';
import { type LLMOutputComponent } from "@llm-ui/react";
import { Copy, Check } from 'lucide-react';
import { Button } from './button';
import Prism from 'prismjs';

// Import core languages for syntax highlighting
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-typescript';
import 'prismjs/components/prism-python';
import 'prismjs/components/prism-ruby';
import 'prismjs/components/prism-json';
import 'prismjs/components/prism-bash';
import 'prismjs/components/prism-sql';
import 'prismjs/components/prism-css';
import 'prismjs/components/prism-markup';

// Enhanced code block component with copy functionality and syntax highlighting
const CodeBlockComponent: LLMOutputComponent = ({ blockMatch }) => {
  const [isCopied, setIsCopied] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const codeRef = useRef<HTMLElement>(null);
  
  // Extract the code content from the markdown code block
  const codeBlock = blockMatch.output;
  
  // Simple regex to extract language and code from markdown code blocks
  const match = codeBlock.match(/^```(\w+)?\n?([\s\S]*?)```$/);
  const language = match?.[1] || '';
  const code = match?.[2] || codeBlock;

  // Map language aliases to Prism language identifiers
  const getPrismLanguage = (lang: string) => {
    const langMap: { [key: string]: string } = {
      'js': 'javascript',
      'ts': 'typescript',
      'py': 'python',
      'rb': 'ruby',
      'sh': 'bash',
      'shell': 'bash',
      'html': 'markup',
      'xml': 'markup',
    };
    const normalizedLang = lang.toLowerCase();
    return langMap[normalizedLang] || normalizedLang || 'text';
  };

  const prismLanguage = getPrismLanguage(language);

  // Apply syntax highlighting after component mounts/updates
  useEffect(() => {
    if (codeRef.current && prismLanguage !== 'text') {
      Prism.highlightElement(codeRef.current);
    }
  }, [code, prismLanguage]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy code:', err);
    }
  };

  return (
    <div 
      className="my-4 group relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="bg-gray-900 rounded-lg overflow-hidden shadow-sm border border-gray-700">
        {/* Header with language and copy button */}
        <div className="flex items-center justify-between bg-gray-800 px-4 py-2 border-b border-gray-600">
          <div className="flex items-center space-x-2">
            {language && (
              <span className="text-xs font-medium text-gray-300 bg-gray-700 px-2 py-1 rounded">
                {language}
              </span>
            )}
          </div>
          
          {/* Copy button - shows on hover */}
          <div className={`transition-opacity duration-200 ${isHovered ? 'opacity-100' : 'opacity-0'}`}>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleCopy}
              className="h-7 w-7 p-0 text-gray-400 hover:text-white hover:bg-gray-700 rounded"
              title={isCopied ? 'Copied!' : 'Copy code'}
            >
              {isCopied ? (
                <Check className="h-3.5 w-3.5 text-green-400" />
              ) : (
                <Copy className="h-3.5 w-3.5" />
              )}
            </Button>
          </div>
        </div>
        
        {/* Code content with syntax highlighting */}
        <div className="relative">
          <pre className="p-4 overflow-x-auto text-sm bg-gray-900 m-0" style={{ background: '#2d3748' }}>
            <code 
              ref={codeRef}
              className={`language-${prismLanguage} font-mono text-sm`}
              style={{ background: 'transparent' }}
            >
              {code}
            </code>
          </pre>
        </div>
      </div>
    </div>
  );
};

export default CodeBlockComponent; 