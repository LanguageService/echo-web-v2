"use client";

import { useState, useRef, useEffect } from "react";
import { ChevronDown } from "lucide-react";
import { type Language } from "@/lib/api";
import ReactCountryFlag from "react-country-flag";

interface LangCardProps {
  step: number;
  code: string;
  flag: string;
  label: string;
  type: string;
  value: string;
  active?: boolean;
  languages: Language[];
  onSelect: (lang: Language) => void;
}

const languageToCountry: Record<string, string> = {
  EN: "GB",
  RW: "RW",
  FR: "FR",
  AR: "SA",
  PT: "PT",
  ES: "ES",
  HA: "NG",
  IG: "NG",
  SW: "TZ",
  YO: "NG",
};

export default function LangCard({
  step, code, flag, label, type, value, active, languages, onSelect,
}: LangCardProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="bg-[#eff4f5] dark:bg-gray-800 african-waves-pattern relative rounded-2xl border-2 border-[#b9ced5] dark:border-gray-700 p-5 sm:p-8">
      <div className={`absolute top-4 right-4 w-6 h-6 rounded-full text-xs flex items-center justify-center text-white ${active ? "bg-[#12B76A]" : "bg-[#F79009]"}`}>
        {step}
      </div>

      <div className="flex flex-col items-center text-center">
        <div className="w-12 h-12 sm:w-14 sm:h-14 flex items-center justify-center mb-3">
          <ReactCountryFlag
            countryCode={languageToCountry[code.toUpperCase()] ?? code.toUpperCase()}
            svg
            style={{ width: "3em", height: "3em" }}
          />
        </div>

        <p className="font-semibold text-sm sm:text-base text-[#0C141D] dark:text-white">
          {label}
        </p>
        <p className="text-xs text-[#667085] dark:text-gray-400 mt-1">{type}</p>

        <div className="mt-6 w-full text-left relative" ref={dropdownRef}>
          <p className="text-xs text-[#667085] dark:text-gray-400 mb-1">
            Change {type.split(" ")[0]}
          </p>
          <div
            className="border border-[#b9ced5] dark:border-gray-600 rounded-xl px-4 py-3 flex items-center justify-between cursor-pointer bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            onClick={() => setIsOpen(!isOpen)}
          >
            <span>{value}</span>
            <ChevronDown className="w-4 h-4 text-[#667085] dark:text-gray-400" />
          </div>

          {isOpen && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-gray-800 border dark:border-gray-700 rounded-xl shadow-lg max-h-48 overflow-y-auto z-10">
              {languages.map((lang) => (
                <div
                  key={lang.code}
                  className="px-4 py-2 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer flex items-center gap-2 text-gray-900 dark:text-white"
                  onClick={() => { onSelect(lang); setIsOpen(false); }}
                >
                  <ReactCountryFlag
                    countryCode={languageToCountry[lang.code.toUpperCase()] ?? lang.code.toUpperCase()}
                    svg
                    style={{ width: "1.5em", height: "1.5em" }}
                  />
                  <span>{lang.name} ({lang.native_name})</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
