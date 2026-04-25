"use client";

import { useSearchParams } from "next/navigation";
import VoiceCard from "@/components/VoiceCard";
import { Suspense, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Clock, ArrowRight, Mic, Copy } from "lucide-react";
import { useToast } from "@/hooks/useToast";
import { fetchVoiceTranslationHistory, type VoiceTranslationHistory } from "@/lib/api";

const btnClass = "border dark:border-gray-600 rounded-full px-3 py-1 flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 hover:text-orange-500 dark:hover:text-orange-400 transition-colors";

function TranslatePage() {
  const router = useRouter();
  const { toast, toasts } = useToast();
  const searchParams = useSearchParams();
  const [history, setHistory] = useState<VoiceTranslationHistory[]>([]);
  const [isLoadingHistory, setIsLoadingHistory] = useState(true);

  useEffect(() => { loadHistory(); }, []);

  const loadHistory = async () => {
    setIsLoadingHistory(true);
    try {
      const historyData = await fetchVoiceTranslationHistory();
      setHistory(historyData);
    } catch (error) {
      console.error("Failed to load voice history:", error);
    } finally {
      setIsLoadingHistory(false);
    }
  };

  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric", month: "long", day: "numeric",
      hour: "2-digit", minute: "2-digit",
    });

  const selectedLanguages = {
    input: {
      code: searchParams.get("inputLang") || "en",
      name: searchParams.get("inputName") || "English",
      native_name: searchParams.get("inputNative") || "English",
    },
    output: {
      code: searchParams.get("outputLang") || "rw",
      name: searchParams.get("outputName") || "Kinyarwanda",
      native_name: searchParams.get("outputNative") || "Ikinyarwanda",
    },
  };

  return (
    <>
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 py-8 sm:py-12">
        <VoiceCard selectedLanguages={selectedLanguages} />

        {/* Translation History */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl mt-[80px] border border-[#b9ced5] dark:border-gray-700 p-4 sm:p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-gray-800 dark:text-white">
              Recent Translations
            </h3>
            <button
              onClick={() => router.push("/dashboard/voice/history")}
              className="cursor-pointer flex items-center gap-2 text-orange-500 hover:text-orange-600 font-medium"
            >
              View All <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {isLoadingHistory ? (
            <div className="text-center py-8">
              <div className="w-12 h-12 mx-auto mb-4 border-4 border-orange-500 border-t-transparent rounded-full animate-spin" />
              <p className="text-gray-500 dark:text-gray-400">Loading translations...</p>
            </div>
          ) : history.length === 0 ? (
            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
              <Clock className="w-12 h-12 mx-auto mb-4 text-gray-300 dark:text-gray-600" />
              <p>No translations yet</p>
              <p className="text-sm">Your translation history will appear here</p>
            </div>
          ) : (
            <div className="space-y-4">
              {history.slice(0, 3).map((item) => (
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
      </main>

      <footer className="text-center text-sm text-gray-400 dark:text-gray-500 py-6 sm:py-8">
        © 2026 Let us Echo. All rights reserved.
      </footer>
    </>
  );
}

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <TranslatePage />
    </Suspense>
  );
}
