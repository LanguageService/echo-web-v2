"use client";

import React, { useState } from "react";
import { FileText, ExternalLink, Play, FileSpreadsheet } from "lucide-react";

interface DocumentPreviewProps {
  fileUrl?: string;
  fileType?: string; // e.g., 'pdf', 'docx', 'xlsx', 'txt', 'audio'
  fileName?: string;
  className?: string;
}

export default function DocumentPreview({ fileUrl, fileType, fileName = "Document", className = "" }: DocumentPreviewProps) {
  const [error, setError] = useState(false);

  if (!fileUrl) {
    return (
      <div className={`flex flex-col items-center justify-center gap-2 p-6 bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 ${className}`}>
        <FileText className="w-8 h-8 text-gray-400" />
        <span className="text-gray-500 text-sm">No preview available</span>
      </div>
    );
  }

  // Guess the file type from URL if not provided
  let type = fileType?.toLowerCase();
  if (!type && fileUrl) {
    const ext = fileUrl.split('.').pop()?.toLowerCase();
    if (ext === 'pdf') type = 'pdf';
    else if (['doc', 'docx'].includes(ext || '')) type = 'docx';
    else if (['xls', 'xlsx', 'csv'].includes(ext || '')) type = 'spreadsheet';
    else if (['txt'].includes(ext || '')) type = 'txt';
    else if (['mp3', 'wav', 'ogg'].includes(ext || '')) type = 'audio';
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
          <audio controls src={fileUrl} className="w-full max-w-sm" onError={() => setError(true)}>
            Your browser does not support the audio element.
          </audio>
        </div>
      );
    }

    if (type === 'pdf' || type === 'txt') {
      return (
        <iframe
          src={fileUrl}
          className="w-full h-full border-0 rounded-lg"
          title={fileName}
          onError={() => setError(true)}
        />
      );
    }

    if (type === 'docx' || type === 'spreadsheet') {
      // Use Google Docs Viewer for Word and Excel
      const viewerUrl = `https://docs.google.com/gview?url=${encodeURIComponent(fileUrl)}&embedded=true`;
      return (
        <iframe
          src={viewerUrl}
          className="w-full h-full border-0 rounded-lg"
          title={fileName}
          onError={() => setError(true)}
        />
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
    </div>
  );
}
