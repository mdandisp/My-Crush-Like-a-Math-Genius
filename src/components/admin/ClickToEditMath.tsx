import { useState, useRef, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";

interface ClickToEditMathProps {
  value: string;
  onChange: (val: string) => void;
  disabled?: boolean;
  placeholder?: string;
  style?: React.CSSProperties;
  autoFormatKatex?: boolean; // If true, replaces $$ with $ or wraps in $ $
}

export default function ClickToEditMath({
  value,
  onChange,
  disabled = false,
  placeholder = "Ketik di sini...",
  style,
  autoFormatKatex = false,
}: ClickToEditMathProps) {
  const [isEditing, setIsEditing] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (isEditing && textareaRef.current) {
      textareaRef.current.focus();
      // Move cursor to the end
      const length = textareaRef.current.value.length;
      textareaRef.current.setSelectionRange(length, length);
    }
  }, [isEditing]);

  const handleBlur = () => {
    setIsEditing(false);
  };

  const formattedValue = () => {
    if (!value) return "";
    let val = value.replace(/\\\\/g, "\\"); // handle double backslash first
    if (autoFormatKatex) {
      // If it's an option that has no $, wrap it in $ $.
      // If it has $$, replace with $
      if (val.includes("$$")) {
        return val.replace(/\$\$/g, "$");
      }
      if (!val.includes("$")) {
        return `$${val}$`;
      }
    }
    return val.replace(/\$\$/g, "$");
  };

  if (isEditing && !disabled) {
    return (
      <div style={{ width: "100%", display: "flex", flexDirection: "column", gap: "8px", ...style }}>
        <textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onBlur={handleBlur}
          disabled={disabled}
          placeholder={placeholder}
          style={{
            width: "100%",
            flex: 1,
            padding: "16px",
            backgroundColor: "rgba(0,0,0,0.5)",
            border: "2px solid #3b82f6",
            color: "white",
            outline: "none",
            resize: "none",
            boxShadow: "0 0 10px rgba(59, 130, 246, 0.5)",
            borderRadius: "8px",
          }}
        />
        <div style={{ fontSize: "0.8rem", color: "#60a5fa", fontStyle: "italic", textAlign: "left" }}>
          💡 Tip: Gunakan 2 backslash (\\) agar format matematika tersimpan dengan benar (contoh: \\int, \\frac&#123;a&#125;&#123;b&#125;, \\lim)
        </div>
      </div>
    );
  }

  return (
    <div
      onClick={() => {
        if (!disabled) setIsEditing(true);
      }}
      style={{
        ...style,
        width: "100%",
        padding: "16px",
        backgroundColor: "rgba(0,0,0,0.3)",
        border: "1px solid rgba(255,255,255,0.2)",
        borderRadius: "8px",
        color: value ? "white" : "#a0a5b5",
        cursor: disabled ? "not-allowed" : "text",
        overflowY: "auto",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
      }}
      title={disabled ? "" : "Klik untuk mengedit"}
    >
      {value ? (
        <ReactMarkdown
          remarkPlugins={[remarkMath]}
          rehypePlugins={[rehypeKatex]}
        >
          {formattedValue()}
        </ReactMarkdown>
      ) : (
        <span>{placeholder}</span>
      )}
    </div>
  );
}
