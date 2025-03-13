import { useState, useRef, useEffect } from "react";

export default function BlogPostFormView({ localPost, currentImageUrl, showImageInput, isEditing, onCancel, setCurrentImageUrl, handleChange, handleAddImage, handleRemoveBlock, handleUpdateBlock, handleAddTextBlock, handleFormSubmit, toggleImageInput, handleAddTextBlockAt, handleAddImageBlockAt }) {
  const [selection, setSelection] = useState({});
  const textareaRefs = useRef({});

  // Fungsi yang diperbarui untuk menangani seleksi teks dengan lebih baik
  const handleTextSelection = (index) => {
    const textarea = textareaRefs.current[index];
    if (!textarea) return;

    const selectionStart = textarea.selectionStart;
    const selectionEnd = textarea.selectionEnd;

    if (selectionStart !== selectionEnd) {
      setSelection({
        index,
        start: selectionStart,
        end: selectionEnd,
        text: textarea.value.substring(selectionStart, selectionEnd),
      });
    }
  };

  // Fungsi untuk menerapkan format ke teks yang diseleksi
  const applyFormatting = (index, formatType, formatValue) => {
    const textarea = textareaRefs.current[index];
    if (!textarea) return;

    const selectionStart = textarea.selectionStart;
    const selectionEnd = textarea.selectionEnd;
    const hasSelection = selectionStart !== selectionEnd;
    const currentValue = textarea.value;

    // Format yang akan diterapkan
    const format = { [formatType]: formatValue };

    if (hasSelection) {
      // Jika ada seleksi teks, format hanya teks yang diseleksi
      handleUpdateBlock(index, "value", currentValue, format, { selectionStart, selectionEnd });

      // Pertahankan seleksi setelah format diterapkan
      setTimeout(() => {
        if (textareaRefs.current[index]) {
          textareaRefs.current[index].focus();
          textareaRefs.current[index].setSelectionRange(selectionStart, selectionEnd);
        }
      }, 50);
    } else {
      // Jika tidak ada seleksi, format seluruh blok
      // Untuk toggle format seperti bold/italic/underline
      if (formatType === "bold" || formatType === "italic" || formatType === "underline" || formatType === "lineThrough") {
        const currentFormatValue = localPost.content[index].format?.[formatType];
        format[formatType] = !currentFormatValue;
      }
      handleUpdateBlock(index, "value", currentValue, format);
    }
  };

  // Gunakan useEffect untuk memantau perubahan seleksi
  useEffect(() => {
    const handleSelectionChange = () => {
      const activeIndex = Object.keys(textareaRefs.current).find((index) => textareaRefs.current[index] === document.activeElement);

      if (activeIndex) {
        handleTextSelection(parseInt(activeIndex));
      }
    };

    document.addEventListener("selectionchange", handleSelectionChange);
    return () => document.removeEventListener("selectionchange", handleSelectionChange);
  }, []);

  const renderContentBlocks = () => {
    const contentArray = Array.isArray(localPost.content) ? localPost.content : [];

    return (
      <div className="space-y-6">
        {contentArray.map((block, index) => (
          <div key={index} className="group relative transition-all duration-300 hover:shadow-lg rounded-xl p-4 border border-gray-200 dark:border-gray-700">
            {/* Block insertion buttons */}
            <div className="absolute -left-12 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 flex flex-col gap-2">
              <button type="button" onClick={() => handleAddTextBlockAt(index)} className="p-2 bg-green-500 text-white rounded-full hover:bg-green-600" title="Add text block above">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                </svg>
              </button>
              <button type="button" onClick={() => handleAddTextBlockAt(index, "below")} className="p-2 bg-green-500 text-white rounded-full hover:bg-green-600" title="Add text block below">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
            </div>

            {/* Optional Title Input for all block types */}
            <div className="mb-3">
              <input type="text" value={block.title || ""} onChange={(e) => handleUpdateBlock(index, "title", e.target.value)} className="w-full px-4 py-2 text-sm rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent" placeholder="Optional block title..." />
            </div>

            {block.type === "text" ? (
              <div className="space-y-2">
                {/* Formatting toolbar */}
                <div className="flex flex-wrap items-center gap-2 pb-2 bg-gray-50 dark:bg-gray-800 p-2 rounded-lg">
                  {/* Bold button */}
                  <button type="button" onClick={() => applyFormatting(index, "bold", true)} className={`p-2 rounded ${block.format?.bold ? "bg-neutral-300 dark:bg-neutral-600" : "bg-white dark:bg-neutral-800 hover:bg-neutral-100 dark:hover:bg-neutral-700"}`} title="Bold (Select text first to apply formatting)">
                    <span className="font-bold">B</span>
                  </button>

                  {/* Italic button */}
                  <button type="button" onClick={() => applyFormatting(index, "italic", true)} className={`p-2 rounded ${block.format?.italic ? "bg-neutral-300 dark:bg-neutral-600" : "bg-white dark:bg-neutral-800 hover:bg-neutral-100 dark:hover:bg-neutral-700"}`} title="Italic (Select text first to apply formatting)">
                    <span className="italic">I</span>
                  </button>

                  {/* Underline button */}
                  <button type="button" onClick={() => applyFormatting(index, "underline", true)} className={`p-2 rounded ${block.format?.underline ? "bg-neutral-300 dark:bg-neutral-600" : "bg-white dark:bg-neutral-800 hover:bg-neutral-100 dark:hover:bg-neutral-700"}`} title="Underline (Select text first to apply formatting)">
                    <span className="underline">U</span>
                  </button>

                  {/* Linethrough button */}
                  <button type="button" onClick={() => applyFormatting(index, "lineThrough", true)} className={`p-2 rounded ${block.format?.lineThrough ? "bg-neutral-300 dark:bg-neutral-600" : "bg-white dark:bg-neutral-800 hover:bg-neutral-100 dark:hover:bg-neutral-700"}`} title="Linethrough (Select text first to apply formatting)">
                    <span className="line-through">S</span>
                  </button>

                  {/* Divider */}
                  <div className="h-6 w-px bg-gray-300 dark:bg-gray-600 mx-1"></div>

                  {/* Font size selector */}
                  <div className="flex items-center">
                    <select value={selection.index === index && selection.start !== selection.end ? "selection" : block.format?.fontSize || "normal"} onChange={(e) => applyFormatting(index, "fontSize", e.target.value)} className="px-2 py-1 text-sm rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-1 focus:ring-blue-500">
                      <option value="selection" disabled={!(selection.index === index && selection.start !== selection.end)}>
                        {selection.index === index && selection.start !== selection.end ? "Format Selection..." : "Size"}
                      </option>
                      <option value="normal">Normal</option>
                      <option value="large">Large</option>
                      <option value="larger">Larger</option>
                      <option value="largest">Largest</option>
                    </select>
                  </div>

                  {/* Selection info */}
                  {selection.index === index && selection.start !== selection.end && <span className="ml-auto text-xs text-gray-500 dark:text-gray-400 italic px-2">{selection.text?.length} characters selected</span>}
                </div>

                {/* Text area */}
                <div className="relative">
                  <textarea
                    ref={(el) => (textareaRefs.current[index] = el)}
                    value={block.value || ""}
                    onChange={(e) => handleUpdateBlock(index, "value", e.target.value)}
                    onClick={() => handleTextSelection(index)}
                    onKeyUp={() => handleTextSelection(index)}
                    onMouseUp={() => handleTextSelection(index)}
                    className="w-full px-4 py-3 rounded-xl border border-neutral-300 
                      dark:border-neutral-600 bg-white dark:bg-gray-800 
                      text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 
                      focus:border-transparent transition-all duration-200 
                      min-h-[120px] resize-y"
                    placeholder="Write your content here..."
                    style={{
                      fontWeight: block.format?.bold ? "bold" : "normal",
                      fontStyle: block.format?.italic ? "italic" : "normal",
                      textDecoration: block.format?.underline ? "underline" : block.format?.lineThrough ? "line-through" : block.format?.underline && block.format?.lineThrough ? "underline line-through" : "none",
                      fontSize: block.format?.fontSize === "large" ? "1.125rem" : block.format?.fontSize === "larger" ? "1.25rem" : block.format?.fontSize === "largest" ? "1.5rem" : "1rem",
                    }}
                  />
                  <div className="absolute bottom-3 right-3 text-sm text-gray-500">{(block.value || "").length} characters</div>
                </div>
              </div>
            ) : block.type === "image" ? (
              <div className="space-y-3">
                <div className="relative">
                  <input type="text" value={block.url} onChange={(e) => handleUpdateBlock(index, "value", e.target.value)} className="w-full px-4 py-2 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200" placeholder="Paste image URL here..." aria-label={`Image URL for block ${index + 1}`} />
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                </div>
                {block.url && (
                  <div className="relative rounded-xl overflow-hidden bg-gray-100 dark:bg-gray-700">
                    <img
                      src={block.url}
                      alt="Preview"
                      className="w-full h-60 object-cover transition-opacity duration-200"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "https://placehold.co/600x400?text=Image+Not+Found";
                      }}
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-10 transition-all duration-200" />
                  </div>
                )}
              </div>
            ) : null}

            {/* Remove button */}
            <button type="button" onClick={() => handleRemoveBlock(index)} className="absolute -top-2 -right-2 opacity-0 group-hover:opacity-100 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600 transition-all duration-200 transform hover:scale-110" title="Remove block" aria-label="Remove block">
              ×
            </button>
          </div>
        ))}
      </div>
    );
  };

  return (
    <form onSubmit={handleFormSubmit} className="max-w-4xl mx-auto space-y-8 p-6">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">{isEditing ? "Edit Blog Post" : "Create New Blog Post"}</h1>
        <p className="text-gray-600 dark:text-gray-400">{isEditing ? "Update your existing blog post" : "Share your thoughts with the world"}</p>
      </div>

      <div className="space-y-6">
        <div className="group">
          <label className="block mb-2 font-medium text-gray-700 dark:text-gray-300">Post Title</label>
          <input type="text" value={localPost.title} onChange={(e) => handleChange("title", e.target.value)} className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 group-hover:border-gray-400 dark:group-hover:border-gray-500" placeholder="Enter an engaging title..." required />
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="group">
            <label className="block mb-2 font-medium text-gray-700 dark:text-gray-300">Author Name</label>
            <input type="text" value={localPost.author_name} onChange={(e) => handleChange("author_name", e.target.value)} className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 group-hover:border-gray-400 dark:group-hover:border-gray-500" placeholder="Your name" />
          </div>
          <div className="group">
            <label className="block mb-2 font-medium text-gray-700 dark:text-gray-300">Social Link</label>
            <input type="url" value={localPost.author_social_link} onChange={(e) => handleChange("author_social_link", e.target.value)} className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 group-hover:border-gray-400 dark:group-hover:border-gray-500" placeholder="https://twitter.com/username" />
          </div>
        </div>

        <div>
          <label className="block mb-4 font-medium text-gray-700 dark:text-gray-300">Content Blocks</label>
          {renderContentBlocks()}

          <div className="flex flex-col sm:flex-row gap-4 mt-6">
            <button type="button" onClick={handleAddTextBlock} className="flex-1 px-6 py-3 rounded-xl text-sm font-medium bg-green-50 hover:bg-green-100 dark:bg-green-900/20 dark:hover:bg-green-900/30 text-green-700 dark:text-green-400 transition-all duration-200 transform hover:scale-102 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800">
              <span className="flex items-center justify-center">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                Add Text Block
              </span>
            </button>

            {showImageInput ? (
              <div className="flex-1 flex gap-2">
                <input type="text" value={currentImageUrl} onChange={(e) => setCurrentImageUrl(e.target.value)} className="flex-1 px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200" placeholder="Paste image URL..." />
                <button type="button" onClick={handleAddImage} className="px-4 py-2 rounded-xl text-sm font-medium bg-blue-50 hover:bg-blue-100 dark:bg-blue-900/20 dark:hover:bg-blue-900/30 text-blue-700 dark:text-blue-400 transition-all duration-200">
                  Add
                </button>
                <button type="button" onClick={() => toggleImageInput(false)} className="px-4 py-2 rounded-xl text-sm font-medium bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 transition-all duration-200">
                  Cancel
                </button>
              </div>
            ) : (
              <button type="button" onClick={() => toggleImageInput(true)} className="flex-1 px-6 py-3 rounded-xl text-sm font-medium bg-purple-50 hover:bg-purple-100 dark:bg-purple-900/20 dark:hover:bg-purple-900/30 text-purple-700 dark:text-purple-400 transition-all duration-200 transform hover:scale-102 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800">
                <span className="flex items-center justify-center">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  Add Image
                </span>
              </button>
            )}
          </div>
        </div>

        <div className="flex justify-end gap-4 pt-6 border-t border-gray-200 dark:border-gray-700">
          <button type="button" onClick={onCancel} className="px-6 py-3 rounded-xl text-sm font-medium bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800">
            Cancel
          </button>
          <button type="submit" className="px-6 py-3 rounded-xl text-sm font-medium bg-blue-600 hover:bg-blue-700 text-white transition-all duration-200 transform hover:scale-102 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800">
            {isEditing ? "Update Post" : "Create Post"}
          </button>
        </div>
      </div>
    </form>
  );
}
