"use client";

import { useState } from "react";
import { Volume2, Mic, Copy, Share2, Heart } from "lucide-react";

interface TranslationCardProps {
  title: string;
  text?: string;
  footer?: string;
  isInput?: boolean;
  onTextChange?: (text: string) => void;
  placeholder?: string;
  orange?: boolean;
}

export default function TranslationCard({
  title,
  text,
  footer,
  orange = false,
  isInput = false,
  onTextChange,
  placeholder = "Type your text here...",
}: TranslationCardProps) {
  const [inputText, setInputText] = useState(text || "");

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newText = e.target.value;
    setInputText(newText);
    onTextChange?.(newText);
  };

  return (
    <div className="bg-white rounded-2xl border p-6 space-y-4">
      <h3 className="font-semibold text-gray-800">{title}</h3>

      {isInput ? (
        <textarea
          value={inputText}
          onChange={handleTextChange}
          placeholder={placeholder}
          className="w-full h-32 p-4 border rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
        />
      ) : (
        <div className="min-h-[128px] p-4 bg-gray-50 rounded-lg">
          <p className="text-gray-700 leading-relaxed">{text}</p>
        </div>
      )}

      <div className="flex justify-between items-center mt-6 text-gray-400">
        <div className="flex gap-4">
          <Volume2 size={18} />
          {!orange && <Mic size={18} />}
        </div>

        {footer && <span className="text-xs">{footer}</span>}

        {orange && (
          <div className="flex gap-4">
            <Share2 size={18} />
            <Copy size={18} />
          </div>
        )}
      </div>
    </div>
  );
}
