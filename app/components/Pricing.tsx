"use client"

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import PricingCard from "./PricingCard";
import { fetchPricing, PricingConfigResponse } from '@/lib/api';

export default function Pricing() {
  const [pricing, setPricing] = useState<PricingConfigResponse[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPricing()
      .then(data => setPricing(data))
      .catch(err => console.error("Error fetching pricing:", err))
      .finally(() => setLoading(false));
  }, []);

  const uiSpeechToSpeech = pricing.find(p => p.channel === 'UI' && p.translation_type === 'STS');
  const apiSpeechToSpeech = pricing.find(p => p.channel === 'API' && p.translation_type === 'STS');

  return (
    <section className="px-6 py-16 max-w-6xl mx-auto">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold mb-4 text-foreground">Flexible Pay-As-You-Go</h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Whether you are a consumer using the ECHO app or a developer building with the ECHO API, you only pay for exactly what you use.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <PricingCard
          badge="Consumer"
          description="ECHO Web & Mobile App"
          badgeColor="bg-orange-600 text-white"
          title="App Usage"
          prefix="starting from"
          price={loading ? "..." : `$${parseFloat(uiSpeechToSpeech?.cost_per_unit || "0.05").toString()}`}
          subtitle="per minute"
          features={[
            "Voice-to-voice translation",
            "Text translation",
            "Document translation",
            "History & Favorites",
          ]}
          action="Top Up Wallet"
          href="/dashboard/billing"
        />

        <PricingCard
          badge="Developer"
          description="Build with ECHO API"
          badgeColor="bg-slate-800 text-white dark:bg-slate-200 dark:text-slate-900"
          title="Metered API"
          prefix="starting from"
          price={loading ? "..." : `$${parseFloat(apiSpeechToSpeech?.cost_per_unit || "0.08").toString()}`}
          subtitle="per minute"
          features={[
            "Speech to Speech API",
            "Speech to Text API",
            "Text to Speech API",
            "Asynchronous Document Processing",
            "Shared Universal Wallet Balance",
          ]}
          action="Read API Docs"
          href="/developer/docs"
        />
      </div>
      
      <div className="text-center mt-8">
        <Link href="/pricing" className="text-orange-500 hover:text-orange-600 font-bold underline underline-offset-4">
          View full detailed pricing tables
        </Link>
      </div>
    </section>
  );
}
