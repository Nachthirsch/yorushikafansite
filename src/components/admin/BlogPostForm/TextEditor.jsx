import React, { useEffect } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import TextAlign from "@tiptap/extension-text-align";
import Placeholder from "@tiptap/extension-placeholder";
import HardBreak from "@tiptap/extension-hard-break";
import { Extension } from "@tiptap/core";
import { Bold, Italic, Underline as UnderlineIcon, Strikethrough, AlignLeft, AlignCenter, AlignRight, Heading1, Heading2, Quote, ListOrdered, List, Undo, Redo } from "lucide-react";

/**
 * Extension kustom untuk mengubah perilaku Enter
 * Dengan ini, ketika menekan Enter, TipTap akan membuat line break daripada paragraf baru
 */
const EnterHandler = Extension.create({
  name: "enterHandler",

  // Menambahkan keymap kustom untuk mengubah perilaku Enter
  addKeyboardShortcuts() {
    return {
      Enter: () => {
        // Jika dalam list atau blockquote, biarkan perilaku default
        if (this.editor.isActive("bulletList") || this.editor.isActive("orderedList") || this.editor.isActive("blockquote")) {
          return false;
        }

        // Tambahkan hard break (line break) dan return true untuk mencegah perilaku default
        this.editor.commands.setHardBreak();
        return true;
      },
    };
  },
});

/**
 * Text Editor komponen menggunakan TipTap dengan desain minimalis
 * Menyediakan berbagai opsi pemformatan dengan UI yang elegan
 * Konfigurasi khusus untuk menangani baris baru dengan lebih baik
 */
