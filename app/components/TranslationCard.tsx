"use client";

import { useState, useRef, useEffect } from "react";
import { Mic, MicOff, Copy, Volume2 } from "lucide-react";

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
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    if (!isInput) {
      setInputText(text || "");
    }
  }, [text, isInput]);

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

  const toggleListening = () => {
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
      return;
    }

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Speech recognition is not supported in this browser.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;

    let currentInterim = "";

    recognition.onresult = (event: any) => {
      let finalTranscript = "";
      for (let i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
          finalTranscript += event.results[i][0].transcript;
        } else {
          currentInterim += event.results[i][0].transcript;
        }
      }
      
      if (finalTranscript) {
        setInputText((prev) => {
          const newText = prev + (prev ? " " : "") + finalTranscript;
          onTextChange?.(newText);
          return newText;
        });
      }
    };

    recognition.onerror = (event: any) => {
      console.error("Speech recognition error", event.error);
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.start();
    setIsListening(true);
    recognitionRef.current = recognition;
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
        {isInput ? (
          <button 
            onClick={toggleListening}
            className={`cursor-pointer flex items-center gap-2 px-3 py-1 border rounded-lg transition-colors ${
              isListening 
                ? "border-red-500 text-red-500 bg-red-50 dark:bg-red-900/20" 
                : "border-gray-300 dark:border-gray-600 hover:border-orange-500 hover:text-orange-500 dark:text-gray-400 dark:hover:border-orange-500 dark:hover:text-orange-400"
            }`}
          >
            {isListening ? (
              <>
                <div className="flex items-center gap-[2px] h-4">
                  <div className="w-1 bg-red-500 rounded-full animate-[bounce_1s_infinite_0ms]"></div>
                  <div className="w-1 bg-red-500 rounded-full animate-[bounce_1s_infinite_200ms]" style={{ height: '80%' }}></div>
                  <div className="w-1 bg-red-500 rounded-full animate-[bounce_1s_infinite_400ms]"></div>
                </div>
                <span className="text-sm">Stop</span>
              </>
            ) : (
              <>
                <Mic size={16} />
                <span className="text-sm">Speak</span>
              </>
            )}
          </button>
        ) : (
          <button className="cursor-pointer flex items-center gap-2 px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-lg hover:border-orange-500 hover:text-orange-500 dark:text-gray-400 dark:hover:border-orange-500 dark:hover:text-orange-400 transition-colors">
            <Volume2 size={16} />
            <span className="text-sm">Listen</span>
          </button>
        )}

        {footer && <span className="text-xs text-black dark:text-gray-300">{footer}</span>}

        <button
          onClick={handleCopy}
          className="cursor-pointer flex items-center gap-2 px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-lg hover:border-orange-500 hover:text-orange-500 dark:text-gray-400 dark:hover:border-orange-500 dark:hover:text-orange-400 transition-colors"
          title="Copy text"
        >
          <Copy size={16} />
          <span className="text-sm">Copy</span>
        </button>
      </div>
    </div>
  );
}
