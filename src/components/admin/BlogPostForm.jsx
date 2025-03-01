import TextareaAutosize from "react-textarea-autosize";

export default function BlogPostForm({ post, isEditing, onSubmit, onChange }) {
  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
          Post Title
        </label>
        <input id="title" type="text" value={post.title} onChange={(e) => onChange({ ...post, title: e.target.value })} placeholder="Enter post title" className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all" required />
      </div>

      <div>
        <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-1">
          Content
        </label>
        <TextareaAutosize id="content" value={post.content} onChange={(e) => onChange({ ...post, content: e.target.value })} placeholder="Write your post content here..." className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all min-h-[200px]" required />
      </div>

      <div className="flex justify-end">
        <button type="submit" className="px-6 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors">
          {isEditing ? "Update Post" : "Publish Post"}
        </button>
      </div>
    </form>
  );
}
