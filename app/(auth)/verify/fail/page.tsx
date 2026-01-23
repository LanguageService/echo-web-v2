"use client";

import { useRouter } from "next/navigation";
import { X } from "lucide-react";

export default function FailPage() {
  const router = useRouter();

  const handleTryAgain = () => {
    router.push("/verify-otp");
  };

  const handleBackToSignup = () => {
    router.push("/signup");
  };

  return (
    <main className="min-h-screen bg-[#F1F1F1] flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white rounded-2xl p-8 shadow text-center">
        <div className="flex justify-center mb-6">
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center">
            <X className="w-10 h-10 text-red-600" />
          </div>
        </div>

        <h2 className="text-xl font-semibold mb-2">Verification Failed</h2>

        <p className="text-gray-500 text-sm mb-6">
          The OTP you entered is not correct. Please check your email and try
          again.
        </p>

        <div className="space-y-3">
          <button
            onClick={handleTryAgain}
            className="w-full py-3 bg-[#F2C48D] rounded-full text-white font-semibold hover:opacity-90 transition"
          >
            Try Again
          </button>

          <button
            onClick={handleBackToSignup}
            className="w-full py-3 border border-gray-300 rounded-full text-gray-700 font-semibold hover:bg-gray-50 transition"
          >
            Back to Sign Up
          </button>
        </div>
      </div>
    </main>
  );
}
