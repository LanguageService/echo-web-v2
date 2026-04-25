"use client";

import { useState } from "react";
import { FileText, Upload, X, Download, ArrowRight, CheckCircle, Loader2 } from "lucide-react";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import { type Language } from "@/lib/api";

type TranslationStatus = "idle" | "uploading" | "processing" | "done" | "error";

interface DocumentResult {
  translated_file_url: string;
  original_text: string;
  translated_text: string;
  original_language_name: string;
  target_language_name: string;
  total_processing_time: number;
}

export default function DocumentTranslationPage() {
  const [file, setFile] = useState<File | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const [status, setStatus] = useState<TranslationStatus>("idle");
  const [result, setResult] = useState<DocumentResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [selectedLanguages, setSelectedLanguages] = useState<{ input: Language | null; output: Language | null }>({ input: null, output: null });

  const ACCEPTED_TYPES = ["application/pdf", "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document", "text/plain"];
  const ACCEPTED_EXTENSIONS = ".pdf, .doc, .docx, .txt";
  const MAX_SIZE_MB = 10;

  const handleFile = (selected: File) => {
    if (!ACCEPTED_TYPES.includes(selected.type)) {
      setError("Unsupported file type. Please upload a PDF, DOC, DOCX, or TXT file.");
      return;
    }
    if (selected.size > MAX_SIZE_MB * 1024 * 1024) {
      setError(`File size exceeds ${MAX_SIZE_MB}MB limit.`);
      return;
    }
    setError(null);
    setFile(selected);
    setResult(null);
    setStatus("idle");
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const dropped = e.dataTransfer.files[0];
    if (dropped) handleFile(dropped);
  };

  const handleTranslate = async () => {
    if (!file || !selectedLanguages.input || !selectedLanguages.output) return;
    setStatus("uploading");
    setError(null);
    try {
      const formData = new FormData();
      formData.append("document_file", file);
      formData.append("source_language", selectedLanguages.input.code);
      formData.append("target_language", selectedLanguages.output.code);
      const token = localStorage.getItem("token");
      setStatus("processing");
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/translations/document/base/`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });
      if (!response.ok) throw new Error(`Translation failed: ${response.status}`);
      const data = await response.json();
      setResult(data);
      setStatus("done");
    } catch {
      setError("Document translation failed. Please try again.");
      setStatus("error");
    }
  };

  const resetPage = () => { setFile(null); setResult(null); setStatus("idle"); setError(null); };

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
          {file ? (
            <div className="flex flex-col items-center gap-3">
              <FileText className="w-12 h-12 text-green-500" />
              <p className="font-semibold text-gray-800 dark:text-white">{file.name}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
              <button onClick={resetPage} className="flex items-center gap-1 text-sm text-red-500 hover:text-red-600">
                <X className="w-4 h-4" /> Remove file
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
              <p className="text-xs text-gray-400 dark:text-gray-500 mt-2">
                Supported: PDF, DOC, DOCX, TXT · Max {MAX_SIZE_MB}MB
              </p>
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
            disabled={!file || !selectedLanguages.input || !selectedLanguages.output || status === "uploading" || status === "processing"}
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
            <span className="ml-auto text-xs text-gray-400 dark:text-gray-500">
              {(result.total_processing_time ?? 0).toFixed(2)}s processing time
            </span>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <h4 className="font-semibold text-gray-700 dark:text-gray-300 text-sm">Original</h4>
              <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700/50 rounded-xl p-4 max-h-48 overflow-y-auto">
                <p className="text-sm text-gray-800 dark:text-gray-200 leading-relaxed whitespace-pre-wrap">{result.original_text}</p>
              </div>
            </div>
            <div className="space-y-2">
              <h4 className="font-semibold text-gray-700 dark:text-gray-300 text-sm">Translation</h4>
              <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-700/50 rounded-xl p-4 max-h-48 overflow-y-auto">
                <p className="text-sm text-gray-800 dark:text-gray-200 leading-relaxed whitespace-pre-wrap">{result.translated_text}</p>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            {result.translated_file_url && (
              <a href={result.translated_file_url} download className="flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-full font-semibold transition">
                <Download className="w-4 h-4" /> Download Translated Document
              </a>
            )}
            <button onClick={resetPage} className="flex items-center justify-center gap-2 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300 px-6 py-3 rounded-full font-semibold transition">
              Translate Another Document
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
