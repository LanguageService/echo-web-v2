"use client";

import { useRouter } from "next/navigation";
import { Check } from "lucide-react";

export default function SuccessPage() {
  const router = useRouter();

  const handleContinue = () => {
    router.push("/dashboard/profile");
  };

  return (
    <main className="min-h-screen bg-[#F1F1F1] flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white rounded-2xl p-8 shadow text-center">
        <div className="flex justify-center mb-6">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
            <Check className="w-10 h-10 text-green-600" />
          </div>
        </div>

        <h2 className="text-xl font-semibold mb-2">Verification Successful!</h2>

        <p className="text-gray-500 text-sm">
          Your account has been verified successfully. Next, tell us how you'll
          use Echo.
        </p>

        <button
          onClick={handleContinue}
          className="w-full mt-6 py-3 bg-[#F2C48D] rounded-full text-white font-semibold hover:opacity-90 transition"
        >
          Continue
        </button>
      </div>
    </main>
  );
}
