/* eslint-disable no-unused-vars */
import React from "react";
import LoadingSpinner from "../components/LoadingSpinner";
import { motion } from "framer-motion";
import { useNewsFilters } from "../hooks/useNewsFilters";
import NewsHeader from "../components/news/NewsHeader";
import NewsFilters from "../components/news/NewsFilters";
import { NewsCardList } from "../components/news/NewsCard";

// Extract BlogPostContent as a memoized component
const BlogPostContent = React.memo(({ content }) => {
  if (!content) return null;

  // Parse content if it's a string
  let contentBlocks = content;
  if (typeof content === "string") {
    try {
      contentBlocks = JSON.parse(content);
    } catch (e) {
      contentBlocks = [{ type: "text", value: content }];
    }
  }

  // Ensure contentBlocks is an array
  if (!Array.isArray(contentBlocks)) {
    contentBlocks = [{ type: "text", value: String(content) }];
  }

  return (
    <div className="space-y-4">
      {contentBlocks.map((block, index) => {
        if (block.type === "text") {
          return (
            <div key={index}>
              {block.title && <h4 className="text-lg font-medium text-neutral-800 dark:text-neutral-200 mb-2">{block.title}</h4>}
              <p className="text-neutral-600 dark:text-neutral-300 line-clamp-3">{block.value}</p>
            </div>
          );
        } else if (block.type === "image") {
          return (
            <div key={index}>
              {block.title && <h4 className="text-lg font-medium text-neutral-800 dark:text-neutral-200 mb-2">{block.title}</h4>}
              <img src={block.url} alt={block.title || ""} className="w-full h-40 object-cover rounded-md" loading="lazy" />
            </div>
          );
        }
        return null;
      })}
    </div>
  );
});

export default function NewsPage() {
  // Filter tetap dikelola di NewsPage
  const { filters, setters, categories, resetFilters, dateRanges } = useNewsFilters([]);

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950 relative overflow-hidden">
      <NewsHeader />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
        <NewsFilters filters={filters} setters={setters} categories={categories} dateRanges={dateRanges} resetFilters={resetFilters} />
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
        {/* NewsCardList akan menangani loading, error, dan rendering daftar berita */}
        <NewsCardList filters={filters} resetFilters={resetFilters} viewMode={filters.viewMode} />
      </div>
    </div>
  );
}
