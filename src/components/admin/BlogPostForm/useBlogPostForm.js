import { useEffect, useState } from "react";

export default function useBlogPostForm({ post, onChange, onSubmit }) {
  const [localPost, setLocalPost] = useState(
    post || {
      title: "",
      content: [],
      published: true, // Changed from false to true
      publish_date: "",
      author_name: "",
      author_social_link: "",
    }
  );
  const [currentImageUrl, setCurrentImageUrl] = useState("");
  const [showImageInput, setShowImageInput] = useState(false);

  useEffect(() => {
    if (post) {
      let formattedContent;

      if (Array.isArray(post.content)) {
        formattedContent = post.content;
      } else if (typeof post.content === "object" && post.content !== null) {
        formattedContent = [{ type: "text", value: JSON.stringify(post.content) }];
      } else if (post.content) {
        formattedContent = [{ type: "text", value: String(post.content) }];
      } else {
        formattedContent = [];
      }

      setLocalPost({
        ...post,
        content: formattedContent,
      });
    }
  }, [post]);

  const handleChange = (field, value) => {
    const updatedPost = { ...localPost, [field]: value };
    setLocalPost(updatedPost);
    onChange?.(updatedPost);
  };

  const handleAddImage = () => {
    if (!currentImageUrl.trim()) return;

    const contentBlocks = [...(Array.isArray(localPost.content) ? localPost.content : []), { type: "image", url: currentImageUrl, title: "" }];

    const updatedPost = { ...localPost, content: contentBlocks };
    setLocalPost(updatedPost);
    onChange?.(updatedPost);
    setCurrentImageUrl("");
    setShowImageInput(false);
  };

  const handleRemoveBlock = (index) => {
    if (!Array.isArray(localPost.content)) return;

    const updatedBlocks = [...localPost.content];
    updatedBlocks.splice(index, 1);

    const updatedPost = { ...localPost, content: updatedBlocks };
    setLocalPost(updatedPost);
    onChange?.(updatedPost);
  };

  const handleUpdateBlock = (index, field, value, format, selection = null) => {
    if (!Array.isArray(localPost.content)) return;

    const updatedBlocks = [...localPost.content];

    if (field === "title") {
      updatedBlocks[index] = { ...updatedBlocks[index], title: value };
    } else if (updatedBlocks[index].type === "text") {
      if (format && selection) {
        // Selection-level formatting
        const { selectionStart, selectionEnd } = selection;

        // Create a fresh copy to avoid mutation issues
        const existingSelections = Array.isArray(updatedBlocks[index].format?.selections) ? [...updatedBlocks[index].format.selections] : [];

        // Remove any overlapping selections to avoid conflicts
        const filteredSelections = existingSelections.filter((sel) => sel.end <= selectionStart || sel.start >= selectionEnd);

        // Add the new selection
        const newSelections = [
          ...filteredSelections,
          {
            start: selectionStart,
            end: selectionEnd,
            ...format,
          },
        ];

        updatedBlocks[index] = {
          ...updatedBlocks[index],
          value,
          format: {
            ...(updatedBlocks[index].format || {}),
            selections: newSelections,
          },
        };

        console.log("Applied format to selection", {
          selectionStart,
          selectionEnd,
          text: value.substring(selectionStart, selectionEnd),
          format,
        });
      } else if (format) {
        // Block-level formatting
        updatedBlocks[index] = {
          ...updatedBlocks[index],
          value,
          format: {
            ...(updatedBlocks[index].format || {}),
            ...format,
          },
        };
      } else {
        // Just updating value
        updatedBlocks[index] = { ...updatedBlocks[index], value };
      }
    } else if (updatedBlocks[index].type === "image") {
      updatedBlocks[index] = { ...updatedBlocks[index], url: value };
    }

    const updatedPost = { ...localPost, content: updatedBlocks };
    setLocalPost(updatedPost);
    onChange?.(updatedPost);
  };

  const handleAddTextBlock = () => {
    const contentBlocks = [
      ...(Array.isArray(localPost.content) ? localPost.content : []),
      {
        type: "text",
        value: "",
        title: "",
        format: {
          bold: false,
          italic: false,
          underline: false,
          fontSize: "normal",
          selections: [],
        },
      },
    ];

    const updatedPost = { ...localPost, content: contentBlocks };
    setLocalPost(updatedPost);
    onChange?.(updatedPost);
  };

  const handleAddTextBlockAt = (index, position = "above") => {
    if (!Array.isArray(localPost.content)) return;

    const insertIndex = position === "above" ? index : index + 1;
    const updatedBlocks = [...localPost.content];
    updatedBlocks.splice(insertIndex, 0, {
      type: "text",
      value: "",
      title: "",
      format: {
        bold: false,
        italic: false,
        underline: false,
        fontSize: "normal",
        selections: [],
      },
    });

    const updatedPost = { ...localPost, content: updatedBlocks };
    setLocalPost(updatedPost);
    onChange?.(updatedPost);
  };

  const handleAddImageBlockAt = (index, position = "above") => {
    if (!currentImageUrl.trim()) return;

    const insertIndex = position === "above" ? index : index + 1;
    const updatedBlocks = [...localPost.content];
    updatedBlocks.splice(insertIndex, 0, { type: "image", url: currentImageUrl, title: "" });

    const updatedPost = { ...localPost, content: updatedBlocks };
    setLocalPost(updatedPost);
    onChange?.(updatedPost);
    setCurrentImageUrl("");
    setShowImageInput(false);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    try {
      const formData = {
        ...localPost,
        published: true, // Memastikan published selalu true
        author_name: localPost.author_name?.trim() || "",
        author_social_link: localPost.author_social_link?.trim() || "",
      };

      await onSubmit(formData);
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  const toggleImageInput = (show) => {
    setShowImageInput(show);
    if (!show) setCurrentImageUrl("");
  };

  return {
    localPost,
    currentImageUrl,
    showImageInput,
    setCurrentImageUrl,
    handleChange,
    handleAddImage,
    handleRemoveBlock,
    handleUpdateBlock,
    handleAddTextBlock,
    handleFormSubmit,
    toggleImageInput,
    handleAddTextBlockAt,
    handleAddImageBlockAt,
  };
}
