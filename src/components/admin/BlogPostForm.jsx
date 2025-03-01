/* eslint-disable no-unused-vars */
import { useState, useEffect } from "react";
import TextareaAutosize from "react-textarea-autosize";
import { motion } from "framer-motion";
import { DocumentTextIcon, PencilIcon, DocumentIcon, ClockIcon, LanguageIcon, XMarkIcon } from "@heroicons/react/24/outline";

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
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }} className="h-full">
      <form onSubmit={onSubmit} className="card bg-base-100 shadow-xl overflow-hidden border border-base-200 h-full">
        <div className="bg-gradient-to-r from-primary/10 to-primary/5 p-5 border-b border-base-200">
          <h3 className="text-xl font-bold text-primary flex items-center gap-2">
            {isEditing ? (
              <>
                <PencilIcon className="w-5 h-5" />
                Edit Blog Post
              </>
            ) : (
              <>
                <DocumentTextIcon className="w-5 h-5" />
                Create New Blog Post
              </>
            )}
          </h3>
          <p className="text-sm text-base-content/70 mt-1">{isEditing ? "Update your existing post" : "Share news, updates, or announcements"}</p>
        </div>

        <div className="card-body gap-6 p-6">
          <div className="form-control">
            <label htmlFor="post-title" className="label">
              <span className="label-text font-medium">Post Title</span>
            </label>
            <div className="relative">
              <input id="post-title" type="text" value={post.title} onChange={(e) => onChange({ ...post, title: e.target.value })} className="input input-bordered focus:input-primary w-full pl-10 border-base-300 bg-base-100/50" placeholder="Enter post title" required aria-label="Post title" />
              <DocumentIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-primary/60" />
            </div>
          </div>

          <div className="form-control">
            <label htmlFor="post-content" className="label">
              <span className="label-text font-medium">Content</span>
              {post.content && (
                <div className="flex flex-wrap gap-2">
                  <div className="flex items-center gap-1 bg-base-200 px-2 py-1 rounded-full text-xs font-medium">
                    <LanguageIcon className="w-3 h-3 text-primary/70" />
                    <span>{textStats.words} words</span>
                  </div>
                  <div className="flex items-center gap-1 bg-base-200 px-2 py-1 rounded-full text-xs font-medium">
                    <DocumentTextIcon className="w-3 h-3 text-primary/70" />
                    <span>{textStats.paragraphs} paragraphs</span>
                  </div>
                  <div className="flex items-center gap-1 bg-base-200 px-2 py-1 rounded-full text-xs font-medium">
                    <ClockIcon className="w-3 h-3 text-primary/70" />
                    <span>~{textStats.readingTime} min read</span>
                  </div>
                </div>
              )}
            </label>
            <div className="relative">
              <div className="absolute left-3 top-3 opacity-70">
                <PencilIcon className="w-5 h-5 text-primary/60" />
              </div>
              <TextareaAutosize id="post-content" value={post.content} onChange={(e) => onChange({ ...post, content: e.target.value })} placeholder="Write your blog post content here..." className="textarea textarea-bordered focus:textarea-primary min-h-[300px] leading-relaxed w-full pl-10 border-base-300 bg-base-100/50" required aria-label="Post content" />
            </div>
            <div className="flex items-center gap-2 mt-2 text-xs text-base-content/60">
              <DocumentTextIcon className="w-4 h-4" />
              <p>Format your post with clear paragraphs for better readability. Use double line breaks to separate paragraphs.</p>
            </div>
          </div>

          <div className="divider my-2"></div>

          <div className="card-actions justify-end mt-4">
            <button type="button" onClick={handleClear} className="btn btn-ghost hover:bg-base-200" disabled={!formTouched} aria-label="Clear form">
              Clear
            </button>
            <button type="submit" className="btn btn-primary" aria-label={isEditing ? "Update post" : "Create post"}>
              {isEditing ? "Update Post" : "Create Post"}
            </button>
          </div>
        </div>
      </form>
    </motion.div>
  );
}
