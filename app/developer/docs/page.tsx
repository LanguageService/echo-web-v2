import React from 'react';
import Link from 'next/link';
import NavBar from '../../components/NavBar';
import Footer from '../../components/Footer';

export default function DeveloperDocsPage() {
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
            <Link href="#overview" className="block px-3 py-2 rounded-lg bg-muted text-foreground font-medium">Overview</Link>
            <Link href="#authentication" className="block px-3 py-2 rounded-lg hover:bg-muted transition text-muted-foreground hover:text-foreground">Authentication</Link>
            <Link href="#endpoints" className="block px-3 py-2 rounded-lg hover:bg-muted transition text-muted-foreground hover:text-foreground">Core Endpoints</Link>
            <Link href="#document-processing" className="block px-3 py-2 rounded-lg hover:bg-muted transition text-muted-foreground hover:text-foreground">Document Processing</Link>
            <Link href="#file-types" className="block px-3 py-2 rounded-lg hover:bg-muted transition text-muted-foreground hover:text-foreground">Supported File Types</Link>
            <Link href="#webhooks" className="block px-3 py-2 rounded-lg hover:bg-muted transition text-muted-foreground hover:text-foreground">Webhooks</Link>
            
            <div className="pt-6 mt-6 border-t border-border">
              <Link href="/dashboard/api-keys" className="block px-3 py-2 rounded-lg hover:bg-muted transition text-muted-foreground">Manage API Keys</Link>
              <Link href="/developer/pricing" className="block px-3 py-2 rounded-lg hover:bg-muted transition text-muted-foreground hover:text-foreground">Pricing</Link>
            </div>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto bg-background p-8 md:p-12">
          <div className="max-w-4xl mx-auto space-y-16 pb-20">
            
            {/* Header */}
            <header id="overview" className="scroll-mt-12">
              <div className="inline-flex items-center px-3 py-1 rounded-full bg-muted text-foreground text-sm font-semibold mb-4 border border-border">
                API Version 1.0
              </div>
              <h1 className="text-4xl font-extrabold text-transparent bg-clip-text african-gradient mb-4">Developer Documentation</h1>
              <p className="text-xl text-muted-foreground leading-relaxed">
                Integrate ECHO's powerful translation engines into your applications.
                Our API offers speech-to-speech, text-to-speech, speech-to-text, and comprehensive document translation endpoints.
              </p>
            </header>

            {/* Authentication */}
            <section id="authentication" className="scroll-mt-12">
              <h2 className="text-2xl font-bold text-foreground mb-4 border-b border-border pb-2">Authentication</h2>
              <p className="mb-4">
                Authenticate your requests by including your Client ID and Client Secret in the HTTP headers.
                You can manage your credentials in the <Link href="/dashboard/api-keys" className="font-semibold text-orange-500 hover:text-orange-600">API Keys Dashboard</Link>.
              </p>
              <div className="glass-card rounded-xl border border-border overflow-hidden mb-6 shadow-md">
                <div className="bg-muted px-4 py-2 border-b border-border text-xs text-muted-foreground uppercase tracking-wider font-mono">HEADERS</div>
                <div className="p-4 overflow-x-auto bg-gray-900">
                  <pre className="text-sm font-mono text-green-400">
                    X-Client-Id: your_client_id_here{'\n'}
                    X-Client-Secret: your_client_secret_here
                  </pre>
                </div>
              </div>
              <div className="african-gradient p-4 rounded-lg shadow-md text-white">
                <p className="text-sm">
                  <strong>Note:</strong> API requests are metered in USD and deduct from your universal wallet balance. Keep your balance topped up to ensure uninterrupted service!
                </p>
              </div>
            </section>

            {/* Endpoints */}
            <section id="endpoints" className="scroll-mt-12">
              <h2 className="text-2xl font-bold text-foreground mb-4 border-b border-border pb-2">Core Endpoints</h2>
              
              <div className="space-y-12">
                
                {/* Text to Text */}
                <div className="glass-card border border-border rounded-xl overflow-hidden shadow-md">
                  <div className="px-6 py-4 border-b border-border flex items-center justify-between bg-muted/30">
                    <h3 className="text-xl font-bold text-foreground">Translate Text (Text to Text)</h3>
                    <span className="px-3 py-1 bg-green-500/10 text-green-500 rounded text-sm font-bold border border-green-500/20">POST</span>
                  </div>
                  <div className="p-6">
                    <code className="inline-block px-3 py-1 rounded bg-muted text-sm text-foreground font-mono mb-6 border border-border">/api/v1/translation/text/</code>
                    <p className="text-muted-foreground mb-6">Translates text instantaneously from a source language to a target language.</p>
                    
                    <div className="grid lg:grid-cols-2 gap-6">
                      {/* Request */}
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 5l7 7-7 7M5 5l7 7-7 7"></path></svg>
                          Request Payload
                        </div>
                        <div className="bg-gray-950 rounded-lg p-4 border border-gray-800 overflow-x-auto">
                          <pre className="text-xs text-blue-300 font-mono leading-relaxed">
{`{
  "text": "Hello, how are you?",
  "source_language": "en",
  "target_language": "es"
}`}
                          </pre>
                        </div>
                      </div>

                      {/* Response */}
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                          <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                          Response (200 OK)
                        </div>
                        <div className="bg-gray-950 rounded-lg p-4 border border-gray-800 overflow-x-auto">
                          <pre className="text-xs text-green-300 font-mono leading-relaxed">
{`{
  "success": true,
  "original_text": "Hello, how are you?",
  "translated_text": "Hola, ¿cómo estás?",
  "source_language": "en",
  "target_language": "es",
  "cost_incurred": 0.0015
}`}
                          </pre>
                        </div>
                      </div>
                    </div>
                    
                    {/* Collapsible Payload Description */}
                    <details className="mt-6 group border border-border rounded-lg bg-muted/10 [&_summary::-webkit-details-marker]:hidden">
                      <summary className="cursor-pointer px-4 py-3 font-semibold text-sm text-foreground flex justify-between items-center list-none outline-none hover:bg-muted/30 transition rounded-lg">
                        <div className="flex items-center gap-2">
                          <svg className="w-4 h-4 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                          Payload Descriptions
                        </div>
                        <span className="transition group-open:rotate-180">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                        </span>
                      </summary>
                      <div className="px-4 pb-4 pt-2 text-sm text-muted-foreground border-t border-border/50">
                        <ul className="space-y-3 mt-2">
                          <li>
                            <code className="bg-muted px-1.5 py-0.5 rounded text-foreground font-mono text-xs">text</code>
                            <span className="text-[10px] uppercase tracking-wider bg-orange-500/10 text-orange-500 font-bold px-1.5 py-0.5 rounded ml-2">Required</span>
                            <p className="mt-1 ml-1 text-xs">The raw text string you want to translate.</p>
                          </li>
                          <li>
                            <code className="bg-muted px-1.5 py-0.5 rounded text-foreground font-mono text-xs">source_language</code>
                            <span className="text-[10px] uppercase tracking-wider bg-gray-500/10 text-gray-400 font-bold px-1.5 py-0.5 rounded ml-2">Optional</span>
                            <p className="mt-1 ml-1 text-xs">ISO code (e.g., 'en'). If omitted, the API will attempt to auto-detect the language.</p>
                          </li>
                          <li>
                            <code className="bg-muted px-1.5 py-0.5 rounded text-foreground font-mono text-xs">target_language</code>
                            <span className="text-[10px] uppercase tracking-wider bg-orange-500/10 text-orange-500 font-bold px-1.5 py-0.5 rounded ml-2">Required</span>
                            <p className="mt-1 ml-1 text-xs">ISO code of the language you want to translate the text into.</p>
                          </li>
                        </ul>
                      </div>
                    </details>
                  </div>
                </div>

                {/* Speech to Speech */}
                <div className="glass-card border border-border rounded-xl overflow-hidden shadow-md">
                  <div className="px-6 py-4 border-b border-border flex items-center justify-between bg-muted/30">
                    <h3 className="text-xl font-bold text-foreground">Translate Speech (Speech to Speech)</h3>
                    <span className="px-3 py-1 bg-green-500/10 text-green-500 rounded text-sm font-bold border border-green-500/20">POST</span>
                  </div>
                  <div className="p-6">
                    <code className="inline-block px-3 py-1 rounded bg-muted text-sm text-foreground font-mono mb-6 border border-border">/api/v1/translation/speech/sts/</code>
                    <p className="text-muted-foreground mb-6">Accepts base64 encoded audio and returns translated synthesized audio using Voice Cloning.</p>
                    
                    <div className="grid lg:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 5l7 7-7 7M5 5l7 7-7 7"></path></svg>
                          Request Payload
                        </div>
                        <div className="bg-gray-950 rounded-lg p-4 border border-gray-800 overflow-x-auto">
                          <pre className="text-xs text-blue-300 font-mono leading-relaxed">
{`{
  "audio_base64": "UklGRiQAAABXQVZFZm10IBAAAA...",
  "source_language": "auto",
  "target_language": "fr"
}`}
                          </pre>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                          <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                          Response (200 OK)
                        </div>
                        <div className="bg-gray-950 rounded-lg p-4 border border-gray-800 overflow-x-auto">
                          <pre className="text-xs text-green-300 font-mono leading-relaxed">
{`{
  "success": true,
  "audio_url": "https://cdn.letecho.com/...",
  "transcript": "Hello world",
  "translation": "Bonjour le monde",
  "cost_incurred": 0.08
}`}
                          </pre>
                        </div>
                      </div>
                    </div>

                    {/* Collapsible Payload Description */}
                    <details className="mt-6 group border border-border rounded-lg bg-muted/10 [&_summary::-webkit-details-marker]:hidden">
                      <summary className="cursor-pointer px-4 py-3 font-semibold text-sm text-foreground flex justify-between items-center list-none outline-none hover:bg-muted/30 transition rounded-lg">
                        <div className="flex items-center gap-2">
                          <svg className="w-4 h-4 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                          Payload Descriptions
                        </div>
                        <span className="transition group-open:rotate-180">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                        </span>
                      </summary>
                      <div className="px-4 pb-4 pt-2 text-sm text-muted-foreground border-t border-border/50">
                        <ul className="space-y-3 mt-2">
                          <li>
                            <code className="bg-muted px-1.5 py-0.5 rounded text-foreground font-mono text-xs">audio_base64</code>
                            <span className="text-[10px] uppercase tracking-wider bg-orange-500/10 text-orange-500 font-bold px-1.5 py-0.5 rounded ml-2">Required</span>
                            <p className="mt-1 ml-1 text-xs">The base64 encoded audio string representing the source audio file.</p>
                          </li>
                          <li>
                            <code className="bg-muted px-1.5 py-0.5 rounded text-foreground font-mono text-xs">source_language</code>
                            <span className="text-[10px] uppercase tracking-wider bg-gray-500/10 text-gray-400 font-bold px-1.5 py-0.5 rounded ml-2">Optional</span>
                            <p className="mt-1 ml-1 text-xs">ISO code. If 'auto' or omitted, the API will auto-detect the spoken language.</p>
                          </li>
                          <li>
                            <code className="bg-muted px-1.5 py-0.5 rounded text-foreground font-mono text-xs">target_language</code>
                            <span className="text-[10px] uppercase tracking-wider bg-orange-500/10 text-orange-500 font-bold px-1.5 py-0.5 rounded ml-2">Required</span>
                            <p className="mt-1 ml-1 text-xs">ISO code of the language you want to translate the speech into.</p>
                          </li>
                        </ul>
                      </div>
                    </details>
                  </div>
                </div>

                {/* Speech to Text */}
                <div className="glass-card border border-border rounded-xl overflow-hidden shadow-md">
                  <div className="px-6 py-4 border-b border-border flex items-center justify-between bg-muted/30">
                    <h3 className="text-xl font-bold text-foreground">Transcribe Speech (Speech to Text)</h3>
                    <span className="px-3 py-1 bg-green-500/10 text-green-500 rounded text-sm font-bold border border-green-500/20">POST</span>
                  </div>
                  <div className="p-6">
                    <code className="inline-block px-3 py-1 rounded bg-muted text-sm text-foreground font-mono mb-6 border border-border">/api/v1/translation/speech/stt/</code>
                    <p className="text-muted-foreground mb-6">Accepts an audio file and returns the translated text transcription.</p>
                    
                    <div className="grid lg:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 5l7 7-7 7M5 5l7 7-7 7"></path></svg>
                          Request (Multipart/form-data)
                        </div>
                        <div className="bg-gray-950 rounded-lg p-4 border border-gray-800 overflow-x-auto">
                          <pre className="text-xs text-blue-300 font-mono leading-relaxed">
{`audio_file: <File.mp3>
source_language: "es"
target_language: "en"`}
                          </pre>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                          <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                          Response (200 OK)
                        </div>
                        <div className="bg-gray-950 rounded-lg p-4 border border-gray-800 overflow-x-auto">
                          <pre className="text-xs text-green-300 font-mono leading-relaxed">
{`{
  "success": true,
  "original_text": "Buenos días",
  "translated_text": "Good morning",
  "cost_incurred": 0.03
}`}
                          </pre>
                        </div>
                      </div>
                    </div>

                    {/* Collapsible Payload Description */}
                    <details className="mt-6 group border border-border rounded-lg bg-muted/10 [&_summary::-webkit-details-marker]:hidden">
                      <summary className="cursor-pointer px-4 py-3 font-semibold text-sm text-foreground flex justify-between items-center list-none outline-none hover:bg-muted/30 transition rounded-lg">
                        <div className="flex items-center gap-2">
                          <svg className="w-4 h-4 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                          Payload Descriptions
                        </div>
                        <span className="transition group-open:rotate-180">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                        </span>
                      </summary>
                      <div className="px-4 pb-4 pt-2 text-sm text-muted-foreground border-t border-border/50">
                        <ul className="space-y-3 mt-2">
                          <li>
                            <code className="bg-muted px-1.5 py-0.5 rounded text-foreground font-mono text-xs">audio_file</code>
                            <span className="text-[10px] uppercase tracking-wider bg-orange-500/10 text-orange-500 font-bold px-1.5 py-0.5 rounded ml-2">Required</span>
                            <p className="mt-1 ml-1 text-xs">The raw audio file uploaded via Multipart/form-data.</p>
                          </li>
                          <li>
                            <code className="bg-muted px-1.5 py-0.5 rounded text-foreground font-mono text-xs">source_language</code>
                            <span className="text-[10px] uppercase tracking-wider bg-gray-500/10 text-gray-400 font-bold px-1.5 py-0.5 rounded ml-2">Optional</span>
                            <p className="mt-1 ml-1 text-xs">ISO code. If omitted, the API will attempt to auto-detect the spoken language.</p>
                          </li>
                          <li>
                            <code className="bg-muted px-1.5 py-0.5 rounded text-foreground font-mono text-xs">target_language</code>
                            <span className="text-[10px] uppercase tracking-wider bg-orange-500/10 text-orange-500 font-bold px-1.5 py-0.5 rounded ml-2">Required</span>
                            <p className="mt-1 ml-1 text-xs">ISO code of the language you want to transcribe the speech into.</p>
                          </li>
                        </ul>
                      </div>
                    </details>
                  </div>
                </div>

                {/* Text to Speech */}
                <div className="glass-card border border-border rounded-xl overflow-hidden shadow-md">
                  <div className="px-6 py-4 border-b border-border flex items-center justify-between bg-muted/30">
                    <h3 className="text-xl font-bold text-foreground">Synthesize Speech (Text to Speech)</h3>
                    <span className="px-3 py-1 bg-green-500/10 text-green-500 rounded text-sm font-bold border border-green-500/20">POST</span>
                  </div>
                  <div className="p-6">
                    <code className="inline-block px-3 py-1 rounded bg-muted text-sm text-foreground font-mono mb-6 border border-border">/api/v1/translation/speech/tts/</code>
                    <p className="text-muted-foreground mb-6">Accepts text payload and synthesizes high-quality audio in the target language.</p>
                    
                    <div className="grid lg:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 5l7 7-7 7M5 5l7 7-7 7"></path></svg>
                          Request Payload
                        </div>
                        <div className="bg-gray-950 rounded-lg p-4 border border-gray-800 overflow-x-auto">
                          <pre className="text-xs text-blue-300 font-mono leading-relaxed">
{`{
  "text": "The weather is nice today.",
  "target_language": "de",
  "voice_id": "echo_neutral_01"
}`}
                          </pre>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                          <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                          Response (200 OK)
                        </div>
                        <div className="bg-gray-950 rounded-lg p-4 border border-gray-800 overflow-x-auto">
                          <pre className="text-xs text-green-300 font-mono leading-relaxed">
{`{
  "success": true,
  "audio_url": "https://cdn.letecho.com/...",
  "duration_seconds": 3.4,
  "cost_incurred": 0.005
}`}
                          </pre>
                        </div>
                      </div>
                    </div>

                    {/* Collapsible Payload Description */}
                    <details className="mt-6 group border border-border rounded-lg bg-muted/10 [&_summary::-webkit-details-marker]:hidden">
                      <summary className="cursor-pointer px-4 py-3 font-semibold text-sm text-foreground flex justify-between items-center list-none outline-none hover:bg-muted/30 transition rounded-lg">
                        <div className="flex items-center gap-2">
                          <svg className="w-4 h-4 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                          Payload Descriptions
                        </div>
                        <span className="transition group-open:rotate-180">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                        </span>
                      </summary>
                      <div className="px-4 pb-4 pt-2 text-sm text-muted-foreground border-t border-border/50">
                        <ul className="space-y-3 mt-2">
                          <li>
                            <code className="bg-muted px-1.5 py-0.5 rounded text-foreground font-mono text-xs">text</code>
                            <span className="text-[10px] uppercase tracking-wider bg-orange-500/10 text-orange-500 font-bold px-1.5 py-0.5 rounded ml-2">Required</span>
                            <p className="mt-1 ml-1 text-xs">The text you want to synthesize into speech.</p>
                          </li>
                          <li>
                            <code className="bg-muted px-1.5 py-0.5 rounded text-foreground font-mono text-xs">target_language</code>
                            <span className="text-[10px] uppercase tracking-wider bg-orange-500/10 text-orange-500 font-bold px-1.5 py-0.5 rounded ml-2">Required</span>
                            <p className="mt-1 ml-1 text-xs">ISO code of the language to synthesize.</p>
                          </li>
                          <li>
                            <code className="bg-muted px-1.5 py-0.5 rounded text-foreground font-mono text-xs">voice_id</code>
                            <span className="text-[10px] uppercase tracking-wider bg-gray-500/10 text-gray-400 font-bold px-1.5 py-0.5 rounded ml-2">Optional</span>
                            <p className="mt-1 ml-1 text-xs">Specific voice model identifier (e.g., 'echo_neutral_01').</p>
                          </li>
                        </ul>
                      </div>
                    </details>
                  </div>
                </div>

                {/* Common Errors */}
                <div className="glass-card border border-red-500/20 rounded-xl overflow-hidden shadow-md">
                  <div className="px-6 py-4 border-b border-red-500/10 flex items-center justify-between bg-red-500/5">
                    <h3 className="text-xl font-bold text-red-500/90">Common Error Responses</h3>
                  </div>
                  <div className="p-6">
                    <div className="grid lg:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                          <svg className="w-4 h-4 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
                          Validation Error (400)
                        </div>
                        <div className="bg-gray-950 rounded-lg p-4 border border-gray-800 overflow-x-auto">
                          <pre className="text-xs text-red-300 font-mono leading-relaxed">
{`{
  "success": false,
  "error": "Missing required field: target_language"
}`}
                          </pre>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                          <svg className="w-4 h-4 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>
                          Insufficient Balance (402)
                        </div>
                        <div className="bg-gray-950 rounded-lg p-4 border border-gray-800 overflow-x-auto">
                          <pre className="text-xs text-orange-300 font-mono leading-relaxed">
{`{
  "success": false,
  "error": "Insufficient wallet balance. Please recharge to continue using the API."
}`}
                          </pre>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

              </div>
            </section>

            {/* Document Processing */}
            <section id="document-processing" className="scroll-mt-12">
              <h2 className="text-2xl font-bold text-foreground mb-4 border-b border-border pb-2">Document Processing (Async)</h2>
              <div className="space-y-6 mb-8">
                <div>
                  <h3 className="text-lg font-semibold mb-2">Asynchronous Translation</h3>
                  <p className="text-muted-foreground text-sm mb-2">
                    For large documents (PDF, DOCX, DOC, CSV, XLSX, XLS) or lengthy media files, processing cannot happen instantly. These requests are handled asynchronously.
                    You submit the document, receive a job ID immediately, and ECHO fires a Webhook to your server when the translation is complete.
                  </p>
                </div>
              </div>

              <div className="glass-card border border-border rounded-xl overflow-hidden shadow-md">
                <div className="px-6 py-4 border-b border-border flex items-center justify-between bg-muted/30">
                  <h3 className="text-xl font-bold text-foreground">Translate Document</h3>
                  <span className="px-3 py-1 bg-green-500/10 text-green-500 rounded text-sm font-bold border border-green-500/20">POST</span>
                </div>
                <div className="p-6">
                  <code className="inline-block px-3 py-1 rounded bg-muted text-sm text-foreground font-mono mb-6 border border-border">/api/v1/translation/document/</code>
                  
                  <div className="grid lg:grid-cols-2 gap-6">
                    {/* Request */}
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 5l7 7-7 7M5 5l7 7-7 7"></path></svg>
                        Request (Multipart/form-data)
                      </div>
                      
                      <div className="bg-gray-950 rounded-lg p-4 border border-gray-800 overflow-x-auto mb-4">
                        <pre className="text-xs text-blue-300 font-mono leading-relaxed">
{`document: <File.pdf>
source_language: "auto"
target_language: "fr"
webhook_url: "https://your-domain.com/webhook"`}
                        </pre>
                      </div>


                    </div>

                    {/* Response */}
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                        <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                        Response (202 Accepted)
                      </div>
                      <div className="bg-gray-950 rounded-lg p-4 border border-gray-800 overflow-x-auto">
                        <pre className="text-xs text-green-300 font-mono leading-relaxed">
{`{
  "success": true,
  "job_id": "doc_8f73b2a9c1",
  "status": "processing",
  "message": "Document accepted. Webhook will be fired upon completion."
}`}
                        </pre>
                      </div>
                    </div>
                    </div>
                    
                    {/* Collapsible Payload Description */}
                    <details className="mt-6 group border border-border rounded-lg bg-muted/10 [&_summary::-webkit-details-marker]:hidden">
                      <summary className="cursor-pointer px-4 py-3 font-semibold text-sm text-foreground flex justify-between items-center list-none outline-none hover:bg-muted/30 transition rounded-lg">
                        <div className="flex items-center gap-2">
                          <svg className="w-4 h-4 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                          Payload Descriptions
                        </div>
                        <span className="transition group-open:rotate-180">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                        </span>
                      </summary>
                      <div className="px-4 pb-4 pt-2 text-sm text-muted-foreground border-t border-border/50">
                        <ul className="space-y-3 mt-2">
                          <li>
                            <code className="bg-muted px-1.5 py-0.5 rounded text-foreground font-mono text-xs">document</code>
                            <span className="text-[10px] uppercase tracking-wider bg-orange-500/10 text-orange-500 font-bold px-1.5 py-0.5 rounded ml-2">Required</span>
                            <p className="mt-1 ml-1 text-xs">The file to be translated. Accepted formats: <code className="bg-muted px-1 rounded">.pdf</code> <code className="bg-muted px-1 rounded">.docx</code> <code className="bg-muted px-1 rounded">.doc</code> <code className="bg-muted px-1 rounded">.csv</code> <code className="bg-muted px-1 rounded">.xlsx</code> <code className="bg-muted px-1 rounded">.xls</code>. Uploaded via <code className="bg-muted px-1 rounded">multipart/form-data</code>.</p>
                          </li>
                          <li>
                            <code className="bg-muted px-1.5 py-0.5 rounded text-foreground font-mono text-xs">target_language</code>
                            <span className="text-[10px] uppercase tracking-wider bg-orange-500/10 text-orange-500 font-bold px-1.5 py-0.5 rounded ml-2">Required</span>
                            <p className="mt-1 ml-1 text-xs">ISO 639-1 code of the target language.</p>
                          </li>
                          <li>
                            <code className="bg-muted px-1.5 py-0.5 rounded text-foreground font-mono text-xs">webhook_url</code>
                            <span className="text-[10px] uppercase tracking-wider bg-orange-500/10 text-orange-500 font-bold px-1.5 py-0.5 rounded ml-2">Required</span>
                            <p className="mt-1 ml-1 text-xs">URL to receive the translated payload when processing is completed asynchronously.</p>
                          </li>
                          <li>
                            <code className="bg-muted px-1.5 py-0.5 rounded text-foreground font-mono text-xs">source_language</code>
                            <span className="text-[10px] uppercase tracking-wider bg-gray-500/10 text-gray-400 font-bold px-1.5 py-0.5 rounded ml-2">Optional</span>
                            <p className="mt-1 ml-1 text-xs">Original language ISO code. Defaults to "auto" for auto-detection.</p>
                          </li>
                        </ul>
                      </div>
                    </details>
                  </div>
                </div>
            </section>

            {/* Supported File Types */}
            <section id="file-types" className="scroll-mt-12">
              <h2 className="text-2xl font-bold text-foreground mb-4 border-b border-border pb-2">Supported File Types</h2>
              <p className="mb-6 text-muted-foreground">Only the formats listed below are accepted. Requests with any other file type will be rejected with a 400 error.</p>

              <div className="grid md:grid-cols-2 gap-6">
                {/* Documents */}
                <div className="glass-card p-6 rounded-xl border border-border shadow-sm">
                  <div className="flex items-center gap-2 mb-4">
                    <svg className="w-5 h-5 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
                    <h3 className="font-bold text-foreground">Documents</h3>
                    <span className="text-xs text-muted-foreground ml-auto">Document Translation API</span>
                  </div>
                  <div className="space-y-3">
                    {[
                      { ext: '.pdf', label: 'PDF', desc: 'Text-based and scanned PDFs' },
                      { ext: '.docx', label: 'Word (DOCX)', desc: 'Microsoft Word 2007+' },
                      { ext: '.doc', label: 'Word (DOC)', desc: 'Microsoft Word legacy' },
                      { ext: '.csv', label: 'CSV', desc: 'Comma-separated values — text cells only' },
                      { ext: '.xlsx', label: 'Excel (XLSX)', desc: 'Excel 2007+ workbook' },
                      { ext: '.xls', label: 'Excel (XLS)', desc: 'Excel legacy workbook' },
                    ].map(({ ext, label, desc }) => (
                      <div key={ext} className="flex items-start gap-3">
                        <span className="shrink-0 inline-block px-2 py-0.5 rounded bg-orange-500/10 text-orange-400 font-mono text-xs border border-orange-500/20 mt-0.5">{ext}</span>
                        <div>
                          <p className="text-sm font-medium text-foreground">{label}</p>
                          <p className="text-xs text-muted-foreground">{desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Audio */}
                <div className="glass-card p-6 rounded-xl border border-border shadow-sm">
                  <div className="flex items-center gap-2 mb-4">
                    <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3"></path></svg>
                    <h3 className="font-bold text-foreground">Audio</h3>
                    <span className="text-xs text-muted-foreground ml-auto">Speech APIs</span>
                  </div>
                  <div className="space-y-3">
                    {[
                      { ext: '.wav', label: 'WAV', desc: 'Lossless — best quality' },
                      { ext: '.mp3', label: 'MP3', desc: 'Most common compressed format' },
                      { ext: '.mp4', label: 'MP4', desc: 'Audio stream extracted from video' },
                      { ext: '.webm', label: 'WebM', desc: 'Browser-recorded audio' },
                      { ext: '.opus', label: 'Opus', desc: 'Low-latency compressed audio' },
                      { ext: '.ogg', label: 'OGG', desc: 'Open container format' },
                    ].map(({ ext, label, desc }) => (
                      <div key={ext} className="flex items-start gap-3">
                        <span className="shrink-0 inline-block px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 font-mono text-xs border border-blue-500/20 mt-0.5">{ext}</span>
                        <div>
                          <p className="text-sm font-medium text-foreground">{label}</p>
                          <p className="text-xs text-muted-foreground">{desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-4 p-4 rounded-lg bg-yellow-500/5 border border-yellow-500/20">
                <p className="text-xs text-yellow-400">
                  <strong>CSV &amp; Excel note:</strong> Only cells containing natural-language text are translated. Numeric values, dates, and formulas are preserved as-is.
                </p>
              </div>
            </section>

            {/* Webhooks */}
            <section id="webhooks" className="scroll-mt-12">
              <h2 className="text-2xl font-bold text-foreground mb-4 border-b border-border pb-2">Webhooks & Security</h2>
              <p className="mb-6 text-muted-foreground">
                Long-running document tasks notify your server upon completion via Webhooks.
                ECHO signs webhook events so you can verify they originated securely from us.
              </p>
              
              <div className="space-y-8">
                <div className="glass-card border border-border rounded-xl p-6 shadow-md">
                  <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                    <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path></svg>
                    1. Signature Verification
                  </h3>
                  <p className="text-sm mb-4 text-muted-foreground">
                    We include an <code className="bg-muted px-1 py-0.5 rounded text-foreground font-mono">X-Echo-Signature</code> header with every webhook payload.
                    The signature is an HMAC SHA-256 hash of the raw request body using your <strong>Client Secret</strong> as the key. Always verify this signature to prevent replay attacks and spoofing.
                  </p>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-muted-foreground font-semibold mb-2 ml-1">Node.js</p>
                      <div className="bg-gray-950 rounded-lg p-4 border border-gray-800 overflow-x-auto h-full">
                        <pre className="text-xs text-blue-300 font-mono leading-relaxed">
{`import crypto from 'crypto';

const verifyWebhook = (reqBody, signature, secret) => {
  const hash = crypto.createHmac('sha256', secret)
                     .update(reqBody)
                     .digest('hex');
  return hash === signature;
};`}
                        </pre>
                      </div>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground font-semibold mb-2 ml-1">Python</p>
                      <div className="bg-gray-950 rounded-lg p-4 border border-gray-800 overflow-x-auto h-full">
                        <pre className="text-xs text-blue-300 font-mono leading-relaxed">
{`import hmac
import hashlib

def verify_webhook(req_body: bytes, signature: str, secret: str) -> bool:
    expected = hmac.new(
        secret.encode('utf-8'),
        req_body,
        hashlib.sha256
    ).hexdigest()
    return hmac.compare_digest(expected, signature)`}
                        </pre>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="glass-card border border-border rounded-xl p-6 shadow-md">
                  <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                    <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
                    2. Webhook Event Payload
                  </h3>
                  <p className="text-sm mb-4 text-muted-foreground">
                    When the document processing completes, ECHO sends a POST request to your specified `webhook_url` containing the final file location. Your endpoint must respond with a `200 OK`.
                  </p>
                  
                  <div className="bg-gray-950 rounded-lg p-4 border border-gray-800 overflow-x-auto mb-6">
                    <pre className="text-xs text-green-300 font-mono leading-relaxed">
{`{
  "event_type": "document.translation.completed",
  "job_id": "doc_8f73b2a9c1",
  "data": {
    "status": "success",
    "document_type": "t2t",
    "source_language": "en",
    "target_language": "fr",
    "original_file_name": "report.pdf",
    "translated_file_url": "https://cdn.letecho.com/docs/translated_report.pdf",
    "cost_incurred": 0.45
  },
  "created_at": "2026-06-14T21:15:00Z"
}`}
                    </pre>
                  </div>

                  <h4 className="text-sm font-bold text-foreground border-b border-border pb-1 mb-3">Payload Structure</h4>
                  <div className="space-y-2">
                    <div className="text-sm flex justify-between border-b border-muted pb-2">
                      <div>
                        <code className="text-blue-400">event_type</code>
                        <p className="text-xs text-muted-foreground mt-1">Identifies the type of webhook. E.g., <code className="bg-muted px-1 rounded text-foreground">document.translation.completed</code>, <code className="bg-muted px-1 rounded text-foreground">audio.translation.completed</code>, or <code className="bg-muted px-1 rounded text-foreground">*.failed</code>.</p>
                      </div>
                    </div>
                    <div className="text-sm flex justify-between border-b border-muted pb-2">
                      <div>
                        <code className="text-blue-400">data.document_type</code>
                        <p className="text-xs text-muted-foreground mt-1">The type of translation performed. Options: <code className="bg-muted px-1 rounded text-foreground">t2t</code>, <code className="bg-muted px-1 rounded text-foreground">s2s</code>, <code className="bg-muted px-1 rounded text-foreground">t2s</code>, <code className="bg-muted px-1 rounded text-foreground">s2t</code>.</p>
                      </div>
                    </div>
                    <div className="text-sm flex justify-between border-b border-muted pb-2">
                      <div>
                        <code className="text-blue-400">data.translated_file_url</code>
                        <p className="text-xs text-muted-foreground mt-1">The secure URL to download the translated document or audio. Expires in 24 hours.</p>
                      </div>
                    </div>
                  </div>
                </div>

              </div>
            </section>

          </div>
        </main>
      </div>
      <Footer />
    </div>
  );
}
