"use client";

import { useState } from "react";
import { Volume2, Mic, Copy, Share2 } from "lucide-react";

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
  title,
  text,
  footer,
  orange = false,
  isInput = false,
  onTextChange,
  placeholder = "Type your text here...",
  onCopy,
}: TranslationCardProps) {
  const [inputText, setInputText] = useState(text || "");
  const [showToast, setShowToast] = useState(false);

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newText = e.target.value;
    setInputText(newText);
    onTextChange?.(newText);
  };

  // const handleCopy = async () => {
  //   const textToCopy = isInput ? inputText : text || "";

  //   if (!textToCopy.trim()) return;

  //   try {
  //     await navigator.clipboard.writeText(textToCopy);
  //     setShowToast(true);
  //     setTimeout(() => setShowToast(false), 2000);
  //   } catch (error) {
  //     console.error("Failed to copy text:", error);
  //   }
  // };

  const handleCopy = async () => {
    const textToCopy = isInput ? inputText : text || "";

    if (!textToCopy.trim()) return;

    try {
      await navigator.clipboard.writeText(textToCopy);
      onCopy?.(); // Call the parent's toast function
    } catch (error) {
      console.error("Failed to copy text:", error);
    }
  };

  return (
    <>
      <div className="bg-white rounded-2xl border border-[#b9ced5] p-6 space-y-4">
        <h3 className="font-semibold text-gray-800">{title}</h3>

        {isInput ? (
          <textarea
            value={inputText}
            onChange={handleTextChange}
            placeholder={placeholder}
            className="w-full h-32 p-4 border border-[#b9ced5] rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
          />
        ) : (
          <div className="min-h-[128px] p-4 bg-gray-50 rounded-lg">
            <p className="text-gray-700 leading-relaxed">{text}</p>
          </div>
        )}

        <div className="flex justify-between items-center mt-6">
          <button className="flex items-center gap-2 px-3 py-1 border border-gray-300 rounded-lg hover:border-orange-500 hover:text-orange-500 transition-colors">
            <Mic size={16} />
            <span className="text-sm">Listen</span>
          </button>

          {footer && <span className="text-xs text-black">{footer}</span>}

          <button
            onClick={handleCopy}
            className="flex items-center gap-2 px-3 py-1 border border-gray-300 rounded-lg hover:border-orange-500 hover:text-orange-500 transition-colors"
            title="Copy text"
          >
            <Copy size={16} />
            <span className="text-sm">Copy text</span>
          </button>
        </div>
      </div>

      {/* Toast Notification */}
      {showToast && (
        <div className="fixed top-4 right-4 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg z-50 animate-fade-in">
          Text copied successfully!
        </div>
      )}
    </>
  );
}
