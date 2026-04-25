"use client";

import { useState } from "react";
import { Mic, Copy } from "lucide-react";

interface TranslationCardProps {
  title: string;
  text?: string;
  footer?: string;
  isInput?: boolean;
  onTextChange?: (text: string) => void;
  placeholder?: string;
  orange?: boolean;
  onCopy?: () => void;
}

export default function TranslationCard({
  title, text, footer, orange = false, isInput = false,
  onTextChange, placeholder = "Type your text here...", onCopy,
}: TranslationCardProps) {
  const [inputText, setInputText] = useState(text || "");

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newText = e.target.value;
    setInputText(newText);
    onTextChange?.(newText);
  };

  const handleCopy = async () => {
    const textToCopy = isInput ? inputText : text || "";
    if (!textToCopy.trim()) return;
    try {
      await navigator.clipboard.writeText(textToCopy);
      onCopy?.();
    } catch (error) {
      console.error("Failed to copy text:", error);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl border border-[#b9ced5] dark:border-gray-700 p-6 space-y-4">
      <h3 className="font-semibold text-gray-800 dark:text-white">{title}</h3>

      <textarea
        value={isInput ? inputText : text}
        onChange={handleTextChange}
        placeholder={placeholder}
        className="w-full h-32 p-4 border border-[#b9ced5] dark:border-gray-600 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500"
      />

      <div className="flex justify-between items-center mt-6">
        <button className="flex items-center gap-2 px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-lg hover:border-orange-500 hover:text-orange-500 dark:text-gray-400 dark:hover:border-orange-500 dark:hover:text-orange-400 transition-colors">
          <Mic size={16} />
          <span className="text-sm">Listen</span>
        </button>

        {footer && <span className="text-xs text-black dark:text-gray-300">{footer}</span>}

        <button
          onClick={handleCopy}
          className="flex items-center gap-2 px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-lg hover:border-orange-500 hover:text-orange-500 dark:text-gray-400 dark:hover:border-orange-500 dark:hover:text-orange-400 transition-colors"
          title="Copy text"
        >
          <Copy size={16} />
          <span className="text-sm">Copy text</span>
        </button>
      </div>
    </div>
  );
}
