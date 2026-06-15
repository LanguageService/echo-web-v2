import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import NavBar from '../components/NavBar';
import Footer from '../components/Footer';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <NavBar />
      <main className="flex-grow pb-20">
      {/* Hero Section */}
      <div className="pt-24 pb-16 text-center max-w-4xl mx-auto px-6">
        <div className="flex justify-center mb-10 p-6 inline-block">
          <img src="/images/logo_v2.png" alt="LET US ECHO" className="w-auto h-12 md:h-16 object-contain dark:invert" />
        </div>
        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-6 text-transparent bg-clip-text african-gradient">
          Breaking Language Barriers
        </h1>
        <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto leading-relaxed">
          At ECHO, we believe that communication should never be limited by language. 
          Our mission is to build the world's most accessible, universal translation infrastructure.
        </p>
      </div>

      {/* Content Section */}
      <div className="max-w-5xl mx-auto px-6 grid md:grid-cols-2 gap-12 mt-8">
        <div className="glass-card p-10 border-border text-card-foreground">
          <h2 className="text-3xl font-bold mb-6 text-foreground">Our Story</h2>
          <p className="text-muted-foreground leading-relaxed mb-4">
            ECHO was founded on a simple premise: in a globally connected world, language differences remain one of the final hurdles to true collaboration.
          </p>
          <p className="text-muted-foreground leading-relaxed">
            We don't just do speech-to-speech translation. By leveraging state-of-the-art AI, voice cloning, and deep learning, we've built a comprehensive platform that handles everything from real-time voice translation to high-fidelity enterprise document processing—ensuring the nuance, tone, and intent of your message is never lost across borders.
          </p>
        </div>

        <div className="glass-card p-10 border-border text-card-foreground">
          <h2 className="text-3xl font-bold mb-6 text-foreground">What We Do</h2>
          <ul className="space-y-6 text-muted-foreground text-lg">
            <li className="flex gap-3">
              <span className="text-orange-500 font-bold">✓</span>
              <span><strong>Instant Text Translation:</strong> High-speed, context-aware text localization across dozens of languages.</span>
            </li>
            <li className="flex gap-3">
              <span className="text-orange-500 font-bold">✓</span>
              <span><strong>Real-Time Speech Processing:</strong> Instant voice translation, transcription, and synthesis while preserving speaker emotion and identity.</span>
            </li>
            <li className="flex gap-3">
              <span className="text-orange-500 font-bold">✓</span>
              <span><strong>Enterprise Document Translation:</strong> High-fidelity, asynchronous processing of complex documents and native formatting.</span>
            </li>
            <li className="flex gap-3">
              <span className="text-orange-500 font-bold">✓</span>
              <span><strong>Developer Infrastructure:</strong> Robust API endpoints empowering builders to seamlessly embed universal translation directly into any application.</span>
            </li>
          </ul>
        </div>
      </div>

      {/* CTA */}
      <div className="mt-32 text-center max-w-3xl mx-auto px-6 mb-16">
        <h2 className="text-4xl font-extrabold text-foreground mb-8">Ready to ECHO?</h2>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Link href="/dashboard" className="african-gradient hover:opacity-90 text-white font-bold py-4 px-10 rounded-xl transition shadow-lg shadow-orange-500/25 text-lg">
            Get Started Free
          </Link>
          <Link href="/developer/docs" className="bg-card hover:bg-muted text-foreground font-bold py-4 px-10 rounded-xl transition border border-border shadow-sm text-lg">
            Read the API Docs
          </Link>
        </div>
      </div>
      </main>
      <Footer />
    </div>
  );
}
