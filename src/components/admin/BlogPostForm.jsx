/* eslint-disable no-unused-vars */
import { useState, useEffect } from "react";
import TextareaAutosize from "react-textarea-autosize";
import { motion } from "framer-motion";

export default function BlogPostForm({ post, isEditing, onSubmit, onChange }) {
  const [wordCount, setWordCount] = useState(0);

  useEffect(() => {
    if (post?.content) {
      setWordCount(post.content.trim().split(/\s+/).length);
    } else {
      setWordCount(0);
    }
  }, [post?.content]);

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
      <form onSubmit={onSubmit} className="card bg-base-100 shadow-xl overflow-hidden">
        <div className="bg-primary/10 p-4">
          <h3 className="text-xl font-bold text-primary">{isEditing ? "Edit Blog Post" : "Create New Blog Post"}</h3>
          <p className="text-sm text-base-content/70">{isEditing ? "Update your existing post" : "Share news, updates, or announcements"}</p>
        </div>

        <div className="card-body gap-6">
          <div className="form-control">
            <label className="label">
              <span className="label-text font-medium">Post Title</span>
            </label>
            <input type="text" value={post.title} onChange={(e) => onChange({ ...post, title: e.target.value })} className="input input-bordered focus:input-primary" placeholder="Enter post title" required />
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text font-medium">Content</span>
              <span className="label-text-alt">{wordCount} words</span>
            </label>
            <TextareaAutosize value={post.content} onChange={(e) => onChange({ ...post, content: e.target.value })} placeholder="Write your blog post content here..." className="textarea textarea-bordered focus:textarea-primary min-h-[300px] leading-relaxed" required />
          </div>

          <div className="card-actions justify-end mt-2">
            <button type="button" onClick={() => onChange({ title: "", content: "" })} className="btn btn-ghost">
              Clear
            </button>
            <button type="submit" className="btn btn-primary">
              {isEditing ? "Update Post" : "Create Post"}
            </button>
          </div>
        </div>
      </form>
    </motion.div>
  );
}