export default function TextEditor({ value, onChange, placeholder }) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        paragraph: {
          HTMLAttributes: {
            class: "custom-paragraph",
          },
        },
      }),
      Underline,
      TextAlign.configure({
        types: ["heading", "paragraph"],
        alignments: ["left", "center", "right"],
      }),
      Placeholder.configure({
        placeholder: placeholder || "Mulai menulis konten Anda di sini...",
      }),
      // Konfigurasi khusus untuk hard breaks
      HardBreak.configure({
        HTMLAttributes: {
          class: "line-break",
        },
        keepMarks: true,
      }),
      // Tambahkan extension kustom untuk handling Enter
      EnterHandler,
    ],
    content: value || "",
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  // Memperbarui konten editor ketika value berubah dari luar
  useEffect(() => {
    if (editor && value !== editor.getHTML()) {
      editor.commands.setContent(value || "");
    }
  }, [value, editor]);

  if (!editor) {
    return null;
  }

  /// Kumpulan tombol formatting dengan desain artistik minimalis
  const MenuButton = ({ onClick, isActive, icon, tooltip }) => (
    <button
      type="button"
      onClick={onClick}
      className={`p-2 rounded-lg transition-all duration-200 relative
        ${isActive ? "bg-neutral-200 dark:bg-neutral-700 shadow-inner" : "hover:bg-neutral-100 dark:hover:bg-neutral-800"}`}
      title={tooltip}
    >
      {/* Elemen dekoratif di pojok tombol aktif */}
      {isActive && <div className="absolute top-0 left-0 w-1.5 h-1.5 border-l border-t border-neutral-400 dark:border-neutral-500"></div>}
      {icon}
    </button>
  );

  return (
    <div className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-xl border border-neutral-300 dark:border-neutral-600 overflow-hidden transition-all duration-200 focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-transparent relative">
      {/* Menu bar dengan desain artistik minimalis */}
      <div className="border-b border-neutral-200 dark:border-neutral-700 p-2 bg-neutral-50 dark:bg-neutral-900 flex flex-wrap gap-1">
        {/* Grup format teks */}
        <div className="flex items-center mr-2 space-x-1 py-1">
          <MenuButton onClick={() => editor.chain().focus().toggleBold().run()} isActive={editor.isActive("bold")} icon={<Bold className="w-4 h-4" />} tooltip="Bold (Ctrl+B)" />
          <MenuButton onClick={() => editor.chain().focus().toggleItalic().run()} isActive={editor.isActive("italic")} icon={<Italic className="w-4 h-4" />} tooltip="Italic (Ctrl+I)" />
          <MenuButton onClick={() => editor.chain().focus().toggleUnderline().run()} isActive={editor.isActive("underline")} icon={<UnderlineIcon className="w-4 h-4" />} tooltip="Underline (Ctrl+U)" />
          <MenuButton onClick={() => editor.chain().focus().toggleStrike().run()} isActive={editor.isActive("strike")} icon={<Strikethrough className="w-4 h-4" />} tooltip="Strikethrough" />
        </div>

        {/* Elemen pembatas vertikal dengan desain minimalis */}
        <div className="h-8 w-px bg-neutral-200 dark:bg-neutral-700 mx-1"></div>

        {/* Grup heading */}
        <div className="flex items-center mr-2 space-x-1 py-1">
          <MenuButton onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()} isActive={editor.isActive("heading", { level: 1 })} icon={<Heading1 className="w-4 h-4" />} tooltip="Heading 1" />
          <MenuButton onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} isActive={editor.isActive("heading", { level: 2 })} icon={<Heading2 className="w-4 h-4" />} tooltip="Heading 2" />
        </div>

        {/* Elemen pembatas vertikal */}
        <div className="h-8 w-px bg-neutral-200 dark:bg-neutral-700 mx-1"></div>

        {/* Grup alignment */}
        <div className="flex items-center mr-2 space-x-1 py-1">
          <MenuButton onClick={() => editor.chain().focus().setTextAlign("left").run()} isActive={editor.isActive({ textAlign: "left" })} icon={<AlignLeft className="w-4 h-4" />} tooltip="Align Left" />
          <MenuButton onClick={() => editor.chain().focus().setTextAlign("center").run()} isActive={editor.isActive({ textAlign: "center" })} icon={<AlignCenter className="w-4 h-4" />} tooltip="Align Center" />
          <MenuButton onClick={() => editor.chain().focus().setTextAlign("right").run()} isActive={editor.isActive({ textAlign: "right" })} icon={<AlignRight className="w-4 h-4" />} tooltip="Align Right" />
        </div>

        {/* Elemen pembatas vertikal */}
        <div className="h-8 w-px bg-neutral-200 dark:bg-neutral-700 mx-1"></div>

        {/* Grup list */}
        <div className="flex items-center mr-2 space-x-1 py-1">
          <MenuButton onClick={() => editor.chain().focus().toggleBulletList().run()} isActive={editor.isActive("bulletList")} icon={<List className="w-4 h-4" />} tooltip="Bullet List" />
          <MenuButton onClick={() => editor.chain().focus().toggleOrderedList().run()} isActive={editor.isActive("orderedList")} icon={<ListOrdered className="w-4 h-4" />} tooltip="Ordered List" />
        </div>

        {/* Elemen pembatas vertikal */}
        <div className="h-8 w-px bg-neutral-200 dark:bg-neutral-700 mx-1"></div>

        {/* Grup blockquote */}
        <div className="flex items-center mr-2 space-x-1 py-1">
          <MenuButton onClick={() => editor.chain().focus().toggleBlockquote().run()} isActive={editor.isActive("blockquote")} icon={<Quote className="w-4 h-4" />} tooltip="Blockquote" />
        </div>

        {/* Elemen pembatas vertikal */}
        <div className="h-8 w-px bg-neutral-200 dark:bg-neutral-700 mx-1"></div>

        {/* Grup undo/redo */}
        <div className="flex items-center ml-auto space-x-1 py-1">
          <MenuButton onClick={() => editor.chain().focus().undo().run()} isActive={false} icon={<Undo className="w-4 h-4" />} tooltip="Undo (Ctrl+Z)" />
          <MenuButton onClick={() => editor.chain().focus().redo().run()} isActive={false} icon={<Redo className="w-4 h-4" />} tooltip="Redo (Ctrl+Y)" />
        </div>
      </div>

      {/* Editor content dengan styling khusus */}
      <EditorContent editor={editor} className="prose prose-neutral dark:prose-invert max-w-none p-4 min-h-[200px]" />

      {/* Editor info - menampilkan bantuan untuk baris baru */}
      <div className="text-xs text-neutral-500 dark:text-neutral-400 p-2 border-t border-neutral-200 dark:border-neutral-700 flex items-center">
        <span>Tekan Enter untuk baris baru, Shift+Enter untuk paragraf baru</span>
      </div>

      {/* Dekoratif elemen di sudut */}
      <div className="absolute top-0 left-0 w-3 h-3 border-l border-t border-neutral-300 dark:border-neutral-600"></div>
      <div className="absolute bottom-0 right-0 w-3 h-3 border-r border-b border-neutral-300 dark:border-neutral-600"></div>
    </div>
  );
}
