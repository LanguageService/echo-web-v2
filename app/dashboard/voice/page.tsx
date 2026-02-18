"use client";

import { ArrowLeft, ChevronDown, MicOff } from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";
import { languages, popularLanguages } from "@/lib/languages";
import { fetchLanguages, type Language } from "@/lib/api";
import Badge from "@/components/Badge";
import LangCard from "@/components/LangCard";

export default function LanguageSelection() {
  const [languages, setLanguages] = useState<Language[]>([]);
  const [loading, setLoading] = useState(true);
  const [inputLang, setInputLang] = useState<Language | null>(null);
  const [outputLang, setOutputLang] = useState<Language | null>(null);

  const swapLanguages = () => {
    const temp = inputLang;
    setInputLang(outputLang);
    setOutputLang(temp);
  };

  useEffect(() => {
    const loadLanguages = async () => {
      try {
        const data = await fetchLanguages();
        setLanguages(data.languages);
        const englishLang = data.languages.find((l) => l.code === "en");
        setInputLang(englishLang || data.languages[0]);
        setOutputLang(
          data.languages.find((l) => l.code === "rw") || data.languages[1],
        );
      } catch (error) {
        console.error("Failed to load languages:", error);
      } finally {
        setLoading(false);
      }
    };

    loadLanguages();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  }

  if (!inputLang || !outputLang) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Error loading languages
      </div>
    );
  }

  return (
    <main className="min-h-screen african-geometric-pattern bg-background px-4 sm:px-6 lg:px-10 pt-4 sm:pt-6 pb-40">
      {/* Heading */}
      <div className="mt-14 text-center max-w-2xl mx-auto">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#0C141D]">
          Choose two languages
        </h1>
        <p className="mt-2 text-sm sm:text-base text-[#667085]">
          Select any two languages you want to translate between. You can swap
          the direction later or let us auto-detect.
        </p>
      </div>

      {/* Language Cards */}
      <div className="mt-10 sm:mt-12 grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-10 max-w-4xl mx-auto">
        <LangCard
          step={1}
          code={inputLang.code.toUpperCase()}
          label={inputLang.name}
          type="Input Language"
          value={`${inputLang.name} (${inputLang.native_name})`}
          languages={languages}
          onSelect={setInputLang}
        />

        <LangCard
          step={2}
          code={outputLang.code.toUpperCase()}
          label={outputLang.name}
          type="Output Language"
          value={`${outputLang.name} (${outputLang.native_name})`}
          languages={languages}
          onSelect={setOutputLang}
          active
        />
      </div>

      {/* Popular */}
      <div className="mt-14 max-w-4xl mx-auto">
        <h3 className="font-semibold text-[#0C141D] mb-4">
          Recently Used & Popular
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
          {popularLanguages.map((lang) => (
            <div
              key={lang.name}
              className={`w-full rounded-xl border border-[#b9ced5] p-3 sm:p-4 text-center ${
                lang.disabled
                  ? "opacity-40"
                  : "hover:border-[#F79009] cursor-pointer"
              }`}
            >
              <div className="font-semibold text-sm">{lang.code}</div>
              <div className="text-xs text-[#667085] mt-1">{lang.name}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer Bar */}
      <div className="fixed bottom-4 left-4 right-4 sm:left-6 sm:right-6 lg:left-72 lg:right-10">
        <div className="bg-white border border-[#b9ced5] rounded-2xl shadow-sm p-4 sm:p-6 flex flex-col sm:flex-row gap-4 sm:gap-0 items-center justify-between">
          <div className="flex flex-wrap sm:flex-nowrap items-center gap-3">
            <Badge code={inputLang.code} label={inputLang.name} />
            <button
              className="w-10 h-10 rounded-full bg-[#F2F4F7] hover:bg-[#E5E7EB] flex items-center justify-center cursor-pointer transition-colors"
              onClick={swapLanguages}
            >
              ↔
            </button>
            <Badge code={outputLang.code} label={outputLang.name} />
          </div>
          {/* <Link href="/dashboard/voice/translate"> */}
          <Link
            href={`/dashboard/voice/translate?inputLang=${
              inputLang.code
            }&outputLang=${outputLang.code}&inputName=${encodeURIComponent(
              inputLang.name,
            )}&outputName=${encodeURIComponent(
              outputLang.name,
            )}&inputNative=${encodeURIComponent(
              inputLang.native_name,
            )}&outputNative=${encodeURIComponent(outputLang.native_name)}`}
          >
            <button className="w-full sm:w-auto bg-[#F79009] hover:bg-[#E68200] text-white px-6 sm:px-8 py-3 rounded-full text-sm font-semibold shadow flex items-center justify-center gap-2">
              <MicOff className="w-4 h-4" />
              Start Translating
            </button>
          </Link>
        </div>
      </div>
    </main>
  );
}
