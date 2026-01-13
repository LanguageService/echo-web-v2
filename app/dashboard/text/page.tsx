"use client";

import { useState } from "react";
import LanguageSwitcher from "@/Components/LanguageSwitcher";
import TranslationCard from "@/Components/TranslationCard";
import { Button } from "@/Components/ui/Button";

export default function TextTranslatePage() {
  const [isLoading, setIsLoading] = useState(false);

  const handleTranslate = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/text/text/`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            text: "How are You doing today? For me, I am doing Great today, How about you?",
            target_language: "Kinyarwanda",
            source_language: "auto",
          }),
        }
      );

      const result = await response.json();
      console.log("Translation response:", result);
    } catch (error) {
      console.error("Error Translating", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Text Translate</h1>
        <span className="text-sm text-gray-400">Just now</span>
      </div>

      {/* Language Switcher */}
      <LanguageSwitcher />

      {/* Translation Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <TranslationCard
          title="Source (ENG)"
          text={`Hello, how are you doing today? Hope everything is alright yeah. I just want to remind you of the annually convention holding next week friday.`}
          footer="143/5000"
        />

        <TranslationCard
          title="Translation (KW)"
          text={`Muraho, amakuru y'uyu munsi? Ndizera ko byose ari byiza. Nifuzaga kukwibutsa ko inama ngarukamwaka izaba kuwa gatanu w'icyumweru gitaha.`}
          orange
        />
      </div>
      <Button onClick={handleTranslate}>Translate Text</Button>

      {/* Recent Translations */}
      <div>
        <h2 className="font-semibold mb-4">Recent translations</h2>
        <div className="flex gap-4">
          <RecentItem title="How are you?" subtitle="Amakuru?" />
          <RecentItem title="Good morning" subtitle="Mwaramutse" />
        </div>
      </div>
    </div>
  );
}

function RecentItem({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <div className="bg-white px-4 py-3 rounded-xl border w-48">
      <p className="text-sm font-medium">{title}</p>
      <p className="text-xs text-gray-400">{subtitle}</p>
    </div>
  );
}
