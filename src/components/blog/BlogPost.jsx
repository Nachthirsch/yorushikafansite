import React from "react";
import { format } from "date-fns";
import BlogContent from "./BlogContent";

export default function BlogPost({ post }) {
  if (!post) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Post not found</p>
      </div>
    );
  }

  return (
    <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <header className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">{post.title}</h1>

        <div className="flex items-center text-gray-600 dark:text-gray-400 text-sm">
          <time dateTime={post.publish_date || post.created_at}>{format(new Date(post.publish_date || post.created_at), "MMMM d, yyyy")}</time>
        </div>
      </header>

      <div className="prose prose-lg dark:prose-invert max-w-none">
        <BlogContent content={post.content} />
      </div>
    </article>
  );
}
