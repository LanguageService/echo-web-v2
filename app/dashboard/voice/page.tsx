"use client";

import { ArrowLeft, ChevronDown, MicOff } from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";
import { languages, popularLanguages } from "@/lib/languages";

import { fetchLanguages, type Language } from "@/lib/api";

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
        setInputLang(data.languages[0]);
        setOutputLang(
          data.languages.find((l) => l.code === "rw") || data.languages[1]
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
      {/* Top Bar */}
      <div className="flex flex-wrap gap-4 sm:flex-nowrap items-center justify-between border-b pb-4">
        <div className="flex items-center gap-2 text-[#0C141D] font-semibold">
          <ArrowLeft className="w-5 h-5" />
          Language Selection
        </div>

        <div className="flex items-center gap-3 sm:gap-4">
          <div className="hidden sm:flex items-center gap-2 text-sm">
            <div className="w-8 h-8 rounded-full bg-[#F2F4F7] flex items-center justify-center">
              👤
            </div>
            Hi, John 👋
          </div>

          <button className="bg-[#F79009] hover:bg-[#E68200] text-white px-5 py-2 rounded-full text-sm font-semibold shadow">
            Try Premium
          </button>
        </div>
      </div>

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
              className={`w-full rounded-xl border p-3 sm:p-4 text-center ${
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
        <div className="bg-white border rounded-2xl shadow-sm p-4 sm:p-6 flex flex-col sm:flex-row gap-4 sm:gap-0 items-center justify-between">
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

          <Link href="/dashboard/voice/translate">
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

function LangCard({
  step,
  code,
  label,
  type,
  value,
  active,
  languages,
  onSelect,
}: {
  step: number;
  code: string;
  label: string;
  type: string;
  value: string;
  active?: boolean;
  languages: Language[];
  onSelect: (lang: Language) => void;
}) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div
      className={`bg-[#eff4f5] african-waves-pattern relative rounded-2xl border-2 p-5 sm:p-8 ${
        active ? "border-[#b9ced5]" : "border-[#b9ced5]"
      }`}
    >
      <div
        className={`absolute top-4 right-4 w-6 h-6 rounded-full text-xs flex items-center justify-center text-white ${
          active ? "bg-[#12B76A]" : "bg-[#F79009]"
        }`}
      >
        {step}
      </div>

      <div className="flex flex-col items-center text-center">
        <div
          className={`w-12 h-12 sm:w-14 sm:h-14 rounded-full flex items-center justify-center mb-3 ${
            active ? "bg-[#E0F7EC]" : "bg-[#FDEAD7]"
          }`}
        >
          <span
            className={`font-semibold ${
              active ? "text-[#12B76A]" : "text-[#F79009]"
            }`}
          >
            {code}
          </span>
        </div>

        <p className="font-semibold text-sm sm:text-base text-[#0C141D]">
          {label}
        </p>
        <p className="text-xs text-[#667085] mt-1">{type}</p>

        <div className="mt-6 w-full text-left relative">
          <p className="text-xs text-[#667085] mb-1">
            Change {type.split(" ")[0]}
          </p>
          <div
            className="border rounded-xl px-4 py-3 flex items-center justify-between cursor-pointer"
            onClick={() => setIsOpen(!isOpen)}
          >
            <span>{value}</span>
            <ChevronDown className="w-4 h-4 text-[#667085]" />
          </div>

          {isOpen && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-white border rounded-xl shadow-lg max-h-48 overflow-y-auto z-10">
              {languages.map((lang) => (
                <div
                  key={lang.code}
                  className="px-4 py-2 hover:bg-gray-50 cursor-pointer flex items-center gap-2"
                  onClick={() => {
                    onSelect(lang);
                    setIsOpen(false);
                  }}
                >
                  <span>{lang.flag_emoji}</span>
                  <span>
                    {lang.name} ({lang.native_name})
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function Badge({ code, label }: { code: string; label: string }) {
  return (
    <div className="flex items-center gap-2 border rounded-xl px-4 py-2">
      <span className="font-semibold text-sm">{code}</span>
      <span className="text-sm text-[#667085]">{label}</span>
    </div>
  );
}
