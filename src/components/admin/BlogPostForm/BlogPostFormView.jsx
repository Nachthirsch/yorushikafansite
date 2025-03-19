import { useState, useRef, useEffect } from "react";
import { PlusCircle, X, ChevronUp, ChevronDown, Image, Type, CornerDownRight } from "lucide-react";
import TextEditor from "./TextEditor";

export default function BlogPostFormView({ localPost, currentImageUrl, showImageInput, isEditing, onCancel, setCurrentImageUrl, handleChange, handleAddImage, handleRemoveBlock, handleUpdateBlock, handleAddTextBlock, handleFormSubmit, toggleImageInput, handleAddTextBlockAt, handleAddImageBlockAt, getTextFromHtml }) {
  const [expandedBlocks, setExpandedBlocks] = useState({});

  /// Toggle blok yang diperluas untuk tampilan yang lebih bersih
  const toggleBlockExpansion = (index) => {
    setExpandedBlocks((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  /// Render konten blok berdasarkan tipe (teks atau gambar)
  const renderContentBlocks = () => {
    const contentArray = Array.isArray(localPost.content) ? localPost.content : [];

    return (
      <div className="space-y-6">
        {contentArray.map((block, index) => (
          <div key={index} className={`group relative transition-all duration-300 ${expandedBlocks[index] ? "shadow-lg" : "hover:shadow-md"} rounded-xl border border-neutral-200 dark:border-neutral-700 overflow-hidden`}>
            {/* Header blok dengan tombol kontrol */}
            <div className="flex items-center justify-between px-4 py-3 bg-neutral-50 dark:bg-neutral-800 border-b border-neutral-200 dark:border-neutral-700">
              <div className="flex items-center space-x-2">
                {/* Ikon tipe blok */}
                <span className="p-1.5 rounded-md bg-white dark:bg-neutral-700 border border-neutral-200 dark:border-neutral-600">
                  {/* Icon Type dari Lucide React untuk blok teks */}
                  {block.type === "text" && <Type className="w-4 h-4 text-neutral-600 dark:text-neutral-300" />}
                  {/* Icon Image dari Lucide React untuk blok gambar */}
                  {block.type === "image" && <Image className="w-4 h-4 text-neutral-600 dark:text-neutral-300" />}
                </span>

                <span className="text-sm font-medium">
                  {block.type === "text" ? "Text Block" : "Image Block"}
                  <span className="text-xs text-neutral-500 dark:text-neutral-400 ml-2">#{index + 1}</span>
                </span>
              </div>

              <div className="flex items-center space-x-1">
                {/* Tombol toggle ekspansi */}
                <button type="button" onClick={() => toggleBlockExpansion(index)} className="p-1 text-neutral-500 hover:text-neutral-700 dark:text-neutral-400 dark:hover:text-neutral-200" title={expandedBlocks[index] ? "Collapse block" : "Expand block"}>
                  {/* Icon ChevronUp atau ChevronDown dari Lucide React untuk toggle ekspansi */}
                  {expandedBlocks[index] ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </button>

                {/* Tombol hapus blok */}
                <button type="button" onClick={() => handleRemoveBlock(index)} className="p-1 text-neutral-400 hover:text-red-500 dark:text-neutral-500 dark:hover:text-red-400 transition-colors" title="Remove block">
                  {/* Icon X dari Lucide React untuk menghapus blok */}
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Konten blok (hanya ditampilkan jika diperluas) */}
            <div className={`p-4 bg-white dark:bg-neutral-900 ${expandedBlocks[index] ? "" : "hidden"}`}>
              {/* Optional Title Input untuk semua tipe blok */}
              <div className="mb-4">
                <label className="block mb-1 text-sm font-medium text-neutral-700 dark:text-neutral-300">Block Title (optional)</label>
                <input
                  type="text"
                  value={block.title || ""}
                  onChange={(e) => handleUpdateBlock(index, "title", e.target.value)}
                  className="w-full px-3 py-2 text-sm rounded-lg border border-neutral-300 dark:border-neutral-600 
                    bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white 
                    focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Add a title for this block..."
                />
              </div>

              {block.type === "text" ? (
                <div>
                  {/* Menggunakan TipTap Text Editor untuk blok teks */}
                  <label className="block mb-2 text-sm font-medium text-neutral-700 dark:text-neutral-300">Content</label>
                  <div className="relative">
                    <TextEditor value={block.value || ""} onChange={(html) => handleUpdateBlock(index, "value", html)} placeholder="Write your content here..." />

                    {/* Indikator panjang teks */}
                    <div className="mt-2 text-right text-xs text-neutral-500 dark:text-neutral-400">{getTextFromHtml(block.value || "").length} characters</div>
                  </div>
                </div>
              ) : block.type === "image" ? (
                <div className="space-y-4">
                  <div>
                    <label className="block mb-1 text-sm font-medium text-neutral-700 dark:text-neutral-300">Image URL</label>
                    <div className="relative">
                      <input
                        type="text"
                        value={block.url || ""}
                        onChange={(e) => handleUpdateBlock(index, "value", e.target.value)}
                        className="w-full pl-3 pr-10 py-2 text-sm rounded-lg border border-neutral-300 dark:border-neutral-600 
                          bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white
                          focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Paste image URL here..."
                      />
                      <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                        {/* Icon Image dari Lucide React sebagai indikator bidang gambar */}
                        <Image className="w-4 h-4 text-neutral-400" />
                      </div>
                    </div>
                  </div>

                  {/* Preview gambar */}
                  {block.url && (
                    <div className="mt-3">
                      <label className="block mb-1 text-sm font-medium text-neutral-700 dark:text-neutral-300">Preview</label>
                      <div className="relative bg-neutral-100 dark:bg-neutral-800 rounded-lg overflow-hidden p-2">
                        {/* Elemen dekoratif di sudut */}
                        <div className="absolute top-0 left-0 w-3 h-3 border-l border-t border-neutral-300 dark:border-neutral-600"></div>
                        <div className="absolute bottom-0 right-0 w-3 h-3 border-r border-b border-neutral-300 dark:border-neutral-600"></div>

                        <img
                          src={block.url}
                          alt="Preview"
                          className="max-w-full h-auto max-h-[200px] mx-auto object-contain"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = "https://placehold.co/600x400?text=Image+Not+Found";
                          }}
                        />
                      </div>
                    </div>
                  )}
                </div>
              ) : null}

              {/* Tombol untuk menambahkan blok baru di atas atau di bawah blok ini */}
              <div className="mt-4 pt-3 border-t border-neutral-200 dark:border-neutral-800 flex justify-between">
                <div className="flex space-x-2">
                  <button
                    type="button"
                    onClick={() => handleAddTextBlockAt(index)}
                    className="flex items-center px-3 py-1 text-xs rounded-md
                      bg-green-50 hover:bg-green-100 text-green-700
                      dark:bg-green-900/20 dark:hover:bg-green-900/30 dark:text-green-400
                      transition-colors"
                  >
                    {/* Icon Type dan ChevronUp dari Lucide React untuk tombol tambah teks di atas */}
                    <Type className="w-3 h-3 mr-1" />
                    <ChevronUp className="w-3 h-3" />
                  </button>

                  <button
                    type="button"
                    onClick={() => handleAddTextBlockAt(index, "below")}
                    className="flex items-center px-3 py-1 text-xs rounded-md
                      bg-green-50 hover:bg-green-100 text-green-700
                      dark:bg-green-900/20 dark:hover:bg-green-900/30 dark:text-green-400
                      transition-colors"
                  >
                    {/* Icon Type dan ChevronDown dari Lucide React untuk tombol tambah teks di bawah */}
                    <Type className="w-3 h-3 mr-1" />
                    <ChevronDown className="w-3 h-3" />
                  </button>
                </div>

                {/* Indikator tipe blok */}
                <div className="text-xs text-neutral-500 dark:text-neutral-400 italic">{block.type === "text" ? "Text Block" : "Image Block"}</div>
              </div>
            </div>

            {/* Tampilan pratinjau saat blok tidak diperluas */}
            {!expandedBlocks[index] && (
              <div className="px-4 py-2 bg-white dark:bg-neutral-900 border-t border-neutral-200 dark:border-neutral-700 text-sm text-neutral-600 dark:text-neutral-400 truncate">
                {block.type === "text" ? (
                  <div className="flex items-center">
                    {/* Icon CornerDownRight dari Lucide React untuk indikasi pratinjau */}
                    <CornerDownRight className="w-3 h-3 mr-2 text-neutral-400" />
                    {getTextFromHtml(block.value || "").slice(0, 60)}
                    {getTextFromHtml(block.value || "").length > 60 ? "..." : ""}
                  </div>
                ) : (
                  <div className="flex items-center">
                    {/* Icon Image dari Lucide React untuk blok gambar */}
                    <Image className="w-3 h-3 mr-2 text-neutral-400" />
                    {block.title || block.url || "Image without URL"}
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    );
  };

  return (
    <form onSubmit={handleFormSubmit} className="max-w-4xl mx-auto space-y-8 p-6">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-neutral-900 dark:text-white mb-2">{isEditing ? "Edit Blog Post" : "Create New Blog Post"}</h1>
        <p className="text-neutral-600 dark:text-neutral-400">{isEditing ? "Update your existing blog post" : "Share your thoughts with the world"}</p>
      </div>

      <div className="space-y-6">
        {/* Judul Post */}
        <div className="group">
          <label className="block mb-2 font-medium text-neutral-700 dark:text-neutral-300">Post Title</label>
          <input
            type="text"
            value={localPost.title}
            onChange={(e) => handleChange("title", e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-neutral-300 dark:border-neutral-600 
              bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white 
              focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 
              group-hover:border-neutral-400 dark:group-hover:border-neutral-500"
            placeholder="Enter an engaging title..."
            required
          />
        </div>

        {/* Informasi translator */}
        <div className="grid md:grid-cols-2 gap-6">
          <div className="group">
            <label className="block mb-2 font-medium text-neutral-700 dark:text-neutral-300">Translator Name</label>
            <input
              type="text"
              value={localPost.author_name}
              onChange={(e) => handleChange("author_name", e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-neutral-300 dark:border-neutral-600 
                bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white 
                focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 
                group-hover:border-neutral-400 dark:group-hover:border-neutral-500"
              placeholder="Your name"
            />
          </div>
          <div className="group">
            <label className="block mb-2 font-medium text-neutral-700 dark:text-neutral-300">Social Link</label>
            <input
              type="url"
              value={localPost.author_social_link}
              onChange={(e) => handleChange("author_social_link", e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-neutral-300 dark:border-neutral-600 
                bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white 
                focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 
                group-hover:border-neutral-400 dark:group-hover:border-neutral-500"
              placeholder="https://twitter.com/username"
            />
          </div>
        </div>

        {/* Konten Blok */}
        <div>
          <div className="flex justify-between items-center mb-4">
            <label className="font-medium text-neutral-700 dark:text-neutral-300">Content Blocks</label>
            <span className="text-sm text-neutral-500 dark:text-neutral-400">{Array.isArray(localPost.content) ? localPost.content.length : 0} block(s)</span>
          </div>

          {renderContentBlocks()}

          {/* Tombol untuk menambahkan blok baru */}
          <div className="flex flex-col sm:flex-row gap-4 mt-6">
            {/* Tombol tambah blok teks */}
            <button
              type="button"
              onClick={handleAddTextBlock}
              className="flex-1 px-6 py-3 rounded-xl text-sm font-medium 
                bg-green-50 hover:bg-green-100 dark:bg-green-900/20 dark:hover:bg-green-900/30 
                text-green-700 dark:text-green-400 transition-all duration-200 
                focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 dark:focus:ring-offset-neutral-800
                flex items-center justify-center space-x-2"
            >
              {/* Icon PlusCircle dan Type dari Lucide React untuk tombol tambah teks */}
              <PlusCircle className="w-4 h-4" />
              <Type className="w-4 h-4" />
              <span>Add Text Block</span>
            </button>

            {/* Input URL gambar atau tombol untuk menampilkan input */}
            {showImageInput ? (
              <div className="flex-1 flex gap-2">
                <input
                  type="text"
                  value={currentImageUrl}
                  onChange={(e) => setCurrentImageUrl(e.target.value)}
                  className="flex-1 px-4 py-3 rounded-xl border border-neutral-300 dark:border-neutral-600 
                    bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white 
                    focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  placeholder="Paste image URL..."
                />
                <button
                  type="button"
                  onClick={handleAddImage}
                  className="px-4 py-2 rounded-xl text-sm font-medium 
                    bg-blue-50 hover:bg-blue-100 dark:bg-blue-900/20 dark:hover:bg-blue-900/30 
                    text-blue-700 dark:text-blue-400 transition-all duration-200"
                >
                  Add
                </button>
                <button
                  type="button"
                  onClick={() => toggleImageInput(false)}
                  className="px-4 py-2 rounded-xl text-sm font-medium 
                    bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-700 dark:hover:bg-neutral-600 
                    text-neutral-700 dark:text-neutral-300 transition-all duration-200"
                >
                  Cancel
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => toggleImageInput(true)}
                className="flex-1 px-6 py-3 rounded-xl text-sm font-medium 
                  bg-purple-50 hover:bg-purple-100 dark:bg-purple-900/20 dark:hover:bg-purple-900/30 
                  text-purple-700 dark:text-purple-400 transition-all duration-200 
                  focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 dark:focus:ring-offset-neutral-800
                  flex items-center justify-center space-x-2"
              >
                {/* Icon PlusCircle dan Image dari Lucide React untuk tombol tambah gambar */}
                <PlusCircle className="w-4 h-4" />
                <Image className="w-4 h-4" />
                <span>Add Image</span>
              </button>
            )}
          </div>
        </div>

        {/* Tombol aksi */}
        <div className="flex justify-end gap-4 pt-6 border-t border-neutral-200 dark:border-neutral-700">
          <button
            type="button"
            onClick={onCancel}
            className="px-6 py-3 rounded-xl text-sm font-medium 
              bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-700 dark:hover:bg-neutral-600 
              text-neutral-700 dark:text-neutral-300 transition-all duration-200 
              focus:outline-none focus:ring-2 focus:ring-neutral-500 focus:ring-offset-2 dark:focus:ring-offset-neutral-800"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-6 py-3 rounded-xl text-sm font-medium 
              bg-blue-600 hover:bg-blue-700 text-white transition-all duration-200 
              focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-neutral-800"
          >
            {isEditing ? "Update Post" : "Create Post"}
          </button>
        </div>
      </div>
    </form>
  );
}
