"use client";

import { ArrowLeftRight, ChevronDown } from "lucide-react";
import { useState, useEffect, useCallback } from "react";
import { fetchTextLanguages, type Language } from "@/lib/api";
import ReactCountryFlag from "react-country-flag";

const languageToCountry: Record<string, string> = {
  EN: "GB", RW: "RW", FR: "FR", AR: "SA", PT: "PT",
  ES: "ES", HA: "NG", IG: "NG", SW: "TZ", YO: "NG",
};

interface LanguageSwitcherProps {
  onLanguageChange?: (inputLang: Language, outputLang: Language) => void;
}

function LanguageSwitcher({ onLanguageChange }: LanguageSwitcherProps) {
  const [languages, setLanguages] = useState<Language[]>([]);
  const [inputLang, setInputLang] = useState<Language | null>(null);
  const [outputLang, setOutputLang] = useState<Language | null>(null);
  const [showInputDropdown, setShowInputDropdown] = useState(false);
  const [showOutputDropdown, setShowOutputDropdown] = useState(false);

  useEffect(() => {
    const loadLanguages = async () => {
      try {
        const response = await fetchTextLanguages();
        setLanguages(response.languages);
        const english = response.languages.find((l) => l.code === "en");
        const kinyarwanda = response.languages.find((l) => l.code === "rw");
        if (english && kinyarwanda) {
          setInputLang(english);
          setOutputLang(kinyarwanda);
          onLanguageChange?.(english, kinyarwanda);
        }
      } catch (error) {
        console.error("Failed to load languages:", error);
      }
    };
    loadLanguages();
  }, []);

  const handleInputLanguageSelect = useCallback((lang: Language) => {
    setInputLang(lang);
    setShowInputDropdown(false);
    if (outputLang) onLanguageChange?.(lang, outputLang);
  }, [outputLang, onLanguageChange]);

  const handleOutputLanguageSelect = useCallback((lang: Language) => {
    setOutputLang(lang);
    setShowOutputDropdown(false);
    if (inputLang) onLanguageChange?.(inputLang, lang);
  }, [inputLang, onLanguageChange]);

  const swapLanguages = () => {
    if (inputLang && outputLang) {
      setInputLang(outputLang);
      setOutputLang(inputLang);
      onLanguageChange?.(outputLang, inputLang);
    }
  };

  if (!inputLang || !outputLang) {
    return <div className="text-gray-500 dark:text-gray-400">Loading languages...</div>;
  }

  return (
    <div className="bg-white dark:bg-gray-900 p-4 rounded-xl border border-[#b9ced5] dark:border-gray-700 flex items-center justify-center gap-4">
      <Language
        code={inputLang.code}
        label={inputLang.name}
        isOpen={showInputDropdown}
        onToggle={() => { setShowInputDropdown(!showInputDropdown); setShowOutputDropdown(false); }}
        onSelect={handleInputLanguageSelect}
        languages={languages}
      />

      <button onClick={swapLanguages} className="p-2 rounded-full bg-orange-50 dark:bg-orange-900/30 text-orange-500 hover:bg-orange-100 dark:hover:bg-orange-900/50 transition">
        <ArrowLeftRight size={18} />
      </button>

      <Language
        code={outputLang.code}
        label={outputLang.name}
        orange
        isOpen={showOutputDropdown}
        onToggle={() => { setShowOutputDropdown(!showOutputDropdown); setShowInputDropdown(false); }}
        onSelect={handleOutputLanguageSelect}
        languages={languages}
      />
    </div>
  );
}

function Language({ code, label, orange, isOpen, onToggle, onSelect, languages }: {
  code: string; label: string; orange?: boolean; isOpen?: boolean;
  onToggle?: () => void; onSelect?: (lang: Language) => void; languages?: Language[];
}) {
  return (
    <div className="relative">
      <button
        onClick={onToggle}
        className={`px-4 py-2 rounded-lg border flex items-center gap-2 hover:bg-gray-50 dark:hover:bg-gray-800 transition ${
          orange
            ? "border-orange-200 dark:border-orange-700 bg-orange-50 dark:bg-orange-900/20"
            : "border-gray-200 dark:border-gray-600 dark:bg-gray-800"
        }`}
      >
        <ReactCountryFlag
          countryCode={languageToCountry[code.toUpperCase()] ?? code.toUpperCase()}
          svg
          style={{ width: "1.2em", height: "1.2em" }}
        />
        <span className="text-sm font-medium dark:text-white">{label}</span>
        <ChevronDown className="w-4 h-4 dark:text-gray-400" />
      </button>

      {isOpen && languages && (
        <div className="absolute top-full left-0 mt-1 bg-white dark:bg-gray-800 border dark:border-gray-700 rounded-lg shadow-lg max-h-48 overflow-y-auto z-50 min-w-[250px]">
          {languages.map((lang) => (
            <button
              key={lang.code}
              onClick={() => onSelect?.(lang)}
              className="w-full px-4 py-2 text-left hover:bg-gray-50 dark:hover:bg-gray-700 text-sm flex items-center gap-2 border-b border-gray-100 dark:border-gray-700 last:border-b-0 dark:text-white"
            >
              <ReactCountryFlag
                countryCode={languageToCountry[lang.code.toUpperCase()] ?? lang.code.toUpperCase()}
                svg
                style={{ width: "1.2em", height: "1.2em" }}
              />
              <span>{lang.name}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default LanguageSwitcher;
