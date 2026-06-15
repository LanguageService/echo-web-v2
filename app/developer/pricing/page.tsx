"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import NavBar from '../../components/NavBar';
import { fetchPricing, PricingConfigResponse } from '@/lib/api';

export default function DeveloperPricingPage() {
  const [pricing, setPricing] = useState<PricingConfigResponse[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPricing()
      .then(data => setPricing(data))
      .catch(err => console.error("Error fetching pricing:", err))
      .finally(() => setLoading(false));
  }, []);

  const apiSpeechToSpeech = pricing.find(p => p.channel === 'API' && p.translation_type === 'STS');
  const apiSpeechToText = pricing.find(p => p.channel === 'API' && p.translation_type === 'STT');
  const apiTextToText = pricing.find(p => p.channel === 'API' && p.translation_type === 'TTT');
  const apiTextToSpeech = pricing.find(p => p.channel === 'API' && p.translation_type === 'TTS');

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <NavBar />
      <div className="flex flex-1 overflow-hidden">
        
        {/* Sidebar */}
        <aside className="w-64 glass-card rounded-none border-r border-border hidden md:flex flex-col">
          <div className="p-6 border-b border-border african-gradient">
            <h2 className="text-xl font-bold text-white tracking-wide">ECHO <span className="text-white/80">API</span></h2>
          </div>
          <nav className="flex-1 overflow-y-auto p-4 space-y-1">
            <Link href="/developer/docs#overview" className="block px-3 py-2 rounded-lg hover:bg-muted transition text-muted-foreground hover:text-foreground">Overview</Link>
            <Link href="/developer/docs#authentication" className="block px-3 py-2 rounded-lg hover:bg-muted transition text-muted-foreground hover:text-foreground">Authentication</Link>
            <Link href="/developer/docs#endpoints" className="block px-3 py-2 rounded-lg hover:bg-muted transition text-muted-foreground hover:text-foreground">Core Endpoints</Link>
            <Link href="/developer/docs#document-processing" className="block px-3 py-2 rounded-lg hover:bg-muted transition text-muted-foreground hover:text-foreground">Document Processing</Link>
            <Link href="/developer/docs#file-types" className="block px-3 py-2 rounded-lg hover:bg-muted transition text-muted-foreground hover:text-foreground">Supported File Types</Link>
            <Link href="/developer/docs#webhooks" className="block px-3 py-2 rounded-lg hover:bg-muted transition text-muted-foreground hover:text-foreground">Webhooks</Link>
            
            <div className="pt-6 mt-6 border-t border-border">
              <Link href="/dashboard/api-keys" className="block px-3 py-2 rounded-lg hover:bg-muted transition text-muted-foreground">Manage API Keys</Link>
              <Link href="/developer/pricing" className="block px-3 py-2 rounded-lg bg-muted text-foreground font-medium">Pricing</Link>
            </div>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto bg-background p-8 md:p-12">
          <div className="max-w-3xl mx-auto pb-20">
            
            <header className="mb-12">
              <div className="inline-flex items-center px-3 py-1 rounded-full bg-muted text-foreground text-sm font-semibold mb-4 border border-border">
                API Pricing
              </div>
              <h1 className="text-4xl font-extrabold text-transparent bg-clip-text african-gradient mb-4">Pay-As-You-Go</h1>
              <p className="text-xl text-muted-foreground leading-relaxed">
                Scale your applications effortlessly. You only pay for what you use, metered directly from your universal wallet balance.
              </p>
            </header>

            {/* API Developer Pricing */}
            <div className="glass-card p-8 border-border relative overflow-hidden text-card-foreground">
              <div className="absolute top-0 right-0 african-gradient text-white text-xs font-bold px-4 py-1.5 rounded-bl-xl shadow-sm">FOR DEVELOPERS</div>
              <h2 className="text-2xl font-bold mb-2 text-foreground mt-4 md:mt-0">ECHO API Rates</h2>
              <p className="text-muted-foreground mb-8">Precise metered billing for scale.</p>
              
              <div className="space-y-4">
                <div className="flex justify-between items-center py-3 border-b border-muted">
                  <span className="font-semibold text-foreground">Speech → Speech</span>
                  <span className="text-foreground">{loading ? "..." : `$${parseFloat(apiSpeechToSpeech?.cost_per_unit || "0.08").toString()}`} / min</span>
                </div>
                <div className="flex justify-between items-center py-3 border-b border-muted">
                  <span className="font-semibold text-foreground">Speech → Text</span>
                  <span className="text-foreground">{loading ? "..." : `$${parseFloat(apiSpeechToText?.cost_per_unit || "0.03").toString()}`} / min</span>
                </div>
                <div className="flex justify-between items-center py-3 border-b border-muted">
                  <span className="font-semibold text-foreground">Text → Text</span>
                  <span className="text-foreground">{loading ? "..." : `$${parseFloat(apiTextToText?.cost_per_unit || "1.50").toString()}`} / 1M chars</span>
                </div>
                <div className="flex justify-between items-center py-3">
                  <span className="font-semibold text-foreground">Text → Speech</span>
                  <span className="text-foreground">{loading ? "..." : `$${parseFloat(apiTextToSpeech?.cost_per_unit || "0.015").toString()}`} / min</span>
                </div>
              </div>
            </div>

          </div>
        </main>
      </div>
    </div>
  );
}
