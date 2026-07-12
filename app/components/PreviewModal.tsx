"use client";

import React, { useEffect } from "react";
import { X, Download } from "lucide-react";
import DocumentPreview from "./DocumentPreview";

interface PreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  fileUrl: string;
  fileName: string;
  fileType?: string;
  onDownload?: () => void;
}

export default function PreviewModal({ isOpen, onClose, fileUrl, fileName, fileType, onDownload }: PreviewModalProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 sm:p-6 animate-in fade-in duration-200">
      <div className="relative flex flex-col w-full max-w-5xl h-[90vh] bg-white dark:bg-gray-900 rounded-2xl shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-900/50">
          <h3 className="font-semibold text-gray-800 dark:text-gray-200 truncate pr-4 text-lg">
            {fileName}
          </h3>
          <div className="flex items-center gap-2">
            {onDownload && (
              <button
                onClick={onDownload}
                className="p-2 hover:bg-gray-200 dark:hover:bg-gray-800 rounded-full transition text-gray-600 dark:text-gray-400"
                title="Download"
              >
                <Download className="w-5 h-5" />
              </button>
            )}
            <button
              onClick={onClose}
              className="p-2 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-full transition text-gray-500 hover:text-red-600 dark:text-gray-400 dark:hover:text-red-400"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto bg-gray-100 dark:bg-gray-950 p-4 sm:p-8">
          <div className="mx-auto w-full max-w-4xl bg-white dark:bg-gray-900 shadow-sm rounded-xl overflow-hidden h-full min-h-[60vh]">
            <DocumentPreview 
              fileUrl={fileUrl} 
              fileName={fileName} 
              fileType={fileType} 
              className="w-full h-full border-0 !rounded-none" 
            />
          </div>
        </div>
      </div>
    </div>
  );
}
