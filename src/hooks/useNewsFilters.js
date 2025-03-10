import { useState, useMemo, useCallback } from "react";

const DATE_RANGES = [
  { label: "All Time", value: "all" },
  { label: "This Month", value: "month" },
  { label: "This Year", value: "year" },
  { label: "Last Year", value: "lastYear" },
];

export const useNewsFilters = (posts = []) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [dateFilter, setDateFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [viewMode, setViewMode] = useState("grid");

  const applyDateFilter = useCallback(
    (post) => {
      const postDate = new Date(post.publish_date);
      const now = new Date();

      switch (dateFilter) {
        case "month":
          return postDate.getMonth() === now.getMonth() && postDate.getFullYear() === now.getFullYear();
        case "year":
          return postDate.getFullYear() === now.getFullYear();
        case "lastYear":
          return postDate.getFullYear() === now.getFullYear() - 1;
        default:
          return true;
      }
    },
    [dateFilter]
  );

  const filteredPosts = useMemo(() => {
    return posts.filter((post) => {
      const matchesSearch = post.title?.toLowerCase().includes(searchTerm.toLowerCase()) || post.content?.some((block) => block.type === "text" && block.value.toLowerCase().includes(searchTerm.toLowerCase()));
      const matchesCategory = categoryFilter === "all" || post.category === categoryFilter;
      const matchesDate = applyDateFilter(post);

      return matchesSearch && matchesCategory && matchesDate;
    });
  }, [posts, searchTerm, categoryFilter, applyDateFilter]);

  const categories = useMemo(() => ["all", ...new Set(posts.map((post) => post.category || "Uncategorized"))], [posts]);

  const resetFilters = useCallback(() => {
    setSearchTerm("");
    setDateFilter("all");
    setCategoryFilter("all");
  }, []);

  return {
    filters: {
      searchTerm,
      dateFilter,
      categoryFilter,
      viewMode,
    },
    setters: {
      setSearchTerm,
      setDateFilter,
      setCategoryFilter,
      setViewMode,
    },
    filteredPosts,
    categories,
    resetFilters,
    dateRanges: DATE_RANGES,
  };
};
