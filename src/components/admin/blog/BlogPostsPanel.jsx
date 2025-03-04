import React, { useState, useMemo } from "react";
import { format } from "date-fns";
import { PencilIcon, TrashIcon, ArrowPathIcon } from "@heroicons/react/24/outline";
import BlogContent from "../../blog/BlogContent";

export default function BlogPostsPanel({ posts = [], postSort = { field: "created_at", direction: "desc" }, setPostSort, postFilter = "", setPostFilter, onEdit, onDelete, onRefresh, children }) {
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await onRefresh();
    setIsRefreshing(false);
  };

  // Filter and sort posts
  const filteredPosts = useMemo(() => {
    let result = [...posts];

    // Filter
    if (postFilter) {
      const lowerFilter = postFilter.toLowerCase();
      result = result.filter((post) => post.title?.toLowerCase().includes(lowerFilter));
    }

    // Sort
    result.sort((a, b) => {
      const fieldA = a[postSort.field];
      const fieldB = b[postSort.field];

      if (fieldA < fieldB) return postSort.direction === "asc" ? -1 : 1;
      if (fieldA > fieldB) return postSort.direction === "asc" ? 1 : -1;
      return 0;
    });

    return result;
  }, [posts, postFilter, postSort]);

  return (
    <div className="p-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Form Section */}
        <div>{children}</div>

        {/* Posts List Section */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Blog Posts ({filteredPosts.length})</h3>

            <div className="flex items-center gap-2">
              <button onClick={handleRefresh} className={`p-2 rounded-full bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 ${isRefreshing ? "animate-spin" : ""}`} disabled={isRefreshing}>
                <ArrowPathIcon className="w-5 h-5" />
              </button>

              <input type="text" value={postFilter} onChange={(e) => setPostFilter(e.target.value)} placeholder="Filter posts..." className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-700 dark:text-white" />
            </div>
          </div>

          <div className="space-y-4">
            {filteredPosts.length > 0 ? (
              filteredPosts.map((post) => (
                <div key={post.id} className="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700 overflow-hidden">
                  <div className="p-4">
                    <div className="flex justify-between items-start">
                      <h4 className="text-lg font-medium text-gray-900 dark:text-white">{post.title}</h4>
                      <div className="flex gap-1">
                        <button onClick={() => onEdit(post)} className="p-1.5 rounded-full bg-blue-100 hover:bg-blue-200 dark:bg-blue-900/30 dark:hover:bg-blue-800/50 text-blue-600 dark:text-blue-400">
                          <PencilIcon className="w-4 h-4" />
                        </button>
                        <button onClick={() => onDelete(post)} className="p-1.5 rounded-full bg-red-100 hover:bg-red-200 dark:bg-red-900/30 dark:hover:bg-red-800/50 text-red-600 dark:text-red-400">
                          <TrashIcon className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      Created: {format(new Date(post.created_at), "MMM d, yyyy")}
                      {post.published ? <span className="ml-2 px-2 py-0.5 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-full text-xs">Published</span> : <span className="ml-2 px-2 py-0.5 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 rounded-full text-xs">Draft</span>}
                    </div>

                    <div className="mt-3 border-t border-gray-200 dark:border-gray-700 pt-3 max-h-40 overflow-y-auto">
                      <BlogContent content={post.content} />
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-12 text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-dashed border-gray-300 dark:border-gray-700">{postFilter ? "No posts match your filter." : "No blog posts found. Create your first post!"}</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
