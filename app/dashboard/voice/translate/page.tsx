"use client";

import { useSearchParams } from "next/navigation";
import Header from "@/components/Header";
import VoiceCard from "@/components/VoiceCard";
import { Suspense, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Clock, ArrowRight } from "lucide-react";
import { Volume2, Mic, Copy, Share2, Heart } from "lucide-react";
import { useToast } from "@/hooks/useToast";
import {
  fetchVoiceTranslationHistory,
  type VoiceTranslationHistory,
} from "@/lib/api";

function TranslatePage() {
  const router = useRouter();
  const { toast, toasts } = useToast();
  const searchParams = useSearchParams();

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Add state
  const [history, setHistory] = useState<VoiceTranslationHistory[]>([]);

  // Add useEffect to load history
  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    try {
      const historyData = await fetchVoiceTranslationHistory();
      setHistory(historyData);
    } catch (error) {
      console.error("Failed to load voice history:", error);
    }
  };

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
      {/* <Header /> */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 py-8 sm:py-12">
        <div className="">
          {/* <div className="flex flex-col md:flex-row gap-6 md:gap-8"> */}
          <VoiceCard selectedLanguages={selectedLanguages} />
          {/* <RecentTranslations /> */}
        </div>
        {/* Translation History */}
        <div className="bg-white rounded-2xl mt-[80px] border border-[#b9ced5] p-4 sm:p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-gray-800">
              Recent Translations
            </h3>
            <button
              onClick={() => router.push("/dashboard/voice/history")}
              className="cursor-pointer flex items-center gap-2 text-orange-500 hover:text-orange-600 font-medium"
            >
              View All
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {history.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Clock className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <p>No translations yet</p>
              <p className="text-sm">
                Your translation history will appear here
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
                        {item.original_language_name}
                      </span>
                      <ArrowRight className="w-4 h-4 text-gray-400" />
                      <span className="text-sm bg-green-100 text-green-700 px-3 py-1 rounded-full font-medium">
                        {item.target_language_name}
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
      </main>

      {/* Footer */}
      <footer className="text-center text-sm text-gray-400 py-6 sm:py-8">
        © 2026 Let us Echo. All rights reserved.
      </footer>

      {/* Theme Toggle */}
      <button className="fixed bottom-4 sm:bottom-6 right-4 sm:right-6 w-12 h-12 sm:w-14 sm:h-14 bg-white rounded-full shadow-lg flex items-center justify-center text-xl sm:text-2xl">
        🌙
      </button>
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
