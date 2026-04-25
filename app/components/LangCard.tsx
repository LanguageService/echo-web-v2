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
  HA: "NG",  // Hausa → Nigeria
  IG: "NG",  // Igbo → Nigeria
  SW: "TZ",  // Swahili → Tanzania
  YO: "NG",  // Yoruba → Nigeria
  // add more as needed
};

export default function LangCard({
  step,
  code,
  flag,
  label,
  type,
  value,
  active,
  languages,
  onSelect,
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
    <div
      className={`bg-[#eff4f5] african-waves-pattern relative rounded-2xl border-2 p-5 sm:p-8 ${active ? "border-[#b9ced5]" : "border-[#b9ced5]"
        }`}
    >
      <div
        className={`absolute top-4 right-4 w-6 h-6 rounded-full text-xs flex items-center justify-center text-white ${active ? "bg-[#12B76A]" : "bg-[#F79009]"
          }`}
      >
        {step}
      </div>

      <div className="flex flex-col items-center text-center">
        <div
          className={`w-12 h-12 sm:w-14 sm:h-14 flex items-center justify-center mb-3"
            }`}
        >
          <span
            className={`font-semibold ${active ? "text-[#12B76A]" : "text-[#F79009]"
              }`}
          >
            <ReactCountryFlag
              countryCode={languageToCountry[code.toUpperCase()] ?? code.toUpperCase()}
              svg
              style={{ width: "3em", height: "3em" }}
            />


          </span>
        </div>

        <p className="font-semibold text-sm sm:text-base text-[#0C141D]">
          {label}
        </p>
        <p className="text-xs text-[#667085] mt-1">{type}</p>

        <div className="mt-6 w-full text-left relative" ref={dropdownRef}>
          <p className="text-xs text-[#667085] mb-1">
            Change {type.split(" ")[0]}
          </p>
          <div
            className="border border-[#b9ced5] rounded-xl px-4 py-3 flex items-center justify-between cursor-pointer"
            onClick={() => setIsOpen(!isOpen)}
          >
            <span>{value}</span>
            <ChevronDown className="w-4 h-4 text-[#667085]" />
          </div>

          {isOpen && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-white border rounded-xl shadow-lg max-h-48 overflow-y-auto z-10">


              {languages.map((lang) => {
                return (
                  <div
                    key={lang.code}
                    className="px-4 py-2 hover:bg-gray-50 cursor-pointer flex items-center gap-2"
                    onClick={() => {
                      onSelect(lang);
                      setIsOpen(false);
                    }}
                  >
                    <ReactCountryFlag
                      countryCode={languageToCountry[lang.code.toUpperCase()] ?? lang.code.toUpperCase()}
                      svg
                      style={{ width: "1.5em", height: "1.5em" }}
                    />

                    <span>
                      {lang.name} ({lang.native_name})
                    </span>
                  </div>
                )
              })}

            </div>
          )}
        </div>
      </div>
    </div>
  );
}
