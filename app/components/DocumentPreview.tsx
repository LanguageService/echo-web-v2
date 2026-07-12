"use client";

import dynamic from "next/dynamic";
import { FileText, Loader2 } from "lucide-react";

// Dynamically import the actual previewer client with SSR disabled.
// This prevents Next.js from throwing DOMMatrix / react-pdf errors during server-side prerendering.
const DocumentPreviewClient = dynamic(() => import("./DocumentPreviewClient"), {
  ssr: false,
  loading: () => (
    <div className="flex flex-col items-center justify-center w-full h-64 bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 gap-2 text-gray-500">
      <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
      <span className="text-sm">Loading previewer...</span>
    </div>
  ),
});

interface DocumentPreviewProps {
  fileUrl?: string;
  fileType?: string;
  fileName?: string;
  className?: string;
}

export default function DocumentPreview(props: DocumentPreviewProps) {
  return <DocumentPreviewClient {...props} />;
}
