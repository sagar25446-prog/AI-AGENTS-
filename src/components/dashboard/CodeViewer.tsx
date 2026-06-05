'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GeneratedFile } from '@/lib/agents/types';
import {
  FileCode2,
  Copy,
  Check,
  FolderTree,
  ChevronRight,
  Download,
  FileJson,
  FileText,
} from 'lucide-react';

interface CodeViewerProps {
  files: GeneratedFile[];
}

const FILE_ICONS: Record<string, React.ReactNode> = {
  tsx: <FileCode2 size={14} className="text-cyan-400" />,
  ts: <FileCode2 size={14} className="text-blue-400" />,
  json: <FileJson size={14} className="text-yellow-400" />,
  css: <FileCode2 size={14} className="text-pink-400" />,
  md: <FileText size={14} className="text-[#8892b0]" />,
  dockerfile: <FileCode2 size={14} className="text-blue-400" />,
  yaml: <FileCode2 size={14} className="text-red-400" />,
  yml: <FileCode2 size={14} className="text-red-400" />,
};

function getFileIcon(path: string) {
  const ext = path.split('.').pop()?.toLowerCase() || '';
  return FILE_ICONS[ext] || <FileText size={14} className="text-[#8892b0]" />;
}

// Syntax highlighting (simplified)
function highlightCode(code: string, lang: string): string {
  // Keywords
  const keywords = ['import', 'export', 'default', 'from', 'const', 'let', 'var', 'function', 'return', 'if', 'else', 'class', 'interface', 'type', 'new', 'this', 'async', 'await', 'try', 'catch', 'throw', 'extends', 'implements'];
  const jsxKeywords = ['div', 'span', 'button', 'input', 'main', 'h1', 'h2', 'h3', 'p', 'section', 'header', 'footer'];

  let highlighted = code
    // HTML encode
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    // Strings
    .replace(/(["'`])((?:(?!\1)[^\\]|\\.)*)(\1)/g, '<span style="color:#a5d6ff">$1$2$3</span>')
    // Comments
    .replace(/(\/\/.*$)/gm, '<span style="color:#4a5568">$1</span>')
    // Numbers
    .replace(/\b(\d+)\b/g, '<span style="color:#fbbf24">$1</span>');

  // Keywords
  keywords.forEach(kw => {
    highlighted = highlighted.replace(
      new RegExp(`\\b(${kw})\\b`, 'g'),
      '<span style="color:#ff79c6">$1</span>'
    );
  });

  return highlighted;
}

export default function CodeViewer({ files }: CodeViewerProps) {
  const [selectedFile, setSelectedFile] = useState(0);
  const [copied, setCopied] = useState(false);
  const [displayedLines, setDisplayedLines] = useState(0);
  const codeRef = useRef<HTMLPreElement>(null);

  const currentFile = files[selectedFile];

  // Typing animation for code
  useEffect(() => {
    if (!currentFile) return;
    setDisplayedLines(0);
    const totalLines = currentFile.content.split('\n').length;
    let current = 0;

    const interval = setInterval(() => {
      current += 3; // 3 lines at a time
      if (current >= totalLines) {
        setDisplayedLines(totalLines);
        clearInterval(interval);
      } else {
        setDisplayedLines(current);
      }
    }, 50);

    return () => clearInterval(interval);
  }, [selectedFile, currentFile]);

  const handleCopy = async () => {
    if (!currentFile) return;
    await navigator.clipboard.writeText(currentFile.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (files.length === 0) {
    return (
      <div className="glass rounded-xl p-8 flex flex-col items-center justify-center min-h-[400px]">
        <motion.div
          animate={{ rotate: [0, 10, -10, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="text-6xl mb-4"
        >
          📦
        </motion.div>
        <h3 className="text-xl font-bold text-white mb-2">No Code Generated Yet</h3>
        <p className="text-[#8892b0] text-center max-w-md">
          The agents are still working on your project. Source code will appear
          here once the building stage is complete.
        </p>
      </div>
    );
  }

  const lines = currentFile.content.split('\n');
  const visibleContent = lines.slice(0, displayedLines).join('\n');

  return (
    <div className="glass rounded-xl overflow-hidden flex" style={{ height: '600px' }}>
      {/* File Tree Sidebar */}
      <div className="w-64 border-r border-white/5 flex flex-col flex-shrink-0">
        <div className="px-4 py-3 border-b border-white/5 flex items-center gap-2">
          <FolderTree size={14} className="text-[#00d4ff]" />
          <span className="text-xs font-semibold text-[#8892b0] uppercase tracking-wider">
            Files
          </span>
          <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-white/5 text-[#4a5568] ml-auto">
            {files.length}
          </span>
        </div>
        <div className="flex-1 overflow-y-auto p-2 space-y-0.5">
          {files.map((file, index) => (
            <button
              key={file.path}
              onClick={() => setSelectedFile(index)}
              className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-left text-xs transition-all ${
                index === selectedFile
                  ? 'bg-[#00d4ff]/10 text-[#00d4ff]'
                  : 'text-[#8892b0] hover:bg-white/5 hover:text-white'
              }`}
            >
              {getFileIcon(file.path)}
              <ChevronRight size={10} className="text-[#4a5568]" />
              <span className="truncate font-mono">{file.path}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Code Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* File Tab Bar */}
        <div className="px-4 py-2 border-b border-white/5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            {getFileIcon(currentFile.path)}
            <span className="text-sm font-mono text-white">{currentFile.path}</span>
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-white/5 text-[#4a5568] uppercase">
              {currentFile.language}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-xs text-[#8892b0] hover:text-white transition-all"
            >
              {copied ? <Check size={12} className="text-emerald-400" /> : <Copy size={12} />}
              {copied ? 'Copied!' : 'Copy'}
            </button>
          </div>
        </div>

        {/* Code Content */}
        <div className="flex-1 overflow-auto">
          <pre
            ref={codeRef}
            className="code-block p-4 text-sm leading-6"
          >
            {lines.slice(0, displayedLines).map((line, i) => (
              <div key={i} className="flex hover:bg-white/[0.02] -mx-4 px-4">
                <span className="code-line-number select-none flex-shrink-0 w-10 text-right pr-4 text-[#4a5568] text-xs">
                  {i + 1}
                </span>
                <code
                  className="flex-1 text-[#c8d1e0]"
                  dangerouslySetInnerHTML={{
                    __html: highlightCode(line, currentFile.language),
                  }}
                />
              </div>
            ))}
            {displayedLines < lines.length && (
              <motion.div
                animate={{ opacity: [1, 0] }}
                transition={{ repeat: Infinity, duration: 0.6 }}
                className="flex items-center gap-2 mt-1 text-[#00d4ff]"
              >
                <span className="w-10" />
                <span className="text-sm">▊</span>
              </motion.div>
            )}
          </pre>
        </div>
      </div>
    </div>
  );
}
