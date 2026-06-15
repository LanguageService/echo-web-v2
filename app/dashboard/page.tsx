"use client";

import { Mic, MessageSquare, Image, FileText, ArrowRight, Volume2, Copy } from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { fetchRecentTranslations, resolveMediaUrl, type GeneralVoiceTranslationHistory } from "@/lib/api";
import { useToast } from "@/hooks/useToast";

const btnClass = "border dark:border-gray-600 rounded-full px-3 py-1 flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 hover:text-orange-500 dark:hover:text-orange-400 transition-colors cursor-pointer";

export default function Dashboard() {
  const router = useRouter();
  const [recentTranslations, setRecentTranslations] = useState<GeneralVoiceTranslationHistory[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast, toasts } = useToast();

  useEffect(() => { loadRecentTranslations(); }, []);

  const loadRecentTranslations = async () => {
    try {
      const response = await fetchRecentTranslations();
      setRecentTranslations(response.results.slice(0, 3));
    } catch {
      console.error("Failed to load recent translations");
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleDateString("en-US", {
      month: "short", day: "numeric", hour: "2-digit", minute: "2-digit",
    });

  const getFeatureTypeLabel = (type: string) =>
    type === "speech" ? "Voice" : "Text";

  return (
    <main className="min-h-screen bg-white dark:bg-transparent px-4 sm:px-6 lg:px-10 pt-6 lg:pt-8 pb-24">
      <h1 className="mt-2 text-3xl sm:text-4xl lg:text-[40px] font-bold leading-tight text-[#0C141D] dark:text-white">
        Choose how you want to <br />
        <span className="text-[#12B76A]">translate</span> today.
      </h1>

      <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card icon={<Mic className="text-[#F79009]" />} title="Voice" desc="Speak naturally. Echo translates instantly." active />
        <Card icon={<MessageSquare className="text-[#F79009]" />} title="Text" desc="Real conversations, translated in real time." active />
        <Card icon={<FileText className="text-[#F79009]" />} title="Document" desc="Upload a document. Echo translates it instantly." active />
        <Card icon={<Image className="text-[#98A2B3]" />} title="Image" desc="Coming Soon" soon />
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mt-[50px]">
        <h2 className="font-semibold text-lg text-[#0C141D] dark:text-white">
          Recent translations
        </h2>
        <span
          className="cursor-pointer flex items-center gap-2 text-orange-500 hover:text-orange-600 font-medium"
          onClick={() => router.push("/dashboard/history")}
        >
          View All <ArrowRight className="w-4 h-4" />
        </span>
      </div>

      {loading ? (
        <div className="mt-6 space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-20 bg-gray-200 dark:bg-gray-700 rounded-xl animate-pulse" />
          ))}
        </div>
      ) : recentTranslations.length === 0 ? (
        <div className="mt-6 border border-dashed border-[#D0D5DD] dark:border-gray-700 rounded-2xl py-20 flex flex-col items-center justify-center text-center">
          <div className="w-12 h-12 rounded-full bg-[#F2F4F7] dark:bg-gray-800 flex items-center justify-center mb-4">
            ⏱️
          </div>
          <p className="font-semibold text-[#0C141D] dark:text-white">No translations yet</p>
          <p className="text-sm text-[#667085] dark:text-gray-400 mt-2 max-w-sm">
            Start one to build your history. Translations you make will appear here for easy access.
          </p>
        </div>
      ) : (
        <div className="mt-6 space-y-4">
          {recentTranslations.map((item) => (
            <div key={item.id} className="bg-white dark:bg-gray-900 border border-[#b9ced5] dark:border-gray-700 rounded-xl p-4 sm:p-6 hover:shadow-md transition">
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
                    <hr className="my-3 border-gray-300 dark:border-gray-600" />
                    <div className="flex justify-between items-center">
                      {item.original_audio_url && (
                        <button onClick={() => new Audio(resolveMediaUrl(item.original_audio_url)!).play()} className={btnClass}>
                          <Volume2 size={16} /> Listen
                        </button>
                      )}
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
                    <hr className="my-3 border-gray-300 dark:border-gray-600" />
                    <div className="flex justify-between items-center">
                      {item.translated_audio_url && (
                        <button onClick={() => new Audio(resolveMediaUrl(item.translated_audio_url)!).play()} className={btnClass}>
                          <Volume2 size={16} /> Listen
                        </button>
                      )}
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

      <div className="fixed top-4 right-4 space-y-2 z-50">
        {toasts.map((message, index) => (
          <div key={index} className="bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg animate-fade-in">
            {message}
          </div>
        ))}
      </div>
    </main>
  );
}

function Card({ icon, title, desc, active, soon }: {
  icon: React.ReactNode; title: string; desc: string; active?: boolean; soon?: boolean;
}) {
  const getLink = () => {
    if (soon) return "#";
    switch (title.toLowerCase()) {
      case "voice": return "/dashboard/voice";
      case "text": return "/dashboard/text";
      case "document": return "/dashboard/document";
      case "image": return "/dashboard/image";
      default: return "#";
    }
  };

  return (
    <Link href={getLink()}>
      <div className={`relative rounded-2xl p-6 flex flex-col items-center text-center cursor-pointer transition-transform hover:scale-105
        ${active ? "bg-[#FFF7ED] dark:bg-orange-900/20" : "bg-[#F9FAFB] dark:bg-gray-800"}
        ${soon ? "opacity-60 cursor-not-allowed" : ""}
      `}>
        {soon && (
          <span className="absolute top-4 right-4 text-xs bg-[#F2F4F7] dark:bg-gray-700 px-2 py-1 rounded-full text-[#667085] dark:text-gray-400">
            Soon
          </span>
        )}
        <div className="w-12 h-12 rounded-full bg-[#FDEAD7] dark:bg-orange-900/30 flex items-center justify-center mb-4">
          {icon}
        </div>
        <p className="font-semibold text-[#0C141D] dark:text-white">{title}</p>
        <p className="text-xs tracking-wide text-[#667085] dark:text-gray-400 mt-1">Translation</p>
        <p className="text-xs text-[#667085] dark:text-gray-400 mt-3">{desc}</p>
      </div>
    </Link>
  );
}
