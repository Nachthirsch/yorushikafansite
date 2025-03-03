import React from "react";
import { BookOpenIcon, ArrowPathIcon } from "@heroicons/react/24/outline";
import { AnimatePresence } from "framer-motion";
import BlogPostItem from "./BlogPostItem";
import SortButtons from "../common/SortButtons";
import FilterInput from "../common/FilterInput";

export default function BlogPostsPanel({ posts, postSort, setPostSort, postFilter, setPostFilter, onEdit, onDelete, onRefresh, children }) {
  const sortOptions = [
    { value: "newest", label: "Newest" },
    { value: "oldest", label: "Oldest" },
    { value: "alphabetical", label: "A-Z" },
  ];

  const sortedPosts = [...posts]
    .sort((a, b) => {
      if (postSort === "newest") return new Date(b.created_at) - new Date(a.created_at);
      if (postSort === "oldest") return new Date(a.created_at) - new Date(b.created_at);
      if (postSort === "alphabetical") return a.title.localeCompare(b.title);
      return 0;
    })
    .filter((post) => (postFilter ? post.title.toLowerCase().includes(postFilter.toLowerCase()) : true));

  return (
    <div className="p-8 lg:p-10">
      <div className="grid grid-cols-1 xl:grid-cols-2 2xl:grid-cols-3 gap-8 lg:gap-12">
        {/* Form Section */}
        <div className="xl:col-span-1">
          <div className="bg-white dark:bg-gray-800/90 rounded-xl shadow-md hover:shadow-lg transition-all duration-200">
            <div className="p-6">{children}</div>
          </div>
        </div>

        {/* Posts List Section */}
        <div className="xl:col-span-1 2xl:col-span-2 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
              <BookOpenIcon className="w-5 h-5 text-blue-500" />
              Published Posts
            </h3>
            <div className="flex flex-wrap items-center gap-2">
              <SortButtons options={sortOptions} currentSort={postSort} onSortChange={setPostSort} />
              <button onClick={onRefresh} className="p-2 text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700">
                <ArrowPathIcon className="w-5 h-5" />
              </button>
              <div className="px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-sm font-medium">{posts.length}</div>
            </div>
          </div>

          <FilterInput value={postFilter} onChange={setPostFilter} placeholder="Search posts..." />

          <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600">
            <AnimatePresence>
              {sortedPosts.map((post, index) => (
                <BlogPostItem key={post.id} post={post} index={index} onEdit={onEdit} onDelete={onDelete} />
              ))}
              {sortedPosts.length === 0 && (
                <div className="text-center py-10">
                  <p className="text-gray-500 dark:text-gray-400">No posts found</p>
                  <p className="text-sm text-gray-400 dark:text-gray-500">{postFilter ? "Try a different search term" : "Create your first post"}</p>
                </div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
