"use client";

import { useRouter } from "next/navigation";
import { Home, ArrowLeft } from "lucide-react";

export default function NotFound() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 to-yellow-50 flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <div className="mb-8">
          <h1 className="text-9xl font-bold text-[#F79009] mb-4">404</h1>
          <h2 className="text-2xl font-semibold text-[#0C141D] mb-2">
            Page Not Found
          </h2>
          <p className="text-gray-500">
            The page you're looking for doesn't exist or has been moved.
          </p>
        </div>

        <div className="space-y-3">
          <button
            onClick={() => router.back()}
            className="w-full flex items-center justify-center gap-2 py-3 px-6 bg-[#F79009] text-white rounded-full font-semibold hover:bg-[#E68200] transition"
          >
            <ArrowLeft size={20} />
            Go Back
          </button>

          <button
            onClick={() => router.push("/")}
            className="w-full flex items-center justify-center gap-2 py-3 px-6 border border-[#F79009] text-[#F79009] rounded-full font-semibold hover:bg-[#F79009] hover:text-white transition"
          >
            <Home size={20} />
            Go Home
          </button>
        </div>
      </div>
    </div>
  );
}
