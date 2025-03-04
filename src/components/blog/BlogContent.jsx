import React from "react";

/**
 * Renders blog post content blocks properly
 */
export const BlogContent = ({ content }) => {
  // If content is not provided or empty
  if (!content || content.length === 0) {
    return <p className="text-gray-500 italic">No content available</p>;
  }

  // Ensure content is an array
  const contentArray = Array.isArray(content) ? content : [content];

  return (
    <div className="blog-content space-y-4">
      {contentArray.map((block, index) => {
        // Handle different types of content blocks
        if (typeof block === "string") {
          return <p key={index}>{block}</p>;
        }

        // Handle object blocks based on their type
        if (block && typeof block === "object") {
          // Text blocks
          if (block.type === "text") {
            return <p key={index}>{block.value || ""}</p>;
          }

          // Image blocks
          if (block.type === "image") {
            return (
              <div key={index} className="my-4">
                <img
                  src={block.url || ""}
                  alt="Blog content"
                  className="max-w-full rounded-lg"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "https://placehold.co/600x400?text=Image+Not+Found";
                  }}
                />
              </div>
            );
          }

          // Unknown block type - convert to string representation
          return <p key={index}>{JSON.stringify(block)}</p>;
        }

        // Fallback for null or undefined blocks
        return <p key={index}></p>;
      })}
    </div>
  );
};

export default BlogContent;
