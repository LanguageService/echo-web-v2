"use client";

import { useRouter } from "next/navigation";
import { X } from "lucide-react";

export default function FailPage() {
  const router = useRouter();

  return (
    <main className="min-h-screen bg-gray-100 dark:bg-gray-950 flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white dark:bg-gray-900 rounded-2xl p-8 shadow border dark:border-gray-700 text-center">
        <div className="flex justify-center mb-6">
          <div className="w-20 h-20 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center">
            <X className="w-10 h-10 text-red-600 dark:text-red-400" />
          </div>
        </div>

        <h2 className="text-xl font-semibold mb-2 dark:text-white">Verification Failed</h2>
        <p className="text-gray-500 dark:text-gray-400 text-sm mb-6">
          The OTP you entered is not correct. Please check your email and try again.
        </p>

        <div className="space-y-3">
          <button
            onClick={() => router.push("/verify-otp")}
            className="w-full py-3 bg-[#F2C48D] rounded-full text-white font-semibold hover:opacity-90 transition"
          >
            Try Again
          </button>
          <button
            onClick={() => router.push("/signup")}
            className="w-full py-3 border border-gray-300 dark:border-gray-600 rounded-full text-gray-700 dark:text-gray-300 font-semibold hover:bg-gray-50 dark:hover:bg-gray-800 transition"
          >
            Back to Sign Up
          </button>
        </div>
      </div>
    </main>
  );
}
