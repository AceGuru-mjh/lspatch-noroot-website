"use client";

import { useState } from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import { Check, Copy, FileCode2 } from "lucide-react";

interface CodeBlockProps {
  code: string;
  lang?: string;
  fileName?: string;
  maxHeight?: number;
  compact?: boolean;
}

export function CodeBlock({
  code,
  lang = "kotlin",
  fileName,
  maxHeight = 480,
  compact = false,
}: CodeBlockProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* clipboard unavailable */
    }
  };

  return (
    <div className="glass-card overflow-hidden rounded-2xl">
      {/* 头部 */}
      <div className="flex items-center justify-between border-b border-white/8 bg-black/30 px-3 py-2">
        <div className="flex items-center gap-2 min-w-0">
          <FileCode2 className="h-3.5 w-3.5 shrink-0 text-white/50" />
          {fileName && (
            <span className="truncate font-mono text-[11px] text-white/70">{fileName}</span>
          )}
        </div>
        <button
          onClick={handleCopy}
          className="m3-state flex shrink-0 items-center gap-1 rounded-md bg-white/8 px-2 py-1 text-[10px] font-medium text-white/70 transition-colors hover:text-white"
        >
          {copied ? (
            <>
              <Check className="h-3 w-3 text-emerald-400" />
              已复制
            </>
          ) : (
            <>
              <Copy className="h-3 w-3" />
              复制
            </>
          )}
        </button>
      </div>

      {/* 代码 */}
      <div className="lsp-scroll overflow-auto" style={{ maxHeight }}>
        <SyntaxHighlighter
          language={lang}
          style={oneDark}
          customStyle={{
            margin: 0,
            background: "transparent",
            padding: compact ? "12px 14px" : "16px 18px",
            fontSize: compact ? "11.5px" : "12.5px",
            lineHeight: "1.6",
          }}
          codeTagProps={{
            style: { fontFamily: "var(--font-geist-mono), ui-monospace, monospace" },
          }}
          showLineNumbers={!compact}
          lineNumberStyle={{ color: "rgba(255,255,255,0.25)", fontSize: "10px", minWidth: "2.5em" }}
        >
          {code}
        </SyntaxHighlighter>
      </div>
    </div>
  );
}
