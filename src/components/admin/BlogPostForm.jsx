/* eslint-disable no-unused-vars */
import { useState, useEffect } from "react";
import TextareaAutosize from "react-textarea-autosize";
import { motion } from "framer-motion";
import { DocumentTextIcon, PencilIcon, ClockIcon } from "@heroicons/react/24/outline";

export default function BlogPostForm({ post, isEditing, onSubmit, onChange }) {
  const [textStats, setTextStats] = useState({ words: 0, chars: 0, readingTime: 0, paragraphs: 0 });
  const [formTouched, setFormTouched] = useState(false);

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

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }} className="max-w-4xl mx-auto p-4">
      <form onSubmit={onSubmit} className="space-y-6 bg-base-200 rounded-xl p-6">
        {/* Header */}
        <div className="border-b border-base-300 pb-4">
          <h2 className="text-xl font-bold text-primary flex items-center gap-2">
            <DocumentTextIcon className="w-5 h-5" />
            {isEditing ? "Edit Post" : "Create New Post"}
          </h2>
        </div>

        {/* Title */}
        <div>
          <label className="block text-sm font-medium mb-2">Title</label>
          <input type="text" value={post.title} onChange={(e) => onChange({ ...post, title: e.target.value })} className="input input-bordered w-full bg-base-100" placeholder="Enter post title" required />
        </div>

        {/* Content */}
        <div>
          <label className="block text-sm font-medium mb-2">Content</label>
          <TextareaAutosize value={post.content} onChange={(e) => onChange({ ...post, content: e.target.value })} className="textarea textarea-bordered w-full min-h-[300px] bg-base-100 font-mono text-sm" placeholder="Write your post content..." required />
          {post.content && (
            <div className="flex gap-4 mt-2 text-sm text-base-content/60">
              <span>{textStats.words} words</span>
              <span>{textStats.readingTime} min read</span>
              <span>{textStats.paragraphs} paragraphs</span>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3 pt-4 border-t border-base-300">
          <button type="button" onClick={handleClear} className="btn btn-ghost" disabled={!formTouched}>
            Cancel
          </button>
          <button type="submit" className="btn btn-primary">
            {isEditing ? "Update Post" : "Create Post"}
          </button>
        </div>
      </form>
    </motion.div>
  );
}
