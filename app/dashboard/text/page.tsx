"use client";

import { useState } from "react";
import TranslationCard from "@/Components/TranslationCard";
import LanguageSwitcher from "@/Components/LanguageSwitcher";
import { translateText, type Language } from "@/lib/api";

export default function TextTranslation() {
  const [inputText, setInputText] = useState("");
  const [translatedText, setTranslatedText] = useState("");
  const [isTranslating, setIsTranslating] = useState(false);

  const handleInputChange = (text: string) => {
    setInputText(text);
  };

  const [selectedLanguages, setSelectedLanguages] = useState<{
    input: Language | null;
    output: Language | null;
  }>({
    input: null,
    output: null,
  });

  const handleLanguageChange = (inputLang: Language, outputLang: Language) => {
    setSelectedLanguages({
      input: inputLang,
      output: outputLang,
    });
  };

  const handleTranslate = async () => {
    if (
      !inputText.trim() ||
      !selectedLanguages.input ||
      !selectedLanguages.output
    ) {
      return;
    }

    setIsTranslating(true);
    try {
      const requestData = {
        text: inputText,
        source_language: selectedLanguages.input.code.toLowerCase(), // Ensure lowercase
        target_language: selectedLanguages.output.code.toLowerCase(), // Ensure lowercase
      };

      console.log("Translation request data:", requestData);

      const result = await translateText(requestData);
      setTranslatedText(result.translated_text);
      console.log("Translation response:", result);
    } catch (error) {
      console.error("Translation error:", error);
      setTranslatedText("Translation failed. Please try again.");
    } finally {
      setIsTranslating(false);
    }
  };

  return (
    <div className="p-6 space-y-6">
      <LanguageSwitcher onLanguageChange={handleLanguageChange} />

      <div className="grid md:grid-cols-2 gap-6">
        <TranslationCard
          title={`Source (${selectedLanguages.input?.code?.toUpperCase() || "ENG"})`}
          isInput={true}
          onTextChange={handleInputChange}
          placeholder="Type your text here to translate..."
          footer={`${inputText.length}/5000`}
        />

        <TranslationCard
          title={`Translation (${selectedLanguages.output?.code?.toUpperCase() || "RW"})`}
          text={translatedText || "Translation will appear here..."}
        />
      </div>

      <div className="flex justify-center">
        <button
          onClick={handleTranslate}
          disabled={
            !inputText.trim() ||
            !selectedLanguages.input ||
            !selectedLanguages.output ||
            isTranslating
          }
          className="bg-orange-500 hover:bg-orange-600 disabled:bg-gray-400 text-white px-8 py-3 rounded-full font-semibold transition"
        >
          {isTranslating ? "Translating..." : "Translate Text"}
        </button>
      </div>
    </div>
  );
}
