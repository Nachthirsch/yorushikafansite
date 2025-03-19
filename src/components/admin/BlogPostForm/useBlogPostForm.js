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

  /// Memproses konten saat inisialisasi atau saat post berubah
  /// Sekarang menangani konten HTML dari editor TipTap
  useEffect(() => {
    if (post) {
      let formattedContent;

      if (Array.isArray(post.content)) {
        // Pastikan setiap blok teks memiliki properti format yang benar
        // untuk mendukung konten HTML dari TipTap
        formattedContent = post.content.map((block) => {
          if (block.type === "text") {
            return {
              ...block,
              // Format struktur tetap ada untuk backward compatibility
              format: block.format || {
                bold: false,
                italic: false,
                underline: false,
                lineThrough: false,
                fontSize: "normal",
                selections: [],
              },
            };
          }
          return block;
        });
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

  /// Menangani pembaruan blok - sekarang mendukung HTML dari TipTap
  const handleUpdateBlock = (index, field, value, format, selection = null) => {
    if (!Array.isArray(localPost.content)) return;

    const updatedBlocks = [...localPost.content];

    if (field === "title") {
      updatedBlocks[index] = { ...updatedBlocks[index], title: value };
    } else if (updatedBlocks[index].type === "text") {
      // Untuk blok teks, simpan nilai HTML langsung dari TipTap
      // tetapi juga pertahankan objek format untuk backward compatibility
      updatedBlocks[index] = {
        ...updatedBlocks[index],
        value,
        // Format struktur tetap ada, tapi konten HTML utama ada di value
        format: updatedBlocks[index].format || {
          bold: false,
          italic: false,
          underline: false,
          lineThrough: false,
          fontSize: "normal",
          selections: [],
        },
      };
    } else if (updatedBlocks[index].type === "image") {
      updatedBlocks[index] = { ...updatedBlocks[index], url: value };
    }

    const updatedPost = { ...localPost, content: updatedBlocks };
    setLocalPost(updatedPost);
    onChange?.(updatedPost);
  };

  /// Menambahkan blok teks baru dengan nilai default yang kosong
  /// Sekarang mendukung HTML dari TipTap
  const handleAddTextBlock = () => {
    const contentBlocks = [
      ...(Array.isArray(localPost.content) ? localPost.content : []),
      {
        type: "text",
        value: "", // Akan berisi HTML dari TipTap
        title: "",
        format: {
          bold: false,
          italic: false,
          underline: false,
          lineThrough: false,
          fontSize: "normal",
          selections: [],
        },
      },
    ];

    const updatedPost = { ...localPost, content: contentBlocks };
    setLocalPost(updatedPost);
    onChange?.(updatedPost);
  };

  /// Menambahkan blok teks pada posisi tertentu
  const handleAddTextBlockAt = (index, position = "above") => {
    if (!Array.isArray(localPost.content)) return;

    const insertIndex = position === "above" ? index : index + 1;
    const updatedBlocks = [...localPost.content];
    updatedBlocks.splice(insertIndex, 0, {
      type: "text",
      value: "", // Akan berisi HTML dari TipTap
      title: "",
      format: {
        bold: false,
        italic: false,
        underline: false,
        lineThrough: false,
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

  /// Fungsi baru untuk ekstraksi teks murni dari HTML untuk preview atau keperluan lain
  const getTextFromHtml = (html) => {
    if (!html) return "";
    // Membuat element DOM sementara untuk ekstraksi teks dari HTML
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = html;
    return tempDiv.textContent || tempDiv.innerText || "";
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
    getTextFromHtml, // Fungsi bantuan baru
  };
}
