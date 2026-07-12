"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { fetchDocumentHistory, toggleFavorite, type TranslationHistory } from "@/lib/api";
import { ArrowLeft, Clock, ArrowRight, Heart, FileText, Download, Eye } from "lucide-react";
import { useToast } from "@/hooks/useToast";
import DocumentPreview from "@/components/DocumentPreview";
import PreviewModal from "@/components/PreviewModal";

const btnClass = "border dark:border-gray-600 rounded-full px-4 py-2 flex items-center justify-center gap-2 text-sm font-medium transition-colors";

export default function DocumentHistoryPage() {
  const router = useRouter();
  const [history, setHistory] = useState<TranslationHistory[]>([]);
  const [loading, setLoading] = useState(true);
  const [previewData, setPreviewData] = useState<{ isOpen: boolean; url: string; name: string } | null>(null);
  const { toast, toasts } = useToast();

  useEffect(() => { loadHistory(); }, []);

  const loadHistory = async () => {
    try {
      const historyData = await fetchDocumentHistory();
      const items = Array.isArray(historyData) ? historyData : ((historyData as any).results ?? []);
      setHistory(items);
    } catch (error) {
      console.error("Failed to load history:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric", month: "long", day: "numeric",
      hour: "2-digit", minute: "2-digit",
    });

  const handleDownload = async (url: string, filename: string) => {
    try {
      // Show loading toast?
      const response = await fetch(url);
      if (!response.ok) throw new Error("Network response was not ok");
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = blobUrl;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(blobUrl);
    } catch (error) {
      console.error("Download failed:", error);
      window.open(url, "_blank"); // Fallback
    }
  };

  if (loading) {
    return (
      <div className="p-4 sm:p-6 max-w-7xl mx-auto">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/4" />
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-32 bg-gray-200 dark:bg-gray-700 rounded-xl" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  const getTranslatedFilename = (title: string | undefined) => {
    if (!title) return "Translated_Document";
    const parts = title.split('.');
    if (parts.length > 1) {
      const ext = parts.pop();
      return `${parts.join('.')}_translated.${ext}`;
    }
    return `${title}_translated`;
  };

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto">
      <div className="flex items-center gap-4 mb-6">
        <button onClick={() => router.back()} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition">
          <ArrowLeft className="w-5 h-5 dark:text-white" />
        </button>
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Document Translation History</h1>
      </div>

      {history.length === 0 ? (
        <div className="text-center py-12">
          <Clock className="w-16 h-16 mx-auto mb-4 text-gray-300 dark:text-gray-600" />
          <h3 className="text-lg font-semibold text-gray-600 dark:text-gray-400 mb-2">No documents yet</h3>
          <p className="text-gray-500 dark:text-gray-500">Start translating to build your history</p>
        </div>
      ) : (
        <div className="space-y-4">
          {history.map((item: any) => (
            <div key={item.id} className="bg-white dark:bg-gray-900 border border-[#b9ced5] dark:border-gray-700 rounded-xl p-4 sm:p-6 hover:shadow-md transition">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                <div className="flex items-center gap-3 flex-1 min-w-0 pr-4">
                  <div className="p-2 bg-gray-50 dark:bg-gray-800 rounded border border-gray-100 dark:border-gray-700 shrink-0">
                    <FileText className="w-5 h-5 text-orange-500" />
                  </div>
                  <h3 className="font-semibold text-gray-800 dark:text-white truncate">{item.title || "Document Translation"}</h3>
                  <span className={`shrink-0 px-2 py-1 text-xs rounded-full font-medium ${
                    item.status === 'COMPLETED' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' :
                    item.status === 'FAILED' ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' :
                    'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                  }`}>
                    {item.status}
                  </span>
                </div>
                <div className="flex flex-col sm:items-end gap-1">
                  <div className="flex items-center gap-2">
                    <button onClick={async () => {
                      const updated = await toggleFavorite(item.id);
                      setHistory(history.map((h: any) => h.id === item.id ? { ...h, is_favorite: updated } : h));
                      if(updated) toast("Added to favourites");
                    }} className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition">
                      <Heart className={`w-5 h-5 ${item.is_favorite ? "fill-red-500 text-red-500" : "text-gray-400 dark:text-gray-500"}`} />
                    </button>
                    <span className="text-sm text-gray-500 dark:text-gray-400">{formatDate(item.date_created)}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3 mb-6">
                <span className="text-sm bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 px-3 py-1 rounded-full font-medium">
                  {item.original_language_name || item.original_language}
                </span>
                <ArrowRight className="w-4 h-4 text-gray-400 dark:text-gray-500" />
                <span className="text-sm bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-300 px-3 py-1 rounded-full font-medium">
                  {item.target_language_name || item.target_language}
                </span>
              </div>

              <div className="grid lg:grid-cols-2 gap-4">
                <div className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 flex flex-col gap-4">
                  <div>
                    <h4 className="font-medium text-gray-700 dark:text-gray-300 text-sm mb-2">Original Document</h4>
                    {item.original_file_url ? (
                      <>
                        <DocumentPreview fileUrl={item.original_file_url} fileName="Original Document" className="w-full h-40 mb-3" />
                        <div className="flex flex-col sm:flex-row gap-2 w-full">
                          <button onClick={() => setPreviewData({ isOpen: true, url: item.original_file_url, name: item.title ? `${item.title} (Original)` : "Original Document" })} className={`${btnClass} flex-1 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 border-gray-200 dark:border-gray-700`}>
                            <Eye size={16} /> Preview
                          </button>
                          <button onClick={() => handleDownload(item.original_file_url, item.title ? `${item.title}_original` : "Original_Document")} className={`${btnClass} flex-1 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/30 border-blue-200 dark:border-blue-800`}>
                            <Download size={16} /> Download
                          </button>
                        </div>
                      </>
                    ) : (
                      <span className="text-sm text-gray-500">Not available</span>
                    )}
                  </div>
                </div>

                <div className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 flex flex-col gap-4">
                  <div>
                    <h4 className="font-medium text-gray-700 dark:text-gray-300 text-sm mb-2">Translated Document</h4>
                    {item.translated_file_url ? (
                      <>
                        <DocumentPreview fileUrl={item.translated_file_url} fileName="Translated Document" className="w-full h-40 mb-3" />
                        <div className="flex flex-col sm:flex-row gap-2 w-full">
                          <button onClick={() => setPreviewData({ isOpen: true, url: item.translated_file_url, name: getTranslatedFilename(item.title) })} className={`${btnClass} flex-1 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 border-gray-200 dark:border-gray-700`}>
                            <Eye size={16} /> Preview
                          </button>
                          <button onClick={() => handleDownload(item.translated_file_url, getTranslatedFilename(item.title))} className={`${btnClass} flex-1 text-green-600 dark:text-green-400 hover:bg-green-50 dark:hover:bg-green-900/30 border-green-200 dark:border-green-800`}>
                            <Download size={16} /> Download
                          </button>
                        </div>
                      </>
                    ) : item.status === "COMPLETED" && item.translated_text ? (
                      <span className="text-sm text-gray-500">Text only</span>
                    ) : (
                      <span className="text-sm text-gray-500">
                        {item.status === "FAILED" ? "Failed" : item.status === "PENDING" ? "Processing..." : "Not available"}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Show text blocks if they exist and are useful */}
              {(item.original_text || item.translated_text) && (
                <div className="grid lg:grid-cols-2 gap-4 mt-4">
                  {item.original_text && (
                    <div className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg max-h-40 overflow-y-auto border border-gray-100 dark:border-gray-700 text-sm text-gray-600 dark:text-gray-400 whitespace-pre-wrap">
                      {item.original_text}
                    </div>
                  )}
                  {item.translated_text && (
                    <div className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg max-h-40 overflow-y-auto border border-gray-100 dark:border-gray-700 text-sm text-gray-600 dark:text-gray-400 whitespace-pre-wrap">
                      {item.translated_text}
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
          <div className="fixed top-4 right-4 space-y-2 z-50">
            {toasts.map((message, index) => (
              <div key={index} className="bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg animate-fade-in">
                {message}
              </div>
            ))}
          </div>
        </div>
      )}

      {previewData && (
        <PreviewModal 
          isOpen={previewData.isOpen} 
          onClose={() => setPreviewData(null)} 
          fileUrl={previewData.url} 
          fileName={previewData.name} 
          onDownload={() => handleDownload(previewData.url, previewData.name)}
        />
      )}
    </div>
  );
}
