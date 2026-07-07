"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { fetchRecentTranslations, fetchDocumentHistory, toggleFavorite, resolveMediaUrl, type GeneralVoiceTranslationHistory } from "@/lib/api";
import { useToast } from "@/hooks/useToast";
import { ArrowLeft, Clock, ArrowRight, Volume2, Copy, Heart, FileText, X, Download } from "lucide-react";
import PlayAudioButton from "@/components/PlayAudioButton";
import DocumentPreview from "@/components/DocumentPreview";

const btnClass = "cursor-pointer border dark:border-gray-600 rounded-full px-3 py-1 flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 hover:text-orange-500 dark:hover:text-orange-400 transition-colors";

export default function HistoryPage() {
  const router = useRouter();
  const { toast, toasts } = useToast();
  const [history, setHistory] = useState<GeneralVoiceTranslationHistory[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"ALL" | "speech" | "text" | "sms" | "document">("ALL");
  const [previewModal, setPreviewModal] = useState<{type: 'original' | 'translated', item: GeneralVoiceTranslationHistory} | null>(null);

  useEffect(() => { loadHistory(); }, []);

  const loadHistory = async () => {
    try {
      const [recentRes, docRes] = await Promise.all([
        fetchRecentTranslations(),
        fetchDocumentHistory().catch(() => [])
      ]);
      
      const recentItems = recentRes.results || [];
      const docItemsRaw = Array.isArray(docRes) ? docRes : ((docRes as any).results ?? []);
      
      const docItems = docItemsRaw.map((item: any) => ({
        ...item,
        type: "document"
      }));

      const combined = [...recentItems, ...docItems].sort((a, b) => 
        new Date(b.date_created).getTime() - new Date(a.date_created).getTime()
      );

      setHistory(combined as GeneralVoiceTranslationHistory[]);
      setTotalCount(combined.length);
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
    type === "speech" ? "Voice" : type === "document" ? "Document" : "Text";

  const filtered = filter === "ALL" ? history : filter === "sms" ? history.filter(item => item.is_sms === true) : filter === "text" ? history.filter(item => item.type === "text" && !item.is_sms) : history.filter(item => item.type === filter);

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

      <div className="flex items-center gap-4 mb-4">
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

      <div className="flex gap-2 mb-6">
        {(["ALL", "speech", "text", "sms", "document"] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-1.5 rounded-full cursor-pointer text-sm font-medium transition ${filter === f
              ? "bg-orange-500 text-white"
              : "bg-gray-100 border border-gray-300 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700"
              }`}
          >
            {f === "ALL" ? "All" : f === "speech" ? "🎙 Voice" : f === "text" ? "📝 Text" : f === "sms" ? "📱 SMS" : "📄 Document"}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
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
          {filtered.map((item, index) => (
            <div
              key={`${item.id}-${index}`}
              className="bg-white dark:bg-gray-900 border border-[#b9ced5] dark:border-gray-700 rounded-xl p-4 sm:p-6 hover:shadow-md transition"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                <div className="flex flex-wrap items-center gap-3">
                  <span className="text-xs bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300 px-2 py-1 rounded-full font-medium">
                    {getFeatureTypeLabel(item?.type)}
                  </span>
                  <span className="text-sm bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 px-3 py-1 rounded-full font-medium">
                    {item.original_language}
                  </span>
                  <ArrowRight className="w-4 h-4 text-gray-400 dark:text-gray-500" />
                  <span className="text-sm bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-300 px-3 py-1 rounded-full font-medium">
                    {item.target_language}
                  </span>
                  {item.status && (
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      item.status === "COMPLETED" ? "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400" :
                      item.status === "FAILED" ? "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400" :
                      "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-400"
                    }`}>
                      {item.status}
                    </span>
                  )}
                </div>
                <div className="flex flex-col sm:items-end gap-1">
                  <div className="flex items-center gap-2">
                    <button onClick={async () => {
                      const updated = await toggleFavorite(item.id);
                      setHistory(history.map(h => h.id === item.id ? { ...h, is_favorite: updated } : h));
                      if(updated) toast("Added to favourites");
                    }} className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition">
                      <Heart className={`w-5 h-5 ${item.is_favorite ? "fill-red-500 text-red-500" : "text-gray-400 dark:text-gray-500"}`} />
                    </button>
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      {formatDate(item.date_created)}
                    </span>
                  </div>
                </div>
              </div>

              <div className="grid lg:grid-cols-2 gap-4">
                <div className="flex items-center gap-3 bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg border border-blue-200 dark:border-blue-700/50">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300 flex-1 truncate">
                    {item.title || "Original Content"}
                  </span>
                  <button onClick={() => setPreviewModal({type: 'original', item})} className="text-sm text-blue-600 hover:text-blue-700 font-medium px-3 py-1 bg-white dark:bg-gray-800 rounded shadow-sm border border-gray-200 dark:border-gray-600 cursor-pointer">
                    View Original
                  </button>
                </div>
                <div className="flex items-center gap-3 bg-green-50 dark:bg-green-900/20 p-3 rounded-lg border border-green-200 dark:border-green-700/50">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300 flex-1 truncate">
                    {item.title ? `Translated ${item.title}` : "Translated Content"}
                  </span>
                  <button onClick={() => setPreviewModal({type: 'translated', item})} className="text-sm text-green-600 hover:text-green-700 font-medium px-3 py-1 bg-white dark:bg-gray-800 rounded shadow-sm border border-gray-200 dark:border-gray-600 cursor-pointer">
                    View Translation
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {previewModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white dark:bg-gray-900 rounded-2xl w-full max-w-3xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden border border-gray-200 dark:border-gray-800">
            <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-800">
              <h3 className="font-bold text-lg text-gray-800 dark:text-white flex items-center gap-2">
                {previewModal.type === 'original' ? 'Original Content' : 'Translated Content'}
              </h3>
              <button onClick={() => setPreviewModal(null)} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition cursor-pointer">
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            <div className="p-6 overflow-y-auto flex-1 bg-gray-50 dark:bg-gray-900/50 space-y-6">
              
              {/* Text Content */}
              {((previewModal.type === 'original' ? previewModal.item.original_text : previewModal.item.translated_text) || (!previewModal.item.original_file_url && !previewModal.item.translated_file_url)) && (
                <div className="bg-white dark:bg-gray-800 rounded-xl p-5 border border-gray-200 dark:border-gray-700 shadow-sm">
                  <p className="text-gray-800 dark:text-gray-200 leading-relaxed whitespace-pre-wrap">
                    {previewModal.type === 'original' ? previewModal.item.original_text : previewModal.item.translated_text}
                  </p>
                  <div className="flex items-center gap-3 mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
                    <button
                      onClick={async () => {
                        const text = previewModal.type === 'original' ? previewModal.item.original_text : previewModal.item.translated_text;
                        await navigator.clipboard.writeText(text);
                        toast("Text copied successfully!");
                      }}
                      className={btnClass}
                    >
                      <Copy size={16} /> Copy Text
                    </button>
                    {(previewModal.type === 'original' ? previewModal.item.original_audio_url : previewModal.item.translated_audio_url) && (
                      <PlayAudioButton audioUrl={previewModal.type === 'original' ? previewModal.item.original_audio_url : previewModal.item.translated_audio_url} className={btnClass} />
                    )}
                  </div>
                </div>
              )}

              {/* Document Content */}
              {(previewModal.type === 'original' ? previewModal.item.original_file_url : previewModal.item.translated_file_url) && (
                <div className="bg-white dark:bg-gray-800 rounded-xl p-5 border border-gray-200 dark:border-gray-700 shadow-sm flex flex-col items-center gap-4">
                  <DocumentPreview 
                    fileUrl={(previewModal.type === 'original' ? previewModal.item.original_file_url : previewModal.item.translated_file_url)!} 
                    fileName={previewModal.item.title || "Document"} 
                    className="w-full h-64 md:h-96" 
                  />
                  <a 
                    href={(previewModal.type === 'original' ? previewModal.item.original_file_url : previewModal.item.translated_file_url)!} 
                    target="_blank" rel="noopener noreferrer"
                    className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-full text-sm font-medium transition"
                  >
                    <Download className="w-4 h-4" /> Download File
                  </a>
                </div>
              )}

            </div>
          </div>
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
