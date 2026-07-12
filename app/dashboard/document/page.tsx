"use client";

import { useState, useEffect } from "react";
import { FileText, Upload, X, Download, ArrowRight, CheckCircle, Loader2, ChevronDown, ChevronUp, FileSpreadsheet, Clock, Eye } from "lucide-react";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import { hasSufficientBalance, fetchTextTranslationDetails, fetchDocumentHistory, type Language, type TranslationHistory } from "@/lib/api";
import NoFundsModal from "@/components/NoFundsModal";
import DocumentPreview from "@/components/DocumentPreview";
import PreviewModal from "@/components/PreviewModal";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/useToast";

type TranslationStatus = "idle" | "uploading" | "processing" | "done" | "error";

interface DocumentResult {
  translated_file_url: string;
  original_file_url?: string;
  original_text: string;
  translated_text: string;
  original_language_name: string;
  target_language_name: string;
  total_processing_time: number;
}

export default function DocumentTranslationPage() {
  const router = useRouter();
  const [previewData, setPreviewData] = useState<{ isOpen: boolean; url: string; name: string } | null>(null);
  const { toast, toasts } = useToast();
  const [file, setFile] = useState<File | null>(null);
  const [fileUrl, setFileUrl] = useState<string>("");
  const [dragOver, setDragOver] = useState(false);
  const [status, setStatus] = useState<TranslationStatus>("idle");
  const [result, setResult] = useState<DocumentResult | null>(null);
  const [history, setHistory] = useState<TranslationHistory[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [showNoFunds, setShowNoFunds] = useState(false);
  const [selectedLanguages, setSelectedLanguages] = useState<{ input: Language | null; output: Language | null }>({ input: null, output: null });
  const [showFormats, setShowFormats] = useState(false);
  const [translationId, setTranslationId] = useState<string | null>(null);

  const ACCEPTED_TYPES = [
    "application/pdf", 
    "application/msword", 
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document", 
    "text/plain",
    "application/vnd.ms-excel",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    "text/csv"
  ];
  const ACCEPTED_EXTENSIONS = ".pdf, .doc, .docx, .txt, .xls, .xlsx, .csv";
  const MAX_SIZE_MB = 10;

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    try {
      const historyData = await fetchDocumentHistory();
      const items = Array.isArray(historyData) ? historyData : ((historyData as any).results ?? []);
      setHistory(items);
    } catch (error) {
      console.error("Failed to load history:", error);
    }
  };

  useEffect(() => {
    // Poll history every 5 seconds to update statuses
    const intervalId = setInterval(() => {
      loadHistory();
    }, 5000);
    return () => clearInterval(intervalId);
  }, []);

  const handleFile = (selected: File) => {
    if (!ACCEPTED_TYPES.includes(selected.type) && !selected.name.endsWith('.csv')) {
      setError("Unsupported file type. Please upload a PDF, DOC, DOCX, TXT, XLS, XLSX, or CSV file.");
      return;
    }
    if (selected.size > MAX_SIZE_MB * 1024 * 1024) {
      setError(`File size exceeds ${MAX_SIZE_MB}MB limit.`);
      return;
    }
    setError(null);
    setFile(selected);
    setFileUrl("");
    setResult(null);
    setStatus("idle");
    setTranslationId(null);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const dropped = e.dataTransfer.files[0];
    if (dropped) handleFile(dropped);
  };

  const handleTranslate = async () => {
    if ((!file && !fileUrl.trim()) || !selectedLanguages.input || !selectedLanguages.output) return;
    const sufficient = await hasSufficientBalance();
    if (!sufficient) { setShowNoFunds(true); return; }
    setStatus("uploading");
    setError(null);
    try {
      const token = localStorage.getItem("token");
      
      let finalFileUrl = fileUrl.trim();

      if (file && !finalFileUrl) {
        // 1. Get presigned URL
        const presignRes = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/translations/text/presigned-url/`, {
          method: "POST",
          headers: { 
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            file_name: file.name,
            file_type: "document",
            content_type: file.type
          })
        });
        
        if (!presignRes.ok) {
          let errorMsg = `Failed to get upload URL: ${presignRes.status}`;
          try {
            const errData = await presignRes.json();
            errorMsg = errData.error || errData.detail || errorMsg;
          } catch (_) {}
          throw new Error(errorMsg);
        }
        const presignData = await presignRes.json();
        
        // 2. Upload directly to cloud storage
        let uploadResponse;
        if (presignData.upload_method === "PUT") {
          uploadResponse = await fetch(presignData.upload_url, {
            method: "PUT",
            headers: { "Content-Type": file.type },
            body: file
          });
        } else {
          const uploadForm = new FormData();
          Object.entries(presignData.fields || {}).forEach(([key, value]) => {
            uploadForm.append(key, value as string);
          });
          uploadForm.append("file", file);
          uploadResponse = await fetch(presignData.upload_url, {
            method: "POST",
            body: uploadForm
          });
        }
        
        if (!uploadResponse.ok) throw new Error(`Cloud upload failed: ${uploadResponse.status}`);
        
        if (presignData.upload_method === "POST") {
          try {
            const cloudData = await uploadResponse.json();
            finalFileUrl = cloudData.secure_url || presignData.file_url;
          } catch (e) {
            finalFileUrl = presignData.file_url;
          }
        } else {
          finalFileUrl = presignData.file_url;
        }
      }
      
      // 3. Inform backend
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/translations/text/document/`, {
        method: "POST",
        headers: { 
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          original_file_url: finalFileUrl,
          source_language: selectedLanguages.input.code,
          target_language: selectedLanguages.output.code,
        }),
      });

      if (!response.ok) {
        let errorMsg = `Translation failed: ${response.status}`;
        try {
          const errData = await response.json();
          errorMsg = errData.error || errData.detail || errorMsg;
        } catch (_) {}
        throw new Error(errorMsg);
      }
      const data = await response.json();
      if (data.translation_id) {
        toast("Document processing initiated in the background");
        loadHistory();
        resetPage();
      } else {
        setResult(data);
        setStatus("done");
      }
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Document translation failed. Please try again.");
      setStatus("error");
    }
  };

  const resetPage = () => { setFile(null); setFileUrl(""); setResult(null); setStatus("idle"); setError(null); setTranslationId(null); };

  const handleDownload = async (url: string, filename: string) => {
    try {
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

  return (
    <div className="p-4 sm:p-6 space-y-6 max-w-4xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Document Translation</h1>
        <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
          Upload a document and we'll translate it while preserving the formatting.
        </p>
      </div>

      <LanguageSwitcher onLanguageChange={(input, output) => setSelectedLanguages({ input, output })} />

      {!result && (
        <div
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          className={`relative border-2 border-dashed rounded-2xl p-10 text-center transition-colors ${dragOver ? "border-orange-400 bg-orange-50 dark:bg-orange-900/20"
            : file ? "border-green-400 bg-green-50 dark:bg-green-900/20"
              : "border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800 hover:border-orange-300 hover:bg-orange-50 dark:hover:bg-orange-900/10"
            }`}
        >
          {(file || fileUrl.trim()) ? (
            <div className="flex flex-col items-center gap-3">
              <FileText className="w-12 h-12 text-green-500" />
              {file ? (
                <>
                  <p className="font-semibold text-gray-800 dark:text-white">{file.name}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                </>
              ) : (
                <p className="font-semibold text-gray-800 dark:text-white break-all max-w-full px-4">{fileUrl}</p>
              )}
              <button onClick={resetPage} className="flex items-center gap-1 text-sm text-red-500 hover:text-red-600">
                <X className="w-4 h-4" /> Remove {file ? "file" : "URL"}
              </button>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-3">
              <Upload className="w-12 h-12 text-gray-400 dark:text-gray-500" />
              <p className="font-semibold text-gray-700 dark:text-gray-300">Drag & drop your document here</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">or</p>
              <label className="cursor-pointer bg-orange-500 hover:bg-orange-600 text-white px-5 py-2 rounded-full text-sm font-semibold transition">
                Browse File
                <input type="file" accept={ACCEPTED_EXTENSIONS} className="hidden" onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])} />
              </label>
              <div className="mt-4 w-full max-w-sm text-left">
                <button 
                  onClick={() => setShowFormats(!showFormats)}
                  className="flex items-center justify-center gap-2 w-full text-xs text-gray-500 dark:text-gray-400 font-medium py-2 px-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700/50 transition-colors cursor-pointer"
                >
                  <span>Supported File Formats & Limits</span>
                  {showFormats ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                </button>
                {showFormats && (
                  <div className="mt-2 p-3 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm text-xs text-gray-600 dark:text-gray-300">
                    <ul className="space-y-2">
                      <li className="flex items-center gap-2"><FileText size={14} className="text-orange-500" /> <strong>PDF Documents</strong> (.pdf)</li>
                      <li className="flex items-center gap-2"><FileText size={14} className="text-blue-500" /> <strong>Word Documents</strong> (.doc, .docx)</li>
                      <li className="flex items-center gap-2"><FileSpreadsheet size={14} className="text-green-600" /> <strong>Spreadsheets</strong> (.csv, .xls, .xlsx)</li>
                      <li className="flex items-center gap-2"><FileText size={14} className="text-gray-500" /> <strong>Plain Text</strong> (.txt)</li>
                      <li className="mt-3 pt-2 border-t border-gray-200 dark:border-gray-600 text-gray-500 dark:text-gray-400">
                        Maximum file size: <strong>{MAX_SIZE_MB}MB</strong>
                      </li>
                    </ul>
                  </div>
                )}
              </div>
              <div className="mt-4 w-full max-w-sm flex flex-col gap-2">
                <div className="flex items-center justify-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                  <span className="h-px bg-gray-300 dark:bg-gray-600 flex-1"></span>
                  <span>OR PROVIDE URL</span>
                  <span className="h-px bg-gray-300 dark:bg-gray-600 flex-1"></span>
                </div>
                <div className="flex gap-2 mt-1">
                  <input
                    type="url"
                    placeholder="https://example.com/document.pdf"
                    value={fileUrl}
                    onChange={(e) => setFileUrl(e.target.value)}
                    className="flex-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-sm text-gray-800 dark:text-white focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none"
                  />
                  {fileUrl.trim() && (
                    <button 
                      onClick={() => { setFile(null); setStatus("idle"); }} 
                      className="bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 px-3 py-2 rounded-lg text-sm text-gray-700 dark:text-gray-300 transition"
                    >
                      Use URL
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700 text-red-600 dark:text-red-400 rounded-xl px-4 py-3 text-sm">
          {error}
        </div>
      )}

      {!result && (
        <div className="flex justify-center">
          <button
            onClick={handleTranslate}
            disabled={(!file && !fileUrl.trim()) || !selectedLanguages.input || !selectedLanguages.output || status === "uploading" || status === "processing"}
            className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 disabled:bg-gray-300 dark:disabled:bg-gray-700 text-white px-8 py-3 rounded-full font-semibold transition"
          >
            {status === "uploading" || status === "processing" ? (
              <><Loader2 className="w-4 h-4 animate-spin" />{status === "uploading" ? "Uploading..." : "Translating..."}</>
            ) : (
              <><FileText className="w-4 h-4" />Translate Document</>
            )}
          </button>
        </div>
      )}

      {result && status === "done" && (
        <div className="bg-white dark:bg-gray-900 border border-[#b9ced5] dark:border-gray-700 rounded-2xl p-6 space-y-6">
          <div className="flex items-center gap-3">
            <CheckCircle className="w-6 h-6 text-green-500" />
            <h2 className="text-lg font-semibold text-gray-800 dark:text-white">Translation Complete</h2>
          </div>

          <div className="flex items-center gap-3 text-sm text-gray-500 dark:text-gray-400">
            <span className="bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 px-3 py-1 rounded-full font-medium">
              {result.original_language_name}
            </span>
            <ArrowRight className="w-4 h-4" />
            <span className="bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-300 px-3 py-1 rounded-full font-medium">
              {result.target_language_name}
            </span>
            {/* <span className="ml-auto text-xs text-gray-400 dark:text-gray-500">
              {(result.total_processing_time ?? 0).toFixed(2)}s processing time
            </span> */}
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <h4 className="font-semibold text-gray-700 dark:text-gray-300 text-sm">Original</h4>
              {result.original_text ? (
                <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700/50 rounded-xl p-4 max-h-48 overflow-y-auto">
                  <p className="text-sm text-gray-800 dark:text-gray-200 leading-relaxed whitespace-pre-wrap">{result.original_text}</p>
                </div>
              ) : (
                <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700/50 rounded-xl p-4 flex flex-col items-center justify-center gap-2">
                  <DocumentPreview fileUrl={result.original_file_url} fileName="Original Document" className="w-full h-48" />
                  {result.original_file_url && (
                    <div className="flex items-center gap-4 mt-2">
                      <button onClick={() => setPreviewData({ isOpen: true, url: result.original_file_url!, name: file?.name ? `original_${file.name}` : "Original_Document" })} className="text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 text-sm font-medium flex items-center gap-1"><Eye size={14} /> Preview</button>
                      <button onClick={() => handleDownload(result.original_file_url!, file?.name ? `original_${file.name}` : "Original_Document")} className="text-blue-600 hover:underline text-sm font-medium flex items-center gap-1"><Download size={14} /> Download</button>
                    </div>
                  )}
                </div>
              )}
            </div>
            <div className="space-y-2">
              <h4 className="font-semibold text-gray-700 dark:text-gray-300 text-sm">Translation</h4>
              {result.translated_text ? (
                <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-700/50 rounded-xl p-4 max-h-48 overflow-y-auto">
                  <p className="text-sm text-gray-800 dark:text-gray-200 leading-relaxed whitespace-pre-wrap">{result.translated_text}</p>
                </div>
              ) : (
                <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-700/50 rounded-xl p-4 flex flex-col items-center justify-center gap-2">
                  <DocumentPreview fileUrl={result.translated_file_url} fileName="Translated Document" className="w-full h-48" />
                  {result.translated_file_url && (
                    <div className="flex items-center gap-4 mt-2">
                      <button onClick={() => setPreviewData({ isOpen: true, url: result.translated_file_url, name: file?.name ? `translated_${file.name}` : "Translated_Document" })} className="text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 text-sm font-medium flex items-center gap-1"><Eye size={14} /> Preview</button>
                      <button onClick={() => handleDownload(result.translated_file_url, file?.name ? `translated_${file.name}` : "Translated_Document")} className="text-green-600 hover:underline text-sm font-medium flex items-center gap-1"><Download size={14} /> Download</button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            {result.translated_file_url && (
              <>
                <button onClick={() => setPreviewData({ isOpen: true, url: result.translated_file_url, name: file?.name ? `translated_${file.name}` : "Translated_Document" })} className="flex items-center justify-center gap-2 bg-gray-200 hover:bg-gray-300 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-800 dark:text-white px-6 py-3 rounded-full font-semibold transition">
                  <Eye className="w-4 h-4" /> Preview
                </button>
                <button onClick={() => handleDownload(result.translated_file_url, file?.name ? `translated_${file.name}` : "Translated_Document")} className="flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-full font-semibold transition">
                  <Download className="w-4 h-4" /> Download
                </button>
              </>
            )}
            <button onClick={resetPage} className="flex items-center justify-center gap-2 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300 px-6 py-3 rounded-full font-semibold transition">
              Translate Another Document
            </button>
          </div>
        </div>
      )}

      {/* Translation History */}
      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-[#b9ced5] dark:border-gray-700 p-4 sm:p-6 mt-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold text-gray-800 dark:text-white">Recent Documents</h3>
          <button
            onClick={() => router.push("/dashboard/document/history")}
            className="cursor-pointer flex items-center gap-2 text-orange-500 hover:text-orange-600 font-medium"
          >
            View All <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {history.length === 0 ? (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            <Clock className="w-12 h-12 mx-auto mb-4 text-gray-300 dark:text-gray-600" />
            <p>No document translations yet</p>
            <p className="text-sm">Your translation history will appear here</p>
          </div>
        ) : (
          <div className="space-y-4">
            {history.slice(0, 3).map((item) => (
              <div key={item.id} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 hover:border-orange-500 dark:hover:border-orange-500 transition-colors">
                <div className="flex items-center gap-4 flex-1 min-w-0 pr-4">
                  <div className="p-3 bg-white dark:bg-gray-700 rounded-lg shadow-sm border border-gray-100 dark:border-gray-600 shrink-0">
                    <FileText className="w-6 h-6 text-orange-500" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h4 className="font-medium text-gray-800 dark:text-white truncate">{item.title || "Document Translation"}</h4>
                    <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mt-1">
                      <span>{item.original_language_name || item.original_language}</span>
                      <ArrowRight className="w-3 h-3" />
                      <span>{item.target_language_name || item.target_language}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    item.status === "COMPLETED" ? "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400" :
                    item.status === "FAILED" ? "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400" :
                    "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-400"
                  }`}>
                    {item.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <NoFundsModal isOpen={showNoFunds} onClose={() => setShowNoFunds(false)} />

      {previewData && (
        <PreviewModal 
          isOpen={previewData.isOpen} 
          onClose={() => setPreviewData(null)} 
          fileUrl={previewData.url} 
          fileName={previewData.name} 
          onDownload={() => handleDownload(previewData.url, previewData.name)}
        />
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
