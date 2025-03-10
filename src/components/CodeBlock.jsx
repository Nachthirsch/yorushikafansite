import { useState } from "react";

export default function CodeBlock({ code, language }) {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(code).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div className="relative rounded-lg overflow-hidden">
      <div className="flex items-center justify-between px-4 py-2 bg-neutral-100 dark:bg-neutral-800 border-b border-neutral-200 dark:border-neutral-700">
        <span className="text-xs font-medium text-neutral-600 dark:text-neutral-400">{language || "code"}</span>
        <button onClick={copyToClipboard} className="text-xs px-2 py-1 rounded bg-neutral-200 dark:bg-neutral-700 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-300 dark:hover:bg-neutral-600 transition-colors">
          {copied ? "Copied!" : "Copy"}
        </button>
      </div>
      <pre className="p-4 bg-neutral-50 dark:bg-neutral-900 overflow-x-auto text-neutral-800 dark:text-neutral-200 text-sm">
        <code>{code}</code>
      </pre>
    </div>
  );
}
