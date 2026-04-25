"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { fetchRecentTranslations, type GeneralVoiceTranslationHistory } from "@/lib/api";
import { useToast } from "@/hooks/useToast";
import { ArrowLeft, Clock, ArrowRight, Volume2, Copy } from "lucide-react";

const btnClass = "border dark:border-gray-600 rounded-full px-3 py-1 flex items-center gap-2 text-sm teence-tracker>xt-gray-600 dark:text-gray-400 hover:text-orange-500 dark:hover:text-orange-400<mark marker-index=0 reference-tracker> transition-colors";

export default function HistoryPage() {
  const router = useRouter();
  const { toast, toasts } = useToast();
  const [history, setHistory] = useState<GeneralVoiceTranslationHistory[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => { loadHistory(); }, []);

  const loadHistory = async () => {
    try {
      const response = await fetchRecentTranslations();
      setHistory(response.results);
      setTotalCount(response.count);
    } catch {
      toast("Failed to load translation history");
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric", month: "long", day: "numeric",
      hour: "2-digit", minute: "2-digit",
    });

  const getFeatureTypeLabel = (type: string) =>
    type === "SPEECH_TRANSLATION" ? "Voice" : "Text";

  if (loading) {
    return (
      <div className="p-4 sm:p-6 max-w-7xl mx-auto">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/4" />
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-24 bg-gray-200 dark:bg-gray-700 rounded" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto">
      <div className="flex items-center gap-4 mb-6">
        <button
          onClick={() => router.back()}
          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition"
        >
          <ArrowLeft className="w-5 h-5 dark:text-white" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
            Translation History
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {totalCount} total translations
          </p>
        </div>
      </div>

      {history.length === 0 ? (
        <div className="text-center py-12">
          <Clock className="w-16 h-16 mx-auto mb-4 text-gray-300 dark:text-gray-600" />
          <h3 className="text-lg font-semibold text-gray-600 dark:text-gray-400 mb-2">
            No translations yet
          </h3>
          <p className="text-gray-500 dark:text-gray-500">
            Start translating to build your history
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {history.map((item) => (
            <div
              key={item.id}
              className="bg-white dark:bg-gray-900 border border-[#b9ced5] dark:border-gray-700 rounded-xl p-4 sm:p-6 hover:shadow-md transition"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                <div className="flex items-center gap-3">
                  <span className="text-xs bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300 px-2 py-1 rounded-full font-medium">
                    {getFeatureTypeLabel(item?.feature_type)}
                  </span>
                  <span className="text-sm bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 px-3 py-1 rounded-full font-medium">
                    {item.original_language}
                  </span>
                  <ArrowRight className="w-4 h-4 text-gray-400 dark:text-gray-500" />
                  <span className="text-sm bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-300 px-3 py-1 rounded-full font-medium">
                    {item.target_language}
                  </span>
                </div>
                <div className="flex flex-col sm:items-end gap-1">
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    {formatDate(item.date_created)}
                  </span>
                  <span className="text-xs text-gray-400 dark:text-gray-500">
                    {item.total_processing_time.toFixed(2)}s processing time
                  </span>
                </div>
              </div>

              <div className="grid lg:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <h4 className="font-bold text-gray-700 dark:text-gray-300">Original Text</h4>
                  <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-700 dark:border-blue-700/50 rounded-lg p-4">
                    <p className="text-gray-800 dark:text-gray-200 text-justify leading-relaxed mb-3 max-h-[120px] min-h-[60px] overflow-y-auto">
                      {item.original_text}
                    </p>
                    <hr className="my-3 border-gray-300 dark:border-gray-600" />
                    <div className="flex justify-between items-center">
                      {item.original_audio_url && (
                        <button onClick={() => new Audio(item.original_audio_url!).play()} className={btnClass}>
                          <Volume2 size={16} /> Listen
                        </button>
                      )}
                      <button
                        onClick={async () => {
                          await navigator.clipboard.writeText(item.original_text);
                          toast("Text copied successfully!");
                        }}
                        className={btnClass}
                      >
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
                    <hr className="my-3 border-gray-300 dark:border-gray-600" />
                    <div className="flex justify-between items-center">
                      {item.translated_audio_url && (
                        <button onClick={() => new Audio(item.translated_audio_url!).play()} className={btnClass}>
                          <Volume2 size={16} /> Listen
                        </button>
                      )}
                      <button
                        onClick={async () => {
                          await navigator.clipboard.writeText(item.translated_text);
                          toast("Text copied successfully!");
                        }}
                        className={btnClass}
                      >
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

      <div className="fixed top-4 right-4 space-y-2 z-50">
        {toasts.map((message, index) => (
          <div key={index} className="bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg animate-fade-in">
            {message}
          </div>
        ))}
      </div>
    </div>
  );
}
