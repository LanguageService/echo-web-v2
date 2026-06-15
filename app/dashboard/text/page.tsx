"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import TranslationCard from "@/components/TranslationCard";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import { translateText, fetchTranslationHistory, hasSufficientBalance, type Language, type TranslationHistory } from "@/lib/api";
import { Clock, ArrowRight, Mic, Copy, ArrowLeft } from "lucide-react";
import { useToast } from "@/hooks/useToast";
import NoFundsModal from "@/components/NoFundsModal";

const btnClass = "cursor-pointer border dark:border-gray-600 rounded-full px-3 py-1 flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 hover:text-orange-500 dark:hover:text-orange-400 transition-colors";

interface TextTranslationProps {
  title?: string; text?: string; footer?: string;
  isInput?: boolean; onTextChange?: (text: string) => void;
  placeholder?: string; orange?: boolean;
}

export default function TextTranslation({ text, isInput = false }: TextTranslationProps) {
  const router = useRouter();
  const { toast, toasts } = useToast();
  const [inputText, setInputText] = useState("");
  const [translatedText, setTranslatedText] = useState("");
  const [isTranslating, setIsTranslating] = useState(false);
  const [showNoFunds, setShowNoFunds] = useState(false);
  const [history, setHistory] = useState<TranslationHistory[]>([]);
  const [selectedLanguages, setSelectedLanguages] = useState<{ input: Language | null; output: Language | null }>({ input: null, output: null });

  useEffect(() => { loadHistory(); }, []);

  const loadHistory = async () => {
    try {
      const historyData = await fetchTranslationHistory();
      const items = Array.isArray(historyData) ? historyData : ((historyData as any).results ?? []);
      setHistory(items.slice(0, 5));
    } catch { }
  };

  const handleLanguageChange = (inputLang: Language, outputLang: Language) => {
    setSelectedLanguages({ input: inputLang, output: outputLang });
  };

  const handleTranslate = async () => {
    if (!inputText.trim() || !selectedLanguages.input || !selectedLanguages.output) return;
    const sufficient = await hasSufficientBalance();
    if (!sufficient) { setShowNoFunds(true); return; }
    setIsTranslating(true);
    try {
      const result = await translateText({
        text: inputText,
        source_language: selectedLanguages.input.code.toLowerCase(),
        target_language: selectedLanguages.output.code.toLowerCase(),
      });
      setTranslatedText(result.translated_text);
      loadHistory();
    } catch {
      setTranslatedText("Translation failed. Please try again.");
    } finally {
      setIsTranslating(false);
    }
  };

  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleDateString("en-US", {
      month: "short", day: "numeric", hour: "2-digit", minute: "2-digit",
    });

  return (
    <div className="p-4 sm:p-6 space-y-6 max-w-7xl mx-auto">
      <button
        onClick={() => router.back()}
        className="flex items-center gap-2 text-gray-500 dark:text-gray-400 hover:text-orange-500 dark:hover:text-orange-400 transition-colors"
      >
        <ArrowLeft size={18} /> Back
      </button>
      <LanguageSwitcher onLanguageChange={handleLanguageChange} />

      <div className="grid lg:grid-cols-2 gap-6">
        <TranslationCard
          title={`Source (${selectedLanguages.input?.name || "EN"})`}
          isInput={true}
          onTextChange={setInputText}
          placeholder="Type your text here to translate..."
          footer={`${inputText.length}/5000`}
          onCopy={() => toast("Text copied successfully!")}
        />
        <TranslationCard
          title={`Translation (${selectedLanguages.output?.name || "RW"})`}
          text={translatedText || "Translation will appear here..."}
          onCopy={() => toast("Text copied successfully!")}
        />
      </div>

      <div className="flex justify-center">
        <button
          onClick={handleTranslate}
          disabled={!inputText.trim() || !selectedLanguages.input || !selectedLanguages.output || isTranslating}
          className="bg-orange-500 hover:bg-orange-600 disabled:bg-gray-400 dark:disabled:bg-gray-700 text-white px-8 py-3 rounded-full font-semibold transition cursor-pointer"
        >
          {isTranslating ? "Translating..." : "Translate Text"}
        </button>
      </div>

      {/* Translation History */}
      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-[#b9ced5] dark:border-gray-700 p-4 sm:p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold text-gray-800 dark:text-white">Recent Translations</h3>
          <button
            onClick={() => router.push("/dashboard/text/history")}
            className="cursor-pointer flex items-center gap-2 text-orange-500 hover:text-orange-600 font-medium"
          >
            View All <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {history.length === 0 ? (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            <Clock className="w-12 h-12 mx-auto mb-4 text-gray-300 dark:text-gray-600" />
            <p>No translations yet</p>
            <p className="text-sm">Your translation history will appear here</p>
          </div>
        ) : (
          <div className="space-y-4">
            {history.map((item) => (
              <div key={item.id} className="bg-white dark:bg-gray-800 border border-[#b9ced5] dark:border-gray-700 rounded-xl p-4 sm:p-6 hover:shadow-md transition">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                  <div className="flex items-center gap-3">
                    <span className="text-sm bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 px-3 py-1 rounded-full font-medium">
                      {item.original_language}
                    </span>
                    <ArrowRight className="w-4 h-4 text-gray-400 dark:text-gray-500" />
                    <span className="text-sm bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-300 px-3 py-1 rounded-full font-medium">
                      {item.target_language}
                    </span>
                  </div>
                  <div className="flex flex-col sm:items-end gap-1">
                    <span className="text-sm text-gray-500 dark:text-gray-400">{formatDate(item.date_created)}</span>
                    {/* <span className="text-xs text-gray-400 dark:text-gray-500">{item.total_processing_time.toFixed(2)}s processing time</span> */}
                  </div>
                </div>

                <div className="grid lg:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <h4 className="font-bold text-gray-700 dark:text-gray-300">Original Text</h4>
                    <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-700 dark:border-blue-700/50 rounded-lg p-4">
                      <p className="text-gray-800 dark:text-gray-200 text-justify leading-relaxed mb-3 max-h-[120px] min-h-[60px] overflow-y-auto">
                        {item.original_text}
                      </p>
                      <hr className="my-5 border-[#b9ced5] dark:border-gray-600" />
                      <div className="flex justify-between items-center">
                        <button className={btnClass}><Mic size={16} /> Listen</button>
                        <button onClick={async () => { await navigator.clipboard.writeText(item.original_text); toast("Text copied successfully!"); }} className={btnClass}>
                          <Copy size={16} /> Copy
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h4 className="font-bold text-gray-700 dark:text-gray-300">Translation</h4>
                    <div className="bg-green-50 dark:bg-green-900/20 border border-green-700 dark:border-green-700/50 rounded-lg p-4">
                      <p className="text-gray-800 dark:text-gray-200 text-justify leading-relaxed mb-3 max-h-[120px] min-h-[60px] overflow-y-auto">
                        {item.translated_text}
                      </p>
                      <hr className="my-5 border-[#b9ced5] dark:border-gray-600" />
                      <div className="flex justify-between items-center">
                        <button className={btnClass}><Mic size={16} /> Listen</button>
                        <button onClick={async () => { await navigator.clipboard.writeText(item.translated_text); toast("Text copied successfully!"); }} className={btnClass}>
                          <Copy size={16} /> Copy
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="fixed top-4 right-4 space-y-2 z-50">
        {toasts.map((message, index) => (
          <div key={index} className="bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg animate-fade-in">
            {message}
          </div>
        ))}
      </div>

      <NoFundsModal isOpen={showNoFunds} onClose={() => setShowNoFunds(false)} />
    </div>
  );
}
