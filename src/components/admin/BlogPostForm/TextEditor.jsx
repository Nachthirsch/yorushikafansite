import React, { useState, useEffect } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

export default function TextEditor({ value, onChange, placeholder }) {
  const modules = {
    toolbar: [["bold", "italic", "underline", "strike"], [{ header: 1 }, { header: 2 }], ["clean"]],
  };

  const formats = ["header", "bold", "italic", "underline", "strike"];

  return <ReactQuill theme="snow" value={value || ""} onChange={onChange} modules={modules} formats={formats} placeholder={placeholder} className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-xl border border-neutral-300 dark:border-neutral-600 min-h-[150px]" />;
}
