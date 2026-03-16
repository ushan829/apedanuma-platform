"use client";

import dynamic from "next/dynamic";
import "react-quill-new/dist/quill.snow.css";

// Use dynamic import to avoid SSR issues with Quill
const ReactQuill = dynamic(() => import("react-quill-new"), {
  ssr: false,
  loading: () => (
    <div 
      className="w-full h-[150px] animate-pulse rounded-xl"
      style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)" }}
    />
  ),
});

interface RichTextEditorProps {
  value: string;
  onChange: (content: string) => void;
  placeholder?: string;
  disabled?: boolean;
}

export default function RichTextEditor({ value, onChange, placeholder, disabled }: RichTextEditorProps) {
  const modules = {
    toolbar: [
      [{ header: [1, 2, 3, false] }],
      ["bold", "italic", "underline", "strike"],
      [{ list: "ordered" }, { list: "bullet" }],
      ["link", "clean"],
    ],
  };

  const formats = [
    "header",
    "bold",
    "italic",
    "underline",
    "strike",
    "list",
    "bullet",
    "link",
  ];

  return (
    <div className="rich-text-editor">
      <style jsx global>{`
        .rich-text-editor .ql-toolbar {
          background: rgba(255, 255, 255, 0.05) !important;
          border: 1px solid rgba(255, 255, 255, 0.1) !important;
          border-top-left-radius: 0.75rem;
          border-top-right-radius: 0.75rem;
          padding: 8px 12px !important;
        }
        .rich-text-editor .ql-container {
          background: rgba(255, 255, 255, 0.02) !important;
          border: 1px solid rgba(255, 255, 255, 0.1) !important;
          border-top: none !important;
          border-bottom-left-radius: 0.75rem;
          border-bottom-right-radius: 0.75rem;
          font-family: inherit !important;
          font-size: 0.875rem !important;
          min-height: 150px;
        }
        .rich-text-editor .ql-editor {
          min-height: 150px;
          color: var(--foreground);
          line-height: 1.6;
        }
        .rich-text-editor .ql-editor.ql-blank::before {
          color: var(--foreground-disabled) !important;
          font-style: normal !important;
          font-size: 0.875rem !important;
        }
        .rich-text-editor .ql-snow.ql-toolbar button {
          color: var(--foreground-secondary) !important;
        }
        .rich-text-editor .ql-snow.ql-toolbar button:hover,
        .rich-text-editor .ql-snow.ql-toolbar button.ql-active {
          color: #f59e0b !important;
        }
        .rich-text-editor .ql-snow.ql-toolbar button:hover .ql-stroke,
        .rich-text-editor .ql-snow.ql-toolbar button.ql-active .ql-stroke {
          stroke: #f59e0b !important;
        }
        .rich-text-editor .ql-snow.ql-toolbar button:hover .ql-fill,
        .rich-text-editor .ql-snow.ql-toolbar button.ql-active .ql-fill {
          fill: #f59e0b !important;
        }
        .rich-text-editor .ql-snow .ql-stroke {
          stroke: var(--foreground-muted) !important;
        }
        .rich-text-editor .ql-snow .ql-fill {
          fill: var(--foreground-muted) !important;
          stroke: none !important;
        }
        .rich-text-editor .ql-snow .ql-picker {
          color: var(--foreground-muted) !important;
        }
        .rich-text-editor .ql-snow .ql-picker-options {
          background-color: #111 !important;
          border: 1px solid rgba(255, 255, 255, 0.1) !important;
        }
      `}</style>
      <ReactQuill
        theme="snow"
        value={value}
        onChange={onChange}
        modules={modules}
        formats={formats}
        placeholder={placeholder}
        readOnly={disabled}
      />
    </div>
  );
}
