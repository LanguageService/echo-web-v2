"use client";

import { useEffect, useState } from "react";
import { fetchLanguages, Language } from "@/lib/api";

export default function Languages() {
  const [languages, setLanguages] = useState<Language[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLanguages()
      .then((data) => {
        // Handle both nested and un-nested responses
        if (Array.isArray(data)) {
          setLanguages(data);
        } else if (data.languages && Array.isArray(data.languages)) {
          setLanguages(data.languages);
        } else {
          setLanguages([]);
        }
      })
      .catch((err) => console.error("Failed to fetch languages:", err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <section className="px-6 py-16 text-center max-w-5xl mx-auto border-t border-border mt-12">
      <h2 className="text-2xl font-bold mb-8 text-foreground">Supported Languages</h2>
      
      {loading ? (
        <div className="flex flex-wrap gap-3 justify-center">
          {[...Array(12)].map((_, i) => (
            <div key={i} className="h-8 w-24 bg-muted animate-pulse rounded-full" />
          ))}
        </div>
      ) : (
        <div className="flex flex-wrap gap-3 justify-center">
          {languages.length > 0 ? (
            languages.map((lang) => (
              <span
                key={lang.code}
                className="px-4 py-2 border border-border rounded-full text-sm font-semibold bg-card text-card-foreground shadow-sm hover:shadow-md transition cursor-default flex items-center gap-2"
              >
                <span>{lang.flag_emoji || '🌐'}</span>
                <span>{lang.name}</span>
              </span>
            ))
          ) : (
            <p className="text-muted-foreground">Unable to load languages at this time.</p>
          )}
        </div>
      )}
    </section>
  );
}
