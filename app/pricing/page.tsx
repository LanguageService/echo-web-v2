"use client"

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import NavBar from '../components/NavBar';
import Footer from '../components/Footer';

interface PricingItem {
  id: string;
  channel: string;
  translation_type: string;
  cost_per_unit: string;
}

import { fetchPricing, PricingConfigResponse } from '@/lib/api';

export default function PricingPage() {
  const [pricing, setPricing] = useState<PricingConfigResponse[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPricing()
      .then(data => setPricing(data))
      .catch(err => console.error("Error fetching pricing:", err))
      .finally(() => setLoading(false));
  }, []);

  const uiPricing = pricing.filter(p => p.channel === 'UI');
  const apiPricing = pricing.filter(p => p.channel === 'API');

  return (
    <div className="min-h-screen bg-background text-foreground pb-20 flex flex-col">
      <NavBar />
      <main className="flex-grow">
      <div className="pt-20 pb-16 text-center max-w-4xl mx-auto px-6">
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4 text-transparent bg-clip-text african-gradient">
          Transparent, Pay-as-you-go Pricing
        </h1>
        <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
          One Universal Wallet. Load funds once and use them across all our services, either in the app or via API.
        </p>
      </div>

      <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-2 gap-12">
        {/* Consumer UI Pricing */}
        <div className="glass-card p-8 border-border text-card-foreground">
          <h2 className="text-2xl font-bold mb-2 text-foreground">ECHO Web & Mobile App</h2>
          <p className="text-muted-foreground mb-6">Simple usage for consumers.</p>
          
          <div className="space-y-4">
            {loading ? (
              <div className="animate-pulse flex space-x-4"><div className="h-4 bg-muted rounded w-full"></div></div>
            ) : (
              uiPricing.map(item => (
                <div key={item.id} className="flex justify-between items-center py-4 border-b border-muted last:border-0">
                  <span className="font-medium text-foreground">
                    {item.translation_type === 'STS' && 'Speech → Speech'}
                    {item.translation_type === 'STT' && 'Speech → Text'}
                    {item.translation_type === 'TTT' && 'Text → Text'}
                    {item.translation_type === 'TTS' && 'Text → Speech'}
                  </span>
                  <div className="text-right">
                    <span className="text-lg font-bold text-foreground">
                      ${parseFloat(item.cost_per_unit).toString()}
                    </span>
                    <span className="text-sm text-muted-foreground block">
                      {item.translation_type === 'TTT' ? '/1M chars' : '/min'}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
          

        </div>

        {/* API Developer Pricing */}
        <div className="glass-card p-8 border-border relative overflow-hidden text-card-foreground">
          <div className="absolute top-0 right-0 african-gradient text-white text-xs font-bold px-4 py-1.5 rounded-bl-xl shadow-sm">FOR DEVELOPERS</div>
          <h2 className="text-2xl font-bold mb-2 text-foreground mt-4 md:mt-0">ECHO API</h2>
          <p className="text-muted-foreground mb-6">Precise metered billing for scale.</p>
          
          <div className="space-y-4">
            {loading ? (
              <div className="animate-pulse flex space-x-4"><div className="h-4 bg-muted rounded w-full"></div></div>
            ) : (
              apiPricing.map(item => (
                <div key={item.id} className="flex justify-between items-center py-4 border-b border-muted last:border-0">
                  <span className="font-medium text-foreground">
                    {item.translation_type === 'STS' && 'Speech → Speech'}
                    {item.translation_type === 'STT' && 'Speech → Text'}
                    {item.translation_type === 'TTT' && 'Text → Text'}
                    {item.translation_type === 'TTS' && 'Text → Speech'}
                  </span>
                  <div className="text-right">
                    <span className="text-lg font-bold text-foreground">
                      ${parseFloat(item.cost_per_unit).toString()}
                    </span>
                    <span className="text-sm text-muted-foreground block">
                      {item.translation_type === 'TTT' ? '/1M chars' : '/min'}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
          
          <div className="mt-8 pt-6 border-t border-muted">
            <p className="text-sm text-muted-foreground mb-4">
              API keys share the same universal wallet balance. Set up auto-recharge so your apps never go offline.
            </p>
            <Link href="/developer/docs" className="block w-full bg-muted hover:bg-background text-foreground font-bold py-3 px-4 rounded-xl text-center transition border border-border">
              Read API Docs
            </Link>
          </div>
        </div>
      </div>
      </main>
      <Footer />
    </div>
  );
}
