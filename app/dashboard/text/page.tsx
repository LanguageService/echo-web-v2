"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import TranslationCard from "@/components/TranslationCard";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import {
  translateText,
  fetchTranslationHistory,
  type Language,
  type TranslationHistory,
} from "@/lib/api";
import { Clock, ArrowRight } from "lucide-react";
import { Volume2, Mic, Copy, Share2, Heart } from "lucide-react";
import { useToast } from "@/hooks/useToast";

interface TextTranslationProps {
  title: string;
  text?: string;
  footer?: string;
  isInput?: boolean;
  onTextChange?: (text: string) => void;
  placeholder?: string;
  orange?: boolean;
}
export default function TextTranslation({
  text,
  isInput = false,
}: TextTranslationProps) {
  const router = useRouter();
  const { toast, toasts } = useToast();
  const [inputText, setInputText] = useState("");
  const [translatedText, setTranslatedText] = useState("");
  const [isTranslating, setIsTranslating] = useState(false);
  const [history, setHistory] = useState<TranslationHistory[]>([]);
  const [showToast, setShowToast] = useState(false);

  const [selectedLanguages, setSelectedLanguages] = useState<{
    input: Language | null;
    output: Language | null;
  }>({
    input: null,
    output: null,
  });

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    try {
      const historyData = await fetchTranslationHistory();
      setHistory(historyData.slice(0, 5)); // Show only first 5
    } catch (error) {
      console.error("Failed to load history:", error);
    }
  };

  const handleLanguageChange = (inputLang: Language, outputLang: Language) => {
    setSelectedLanguages({
      input: inputLang,
      output: outputLang,
    });
  };

  const handleInputChange = (text: string) => {
    setInputText(text);
  };

  const handleTranslate = async () => {
    if (
      !inputText.trim() ||
      !selectedLanguages.input ||
      !selectedLanguages.output
    ) {
      return;
    }

    setIsTranslating(true);
    try {
      const requestData = {
        text: inputText,
        source_language: selectedLanguages.input.code.toLowerCase(),
        target_language: selectedLanguages.output.code.toLowerCase(),
      };

      const result = await translateText(requestData);
      setTranslatedText(result.translated_text);
      loadHistory(); // Refresh history after new translation
    } catch (error) {
      console.error("Translation error:", error);
      setTranslatedText("Translation failed. Please try again.");
    } finally {
      setIsTranslating(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handleCopy = async () => {
    const textToCopy = isInput ? inputText : text || "";

    if (!textToCopy.trim()) return;

    try {
      await navigator.clipboard.writeText(textToCopy);
      setShowToast(true);
      setTimeout(() => setShowToast(false), 2000);
    } catch (error) {
      console.error("Failed to copy text:", error);
    }
  };

  return (
    <div className="p-4 sm:p-6 space-y-6 max-w-7xl mx-auto">
      <LanguageSwitcher onLanguageChange={handleLanguageChange} />

      <div className="grid lg:grid-cols-2 gap-6">
        <TranslationCard
          title={`Source (${selectedLanguages.input?.code?.toUpperCase() || "EN"})`}
          isInput={true}
          onTextChange={handleInputChange}
          placeholder="Type your text here to translate..."
          footer={`${inputText.length}/5000`}
          onCopy={() => toast("Text copied successfully!")}
        />

        <TranslationCard
          title={`Translation (${selectedLanguages.output?.code?.toUpperCase() || "RW"})`}
          text={translatedText || "Translation will appear here..."}
          onCopy={() => toast("Text copied successfully!")}
        />
      </div>

      <div className="flex justify-center">
        <button
          onClick={handleTranslate}
          disabled={
            !inputText.trim() ||
            !selectedLanguages.input ||
            !selectedLanguages.output ||
            isTranslating
          }
          className="bg-orange-500 hover:bg-orange-600 disabled:bg-gray-400 text-white px-8 py-3 rounded-full font-semibold transition"
        >
          {isTranslating ? "Translating..." : "Translate Text"}
        </button>
      </div>

      {/* Translation History */}
      <div className="bg-white rounded-2xl border border-[#b9ced5] p-4 sm:p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold text-gray-800">
            Recent Translations
          </h3>
          <button
            onClick={() => router.push("/dashboard/text/history")}
            className="flex items-center gap-2 text-orange-500 hover:text-orange-600 font-medium"
          >
            View All
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {history.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <Clock className="w-12 h-12 mx-auto mb-4 text-gray-300" />
            <p>No translations yet</p>
            <p className="text-sm">Your translation history will appear here</p>
          </div>
        ) : (
          <div className="space-y-4">
            {history.map((item) => (
              <div
                key={item.id}
                className="border border-[#b9ced5] rounded-lg p-4 hover:bg-gray-50 transition"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                  <div className="flex items-center gap-3">
                    <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
                      {item.original_language_name}
                    </span>
                    <ArrowRight className="w-3 h-3 text-gray-400" />
                    <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
                      {item.target_language_name}
                    </span>
                  </div>
                  <span className="text-xs text-gray-500">
                    {formatDate(item.date_created)}
                  </span>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Original</p>
                    <p className="text-sm line-clamp-2 mb-3">
                      {item.original_text}
                    </p>
                    <div className="flex justify-between items-center">
                      <button className="flex items-center gap-1 text-xs text-gray-500 hover:text-orange-500 transition-colors">
                        <Mic size={14} />
                        Listen
                      </button>
                      <button
                        onClick={async () => {
                          await navigator.clipboard.writeText(
                            item.original_text,
                          );
                          toast("Text copied successfully!");
                        }}
                        className="flex items-center gap-1 text-xs text-gray-500 hover:text-orange-500 transition-colors"
                      >
                        <Copy size={14} />
                        Copy
                      </button>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Translation</p>
                    <p className="text-sm line-clamp-2 mb-3">
                      {item.translated_text}
                    </p>
                    <div className="flex justify-between items-center">
                      <button className="flex items-center gap-1 text-xs text-gray-500 hover:text-orange-500 transition-colors">
                        <Mic size={14} />
                        Listen
                      </button>
                      <button
                        onClick={async () => {
                          await navigator.clipboard.writeText(
                            item.translated_text,
                          );
                          toast("Text copied successfully!");
                        }}
                        className="flex items-center gap-1 text-xs text-gray-500 hover:text-orange-500 transition-colors"
                      >
                        <Copy size={14} />
                        Copy
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Toast Notification */}
      <div className="fixed top-4 right-4 space-y-2 z-50">
        {toasts.map((message, index) => (
          <div
            key={index}
            className="bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg animate-fade-in"
          >
            {message}
          </div>
        ))}
      </div>
    </div>
  );
}
