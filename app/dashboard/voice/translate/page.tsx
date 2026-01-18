"use client";

import { useSearchParams } from "next/navigation";
import Header from "@/components/Header";
import VoiceCard from "@/components/VoiceCard";
import RecentTranslations from "@/components/RecentTranslations";
import { Suspense } from "react";

function TranslatePage() {
  const searchParams = useSearchParams();

  const selectedLanguages = {
    input: {
      code: searchParams.get("inputLang") || "en",
      name: searchParams.get("inputName") || "English",
      native_name: searchParams.get("inputNative") || "English",
    },
    output: {
      code: searchParams.get("outputLang") || "rw",
      name: searchParams.get("outputName") || "Kinyarwanda",
      native_name: searchParams.get("outputNative") || "Ikinyarwanda",
    },
  };
  return (
    <>
      {/* <Header /> */}

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 py-8 sm:py-12">
        <div className="flex flex-col md:flex-row gap-6 md:gap-8">
          <VoiceCard selectedLanguages={selectedLanguages} />
          <RecentTranslations />
        </div>
      </main>

      {/* Footer */}
      <footer className="text-center text-sm text-gray-400 py-6 sm:py-8">
        © 2026 Let us Echo. All rights reserved.
      </footer>

      {/* Theme Toggle */}
      <button className="fixed bottom-4 sm:bottom-6 right-4 sm:right-6 w-12 h-12 sm:w-14 sm:h-14 bg-white rounded-full shadow-lg flex items-center justify-center text-xl sm:text-2xl">
        🌙
      </button>
    </>
  );
}

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <TranslatePage />
    </Suspense>
  );
}
