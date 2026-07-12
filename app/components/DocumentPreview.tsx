"use client";

import React, { useState, useEffect } from "react";
import { FileText, ExternalLink, Play, Loader2 } from "lucide-react";
import * as mammoth from "mammoth";
import * as XLSX from "xlsx";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";

// Configure pdfjs worker
if (typeof window !== "undefined") {
  pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.mjs`;
}

interface DocumentPreviewProps {
  fileUrl?: string;
  fileType?: string; // e.g., 'pdf', 'docx', 'xlsx', 'txt', 'audio'
  fileName?: string;
  className?: string;
}

export default function DocumentPreview({ fileUrl, fileType, fileName = "Document", className = "" }: DocumentPreviewProps) {
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);
  const [htmlContent, setHtmlContent] = useState<string | null>(null);
  const [numPages, setNumPages] = useState<number | null>(null);

  // Guess the file type from URL if not provided
  let type = fileType?.toLowerCase();
  if (!type && fileUrl) {
    const ext = fileUrl.split('.').pop()?.toLowerCase() || '';
    if (ext === 'pdf' || fileUrl.includes('.pdf?')) type = 'pdf';
    else if (['doc', 'docx'].includes(ext) || fileUrl.includes('.docx?')) type = 'docx';
    else if (['xls', 'xlsx', 'csv'].includes(ext) || fileUrl.includes('.xlsx?') || fileUrl.includes('.csv?')) type = 'spreadsheet';
    else if (['txt'].includes(ext) || fileUrl.includes('.txt?')) type = 'txt';
    else if (['mp3', 'wav', 'ogg', 'm4a'].includes(ext)) type = 'audio';
  }

  useEffect(() => {
    if (!fileUrl) return;

    let isMounted = true;
    setLoading(true);
    setError(false);
    setHtmlContent(null);

    const loadContent = async () => {
      try {
        if (type === 'docx') {
          const response = await fetch(fileUrl);
          const arrayBuffer = await response.arrayBuffer();
          const result = await mammoth.convertToHtml({ arrayBuffer });
          if (isMounted) setHtmlContent(result.value);
        } else if (type === 'spreadsheet' || type === 'csv') {
          const response = await fetch(fileUrl);
          const arrayBuffer = await response.arrayBuffer();
          const workbook = XLSX.read(arrayBuffer, { type: "array" });
          const firstSheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[firstSheetName];
          // Use inline styling for tables
          const html = XLSX.utils.sheet_to_html(worksheet, { id: "data-table" });
          if (isMounted) setHtmlContent(html);
        } else if (type === 'txt') {
          const response = await fetch(fileUrl);
          const text = await response.text();
          if (isMounted) setHtmlContent(`<pre style="white-space: pre-wrap; font-family: inherit;">${text}</pre>`);
        } else {
          // pdf and audio do not need fetching here
          if (isMounted) setLoading(false);
        }
      } catch (err) {
        console.error("Error loading document:", err);
        if (isMounted) setError(true);
      } finally {
        if (type !== 'pdf' && type !== 'audio') {
          if (isMounted) setLoading(false);
        }
      }
    };

    loadContent();

    return () => {
      isMounted = false;
    };
  }, [fileUrl, type]);

  if (!fileUrl) {
    return (
      <div className={`flex flex-col items-center justify-center gap-2 p-6 bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 ${className}`}>
        <FileText className="w-8 h-8 text-gray-400" />
        <span className="text-gray-500 text-sm">No preview available</span>
      </div>
    );
  }

  const renderPreview = () => {
    if (error) {
      return (
        <div className="flex flex-col items-center justify-center h-full gap-2 text-gray-500">
          <FileText className="w-8 h-8" />
          <span className="text-sm">Preview could not be loaded.</span>
          <a href={fileUrl} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline text-sm flex items-center gap-1 mt-2">
            Open in new tab <ExternalLink className="w-4 h-4" />
          </a>
        </div>
      );
    }

    if (type === 'audio') {
      return (
        <div className="flex flex-col items-center justify-center h-full gap-4 p-4">
          <Play className="w-12 h-12 text-orange-500" />
          <audio controls src={fileUrl} className="w-full max-w-sm" onError={() => setError(true)} onCanPlay={() => setLoading(false)}>
            Your browser does not support the audio element.
          </audio>
        </div>
      );
    }

    if (type === 'pdf') {
      return (
        <div className="w-full h-full overflow-auto flex flex-col items-center bg-gray-200 dark:bg-gray-800 p-4">
          <Document
            file={fileUrl}
            onLoadSuccess={({ numPages }) => { setNumPages(numPages); setLoading(false); }}
            onLoadError={(err) => { console.error("PDF load error:", err); setError(true); setLoading(false); }}
            loading={<div className="flex items-center gap-2"><Loader2 className="animate-spin w-5 h-5 text-gray-500" /> Loading PDF...</div>}
            className="flex flex-col gap-4"
          >
            {Array.from(new Array(numPages || 0), (el, index) => (
              <Page 
                key={`page_${index + 1}`} 
                pageNumber={index + 1} 
                renderTextLayer={true}
                renderAnnotationLayer={true}
                className="shadow-md rounded bg-white"
                width={800} // or dynamically scale
              />
            ))}
          </Document>
        </div>
      );
    }

    if (htmlContent !== null) {
      return (
        <div className="w-full h-full overflow-auto bg-white p-6 sm:p-8 text-gray-800 document-preview-content">
          <div dangerouslySetInnerHTML={{ __html: htmlContent }} />
        </div>
      );
    }

    if (loading) {
      return (
        <div className="flex flex-col items-center justify-center h-full gap-2 text-gray-500">
          <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
          <span className="text-sm">Loading document...</span>
        </div>
      );
    }

    // Fallback for unknown types
    return (
      <div className="flex flex-col items-center justify-center h-full gap-4">
        <FileText className="w-12 h-12 text-blue-500" />
        <a
          href={fileUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="bg-blue-100 text-blue-700 px-4 py-2 rounded-lg font-medium hover:bg-blue-200 transition flex items-center gap-2"
        >
          Download / View Original <ExternalLink className="w-4 h-4" />
        </a>
      </div>
    );
  };

  return (
    <div className={`relative w-full h-64 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden ${className}`}>
      {renderPreview()}
      <style dangerouslySetInnerHTML={{__html: `
        .document-preview-content table { border-collapse: collapse; width: 100%; margin-bottom: 1rem; font-size: 0.875rem; }
        .document-preview-content th, .document-preview-content td { border: 1px solid #e5e7eb; padding: 0.5rem; text-align: left; }
        .document-preview-content th { background-color: #f9fafb; font-weight: 600; }
        .document-preview-content p { margin-bottom: 0.75rem; line-height: 1.5; }
        .document-preview-content h1, .document-preview-content h2, .document-preview-content h3 { font-weight: bold; margin-top: 1.5rem; margin-bottom: 0.75rem; }
        .document-preview-content h1 { font-size: 1.5rem; }
        .document-preview-content h2 { font-size: 1.25rem; }
      `}} />
    </div>
  );
}
