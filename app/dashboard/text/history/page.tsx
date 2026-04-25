"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { fetchTranslationHistory, type TranslationHistory } from "@/lib/api";
import { ArrowLeft, Clock, ArrowRight } from "lucide-react";
import { Volume2, Mic, Copy, Share2, Heart } from "lucide-react";
import { useToast } from "@/hooks/useToast";

export default function TranslationHistoryPage() {
  const router = useRouter();
  const [history, setHistory] = useState<TranslationHistory[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast, toasts } = useToast();

  useEffect(() => {
    loadHistory();
  }, []);

  // const loadHistory = async () => {
  //   try {
  //     const historyData = await fetchTranslationHistory();
  //     setHistory(historyData);
  //   } catch (error) {
  //     console.error("Failed to load history:", error);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const loadHistory = async () => {
    try {
      const historyData = await fetchTranslationHistory();
      const items = Array.isArray(historyData)
        ? historyData
        : ((historyData as any).results ?? []);
      setHistory(items);
    } catch (error) {
      console.error("Failed to load history:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) {
    return (
      <div className="p-4 sm:p-6 max-w-7xl mx-auto">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-24 bg-gray-200 rounded"></div>
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
          className="p-2 hover:bg-gray-100 rounded-full transition"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="text-2xl font-bold text-gray-800">
          Translation History
        </h1>
      </div>

      {history.length === 0 ? (
        <div className="text-center py-12">
          <Clock className="w-16 h-16 mx-auto mb-4 text-gray-300" />
          <h3 className="text-lg font-semibold text-gray-600 mb-2">
            No translations yet
          </h3>
          <p className="text-gray-500">
            Start translating to build your history
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {history.map((item) => (
            <div
              key={item.id}
              className="bg-white border border-[#b9ced5] rounded-xl p-4 sm:p-6 hover:shadow-md transition"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                <div className="flex items-center gap-3">
                  <span className="text-sm bg-blue-100 text-blue-700 px-3 py-1 rounded-full font-medium">
                    {item.original_language}
                  </span>
                  <ArrowRight className="w-4 h-4 text-gray-400" />
                  <span className="text-sm bg-green-100 text-green-700 px-3 py-1 rounded-full font-medium">
                    {item.target_language}
                  </span>
                </div>
                <div className="flex flex-col sm:items-end gap-1">
                  <span className="text-sm text-gray-500">
                    {formatDate(item.date_created)}
                  </span>
                  <span className="text-xs text-gray-400">
                    {item.total_processing_time.toFixed(2)}s processing time
                  </span>
                </div>
              </div>

              <div className="grid lg:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <h4 className="font-bold text-gray-700">Original Text</h4>
                  <div className="bg-blue-50 border border-blue-700 rounded-lg p-4">
                    <p className="text-gray-800 text-justify leading-relaxed mb-3  max-h-[120px] min-h-[60px] overflow-y-auto">
                      {item.original_text}
                    </p>

                    <hr className="my-5 text-[#b9ced5]" />

                    <div className="flex justify-between items-center">
                      <button className="border rounded-full px-3 py-1 flex items-center gap-2 text-sm text-gray-600 hover:text-orange-500 transition-colors">
                        <Mic size={16} />
                        Listen
                      </button>
                      <button
                        onClick={async () => {
                          await navigator.clipboard.writeText(
                            item.original_text,
                          );
                          toast("Text copied successfully!");
                        }}
                        className="border rounded-full px-3 py-1 flex items-center gap-2 text-sm text-gray-600 hover:text-orange-500 transition-colors"
                      >
                        <Copy size={16} />
                        Copy
                      </button>
                    </div>
                  </div>
                </div>
                <div className="space-y-2">
                  <h4 className="font-bold text-gray-700">Translation</h4>
                  <div className="bg-green-50 border border-green-700 rounded-lg p-4">
                    <p className="text-gray-800 text-justify leading-relaxed mb-3 max-h-[120px] min-h-[60px] overflow-y-auto">
                      {item.translated_text}
                    </p>
                    <hr className="my-5 text-[#b9ced5]" />

                    <div className="flex justify-between items-center">
                      <button className=" border rounded-full px-3 py-1 flex items-center gap-2 text-sm text-gray-600 hover:text-orange-500 transition-colors">
                        <Mic size={16} />
                        Listen
                      </button>
                      <button
                        onClick={async () => {
                          await navigator.clipboard.writeText(
                            item.translated_text,
                          );
                          toast("Text copied successfully!");
                        }}
                        className="border rounded-full px-3 py-1 flex items-center gap-2 text-sm text-gray-600 hover:text-orange-500 transition-colors"
                      >
                        <Copy size={16} />
                        Copy
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
          {/* Toast Container */}
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
      )}
    </div>
  );
}
