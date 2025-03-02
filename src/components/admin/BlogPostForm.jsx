/* eslint-disable no-unused-vars */
import { useState, useEffect, useRef } from "react";
import TextareaAutosize from "react-textarea-autosize";
import { motion } from "framer-motion";
import { FileText, Bold, Italic, Link, List, Heading1, Heading2, Eye, Cloud, Clock, Hash, SaveAll, AlignLeft, Quote, Code } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";

export default function BlogPostForm({ post, isEditing, onSubmit, onChange }) {
  const [textStats, setTextStats] = useState({ words: 0, chars: 0, readingTime: 0, paragraphs: 0 });
  const [formTouched, setFormTouched] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const editorRef = useRef(null);
  const [selection, setSelection] = useState(null);

  useEffect(() => {
    if (post?.content) {
      const words = post.content.trim().split(/\s+/).length;
      const chars = post.content.length;
      const paragraphs = post.content.split(/\n\s*\n/).filter((p) => p.trim().length > 0).length;
      // Average reading speed: 200 words per minute
      const readingTime = Math.max(1, Math.ceil(words / 200));

      setTextStats({ words, chars, readingTime, paragraphs });
    } else {
      setTextStats({ words: 0, chars: 0, readingTime: 0, paragraphs: 0 });
    }
  }, [post?.content]);

  // Mark form as touched when any field changes
  useEffect(() => {
    if (post?.title || post?.content) {
      setFormTouched(true);
    }
  }, [post?.title, post?.content]);

  const handleClear = () => {
    onChange({ title: "", content: "" });
    setFormTouched(false);
  };

  const getLineNumbers = () => {
    if (!post.content) return [];
    return post.content.split("\n").map((_, idx) => idx + 1);
  };

  const handleSelectionChange = () => {
    const selection = window.getSelection();
    if (selection.toString().length > 0) {
      const range = selection.getRangeAt(0);
      const rect = range.getBoundingClientRect();
      setSelection({ text: selection.toString(), rect });
    } else {
      setSelection(null);
    }
  };

  useEffect(() => {
    const editor = editorRef.current;
    if (editor) {
      editor.addEventListener("mouseup", handleSelectionChange);
      editor.addEventListener("keyup", handleSelectionChange);
      return () => {
        editor.removeEventListener("mouseup", handleSelectionChange);
        editor.removeEventListener("keyup", handleSelectionChange);
      };
    }
  }, []);

  const handleFormatting = (type) => {
    const textarea = editorRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = post.content.substring(start, end);
    let formattedText = "";
    let cursorOffset = 0;

    switch (type) {
      case "bold":
        formattedText = `**${selectedText}**`;
        cursorOffset = 2;
        break;
      case "italic":
        formattedText = `_${selectedText}_`;
        cursorOffset = 1;
        break;
      case "h1":
        formattedText = `# ${selectedText}`;
        cursorOffset = 2;
        break;
      case "h2":
        formattedText = `## ${selectedText}`;
        cursorOffset = 3;
        break;
      case "list":
        formattedText = selectedText
          .split("\n")
          .map((line) => `- ${line}`)
          .join("\n");
        cursorOffset = 2;
        break;
      case "quote":
        formattedText = selectedText
          .split("\n")
          .map((line) => `> ${line}`)
          .join("\n");
        cursorOffset = 2;
        break;
      case "code":
        formattedText = selectedText.includes("\n") ? `\`\`\`\n${selectedText}\n\`\`\`` : `\`${selectedText}\``;
        cursorOffset = selectedText.includes("\n") ? 4 : 1;
        break;
      case "link":
        formattedText = `[${selectedText}](url)`;
        cursorOffset = 3;
        break;
      default:
        return;
    }

    const newContent = post.content.substring(0, start) + formattedText + post.content.substring(end);

    onChange({ ...post, content: newContent });

    // Restore cursor position after React rerender
    setTimeout(() => {
      textarea.focus();
      const newCursorPos = end + cursorOffset;
      textarea.setSelectionRange(newCursorPos, newCursorPos);
    }, 0);
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }} className="max-w-4xl mx-auto p-4">
      <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
        {/* Editor Header */}
        <div className="flex items-center justify-between py-4 px-6 bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-4">
            <FileText className="w-6 h-6 text-gray-500 dark:text-gray-400" />
            <h2 className="text-lg font-semibold">{isEditing ? "Edit Post" : "New Post"}</h2>
          </div>
          <div className="flex items-center gap-1 px-2 bg-white dark:bg-gray-900 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
            <button onClick={() => handleFormatting("bold")} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg" title="Bold">
              <Bold className="w-4 h-4" />
            </button>
            <button onClick={() => handleFormatting("italic")} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg" title="Italic">
              <Italic className="w-4 h-4" />
            </button>
            <span className="w-px h-6 bg-gray-200 dark:bg-gray-700" />
            <button onClick={() => handleFormatting("h1")} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg" title="Heading 1">
              <Heading1 className="w-4 h-4" />
            </button>
            <button onClick={() => handleFormatting("h2")} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg" title="Heading 2">
              <Heading2 className="w-4 h-4" />
            </button>
            <span className="w-px h-6 bg-gray-200 dark:bg-gray-700" />
            <button onClick={() => handleFormatting("list")} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg" title="List">
              <List className="w-4 h-4" />
            </button>
            <button onClick={() => handleFormatting("quote")} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg" title="Quote">
              <Quote className="w-4 h-4" />
            </button>
            <button onClick={() => handleFormatting("code")} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg" title="Code">
              <Code className="w-4 h-4" />
            </button>
            <span className="w-px h-6 bg-gray-200 dark:bg-gray-700" />
            <button onClick={() => handleFormatting("link")} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg" title="Link">
              <Link className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Title Input */}
        <input type="text" value={post.title} onChange={(e) => onChange({ ...post, title: e.target.value })} className="text-2xl md:text-3xl font-bold w-full px-6 py-4 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 focus:outline-none focus:ring-0" placeholder="Post Title" required />

        {/* Editor Area */}
        <div className="relative group min-h-[400px] md:min-h-[500px]">
          {/* Line Numbers */}
          <div className="absolute left-0 top-0 bottom-0 w-10 border-r border-gray-200 dark:border-gray-700 flex flex-col items-center py-6 text-xs text-gray-500">
            {getLineNumbers().map((num) => (
              <div key={num} className="leading-6">
                {num}
              </div>
            ))}
          </div>

          {/* Content Editor */}
          <div className="relative pl-12">
            <TextareaAutosize ref={editorRef} value={post.content} onChange={(e) => onChange({ ...post, content: e.target.value })} className="w-full p-6 min-h-[400px] bg-transparent focus:outline-none font-mono text-sm" placeholder="Write your post content..." required />

            {/* Floating Toolbar */}
            {selection && (
              <div
                className="absolute bg-white dark:bg-gray-800 shadow-lg rounded-lg border border-gray-200 dark:border-gray-700 p-1 flex items-center gap-1"
                style={{
                  top: `${selection.rect.top - 40}px`,
                  left: `${selection.rect.left}px`,
                }}
              >
                {/* Add formatting buttons */}
              </div>
            )}
          </div>
        </div>

        {/* Stats Bar */}
        <div className="flex items-center justify-between px-6 py-3 bg-gray-50 dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 text-sm text-gray-500 dark:text-gray-400">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1">
              <Hash className="w-4 h-4" />
              {textStats.words} words
            </span>
            <span className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              {textStats.readingTime} min read
            </span>
            <span>{textStats.paragraphs} paragraphs</span>
          </div>
          <div className="w-48">
            <div className="h-1 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
              <div className="h-full bg-blue-500 dark:bg-blue-400 rounded-full transition-all duration-300" style={{ width: `${Math.min(100, (textStats.words / 1000) * 100)}%` }} />
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="sticky bottom-0 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 px-6 py-4 flex justify-between items-center">
          <div className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-2">
            {isSaving ? (
              <>
                <SaveAll className="w-4 h-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Cloud className="w-4 h-4" />
                Saved
              </>
            )}
          </div>

          <div className="flex items-center gap-3">
            <button type="button" onClick={handleClear} className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg font-medium border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300 transition-all duration-200" disabled={!formTouched}>
              Cancel
            </button>
            <button type="button" onClick={() => setShowPreview(!showPreview)} className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg font-medium bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 transition-all duration-200">
              <Eye className="w-4 h-4" />
              Preview
            </button>
            <button type="submit" className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg font-medium bg-blue-600 hover:bg-blue-700 text-white transition-all duration-200">
              {isEditing ? "Update" : "Publish"}
            </button>
          </div>
        </div>
      </div>

      {/* Preview Panel */}
      {showPreview && (
        <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-6 mt-6">
          <h2 className="text-2xl font-bold mb-4">{post.title}</h2>
          <div className="prose dark:prose-invert prose-sm md:prose-base lg:prose-lg max-w-none">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                code({ node, inline, className, children, ...props }) {
                  const match = /language-(\w+)/.exec(className || "");
                  return !inline && match ? (
                    <SyntaxHighlighter {...props} style={oneDark} language={match[1]} PreTag="div">
                      {String(children).replace(/\n$/, "")}
                    </SyntaxHighlighter>
                  ) : (
                    <code {...props} className={className}>
                      {children}
                    </code>
                  );
                },
              }}
            >
              {post.content}
            </ReactMarkdown>
          </div>
        </div>
      )}
    </motion.div>
  );
}
