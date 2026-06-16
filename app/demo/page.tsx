"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Mic,
  Square,
  ArrowLeftRight,
  ChevronDown,
  ArrowRight,
  Sparkles,
  Lock,
  Play,
  Pause,
  Copy,
} from "lucide-react";
import { fetchVoiceLanguages, resolveMediaUrl, type Language } from "@/lib/api";
import LiveWaveform from "@/components/LiveWaveform";
import ReactCountryFlag from "react-country-flag";

const DEMO_KEY = "echo_demo_attempts";
const MAX_ATTEMPTS = 3;

const languageToCountry: Record<string, string> = {
  en: "GB", rw: "RW", fr: "FR", ar: "SA", pt: "PT",
  es: "ES", ha: "NG", ig: "NG", sw: "TZ", yo: "NG",
  de: "DE", zh: "CN", ja: "JP", ko: "KR", hi: "IN",
};

const DEMO_LANGUAGES: Language[] = [
  { code: "en", name: "English", native_name: "English", flag_emoji: "🇬🇧", speech_to_text_supported: true, text_to_speech_supported: true, text_to_text_supported: true, speech_to_speech_translation_supported: true, image_translation_supported: true, document_translation_supported: true, is_african_language: false },
  { code: "rw", name: "Kinyarwanda", native_name: "Kinyarwanda", flag_emoji: "🇷🇼", speech_to_text_supported: true, text_to_speech_supported: true, text_to_text_supported: true, speech_to_speech_translation_supported: true, image_translation_supported: true, document_translation_supported: true, is_african_language: true },
  { code: "sw", name: "Swahili", native_name: "Kiswahili", flag_emoji: "🇰🇪", speech_to_text_supported: true, text_to_speech_supported: true, text_to_text_supported: true, speech_to_speech_translation_supported: true, image_translation_supported: true, document_translation_supported: true, is_african_language: true },
  { code: "fr", name: "French", native_name: "Français", flag_emoji: "🇫🇷", speech_to_text_supported: true, text_to_speech_supported: true, text_to_text_supported: true, speech_to_speech_translation_supported: true, image_translation_supported: true, document_translation_supported: true, is_african_language: false },
  { code: "es", name: "Spanish", native_name: "Español", flag_emoji: "🇪🇸", speech_to_text_supported: true, text_to_speech_supported: true, text_to_text_supported: true, speech_to_speech_translation_supported: true, image_translation_supported: true, document_translation_supported: true, is_african_language: false },
  { code: "ar", name: "Arabic", native_name: "العربية", flag_emoji: "🇸🇦", speech_to_text_supported: true, text_to_speech_supported: true, text_to_text_supported: true, speech_to_speech_translation_supported: true, image_translation_supported: true, document_translation_supported: true, is_african_language: false },
  { code: "pt", name: "Portuguese", native_name: "Português", flag_emoji: "🇵🇹", speech_to_text_supported: true, text_to_speech_supported: true, text_to_text_supported: true, speech_to_speech_translation_supported: true, image_translation_supported: true, document_translation_supported: true, is_african_language: false },
  { code: "ha", name: "Hausa", native_name: "Hausa", flag_emoji: "🇳🇬", speech_to_text_supported: true, text_to_speech_supported: true, text_to_text_supported: true, speech_to_speech_translation_supported: true, image_translation_supported: true, document_translation_supported: true, is_african_language: true },
  { code: "yo", name: "Yoruba", native_name: "Yorùbá", flag_emoji: "🇳🇬", speech_to_text_supported: true, text_to_speech_supported: true, text_to_text_supported: true, speech_to_speech_translation_supported: true, image_translation_supported: true, document_translation_supported: true, is_african_language: true },
  { code: "ig", name: "Igbo", native_name: "Igbo", flag_emoji: "🇳🇬", speech_to_text_supported: true, text_to_speech_supported: true, text_to_text_supported: true, speech_to_speech_translation_supported: true, image_translation_supported: true, document_translation_supported: true, is_african_language: true },
];

interface DemoTranslationResult {
  id: string;
  original_text: string;
  translated_text: string;
  original_language: string;
  target_language: string;
  original_audio_url: string;
  translated_audio_url: string;
  confidence_score: number;
  total_processing_time: number;
  trial_attempts_used?: number;
  trial_attempts_remaining?: number;
}

function getStoredAttempts(): number {
  if (typeof window === "undefined") return 0;
  return parseInt(localStorage.getItem(DEMO_KEY) || "0", 10);
}

function incrementAttempts(): number {
  const next = getStoredAttempts() + 1;
  localStorage.setItem(DEMO_KEY, String(next));
  return next;
}

export default function DemoPage() {
  const router = useRouter();
  const [languages, setLanguages] = useState<Language[]>(DEMO_LANGUAGES);
  const [inputLang, setInputLang] = useState<Language>(DEMO_LANGUAGES[0]);
  const [outputLang, setOutputLang] = useState<Language>(DEMO_LANGUAGES[1]);
  const [showInputDropdown, setShowInputDropdown] = useState(false);
  const [showOutputDropdown, setShowOutputDropdown] = useState(false);

  const [isRecording, setIsRecording] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [recordingSecs, setRecordingSecs] = useState(0);
  const [liveAnalyser, setLiveAnalyser] = useState<AnalyserNode | null>(null);
  const [result, setResult] = useState<DemoTranslationResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [attemptsUsed, setAttemptsUsed] = useState(0);
  const [limitReached, setLimitReached] = useState(false);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const mimeTypeRef = useRef<string>("audio/webm");
  const isRecordingRef = useRef(false);

  const attemptsLeft = MAX_ATTEMPTS - attemptsUsed;

  useEffect(() => {
    const stored = getStoredAttempts();
    setAttemptsUsed(stored);
    if (stored >= MAX_ATTEMPTS) setLimitReached(true);
  }, []);

  // Sync ref so the Space-key handler always reads the current isRecording value
  useEffect(() => { isRecordingRef.current = isRecording; }, [isRecording]);

  // Space key = start / stop recording
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.code !== "Space") return;
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      e.preventDefault();
      if (isRecordingRef.current) {
        if (mediaRecorderRef.current) {
          mediaRecorderRef.current.stop();
          setIsRecording(false);
        }
      } else if (!limitReached) {
        startRecording();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [limitReached]);

  useEffect(() => {
    fetchVoiceLanguages().then((data) => {
      if (data.languages.length > 0) {
        setLanguages(data.languages);
        setInputLang(l => data.languages.find((x) => x.code === l.code) || data.languages[0]);
        setOutputLang(l => data.languages.find((x) => x.code === l.code) || data.languages[1]);
      }
    }).catch(() => {});
  }, []);

  const swapLanguages = () => {
    setInputLang(outputLang);
    setOutputLang(inputLang);
  };

  const startRecording = async () => {
    if (limitReached) return;
    setError(null);
    setResult(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

      // Pick best supported MIME type for this browser
      const preferredTypes = [
        "audio/webm;codecs=opus", "audio/webm",
        "audio/ogg;codecs=opus", "audio/ogg", "audio/mp4",
      ];
      const mimeType = preferredTypes.find((t) => MediaRecorder.isTypeSupported(t)) ?? "";
      mimeTypeRef.current = mimeType || "audio/webm";

      const mediaRecorder = new MediaRecorder(stream, mimeType ? { mimeType } : undefined);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      // AudioContext — must resume() explicitly (browsers start it suspended)
      const audioContext = new AudioContext();
      audioContextRef.current = audioContext;
      await audioContext.resume();

      const analyser = audioContext.createAnalyser();
      analyser.fftSize = 2048;
      analyser.smoothingTimeConstant = 0.5;
      audioContext.createMediaStreamSource(stream).connect(analyser);
      setLiveAnalyser(analyser);

      setRecordingSecs(0);
      timerRef.current = setInterval(() => setRecordingSecs((s) => s + 1), 1000);

      mediaRecorder.ondataavailable = (e) => {
        if (e.data && e.data.size > 0) audioChunksRef.current.push(e.data);
      };

      mediaRecorder.onstop = async () => {
        if (timerRef.current) clearInterval(timerRef.current);
        stream.getTracks().forEach((t) => t.stop());
        setLiveAnalyser(null);
        audioContextRef.current?.close();
        audioContextRef.current = null;

        const chunks = audioChunksRef.current;
        console.log(`[Demo] stopped — ${chunks.length} chunks, ${chunks.reduce((s, c) => s + c.size, 0)} bytes`);

        if (chunks.length === 0) {
          setError("No audio data captured. Please try again.");
          return;
        }
        const blob = new Blob(chunks, { type: mimeTypeRef.current });
        await submitAudio(blob);
      };

      mediaRecorder.start(100); // timeslice: collect data every 100ms
      setIsRecording(true);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "";
      setError(
        msg.toLowerCase().includes("denied") || msg.toLowerCase().includes("permission")
          ? "Microphone access denied. Please allow access to use the demo."
          : `Could not start recording: ${msg || "Unknown error"}`
      );
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const submitAudio = async (blob: Blob) => {
    setIsLoading(true);
    try {
      const ext = mimeTypeRef.current.includes("ogg") ? "ogg"
               : mimeTypeRef.current.includes("mp4") ? "mp4" : "webm";
      const formData = new FormData();
      formData.append("audio_file", blob, `recording.${ext}`);
      formData.append("source_language", inputLang.code);
      formData.append("target_language", outputLang.code);

      console.log("[Demo] → POST /api/demo/translate", {
        source: inputLang.code, target: outputLang.code,
        mimeType: mimeTypeRef.current, size: `${(blob.size / 1024).toFixed(1)} KB`,
      });

      const response = await fetch("/api/demo/translate", { method: "POST", body: formData });
      const data = await response.json();
      console.log("[Demo] ← Response", response.status, data);

      if (!response.ok) {
        if (response.status === 403 && data.error === "TRIAL_LIMIT_REACHED") {
          setLimitReached(true);
          setAttemptsUsed(MAX_ATTEMPTS);
          localStorage.setItem(DEMO_KEY, String(MAX_ATTEMPTS));
          return;
        }
        throw new Error(data.message || data.error || "Translation failed. Please try again.");
      }

      if (typeof data.trial_attempts_used === "number") {
        setAttemptsUsed(data.trial_attempts_used);
        localStorage.setItem(DEMO_KEY, String(data.trial_attempts_used));
        if (data.trial_attempts_remaining === 0) setLimitReached(true);
      } else {
        const newCount = incrementAttempts();
        setAttemptsUsed(newCount);
        if (newCount >= MAX_ATTEMPTS) setLimitReached(true);
      }

      setResult(data);
      if (data.translated_audio_url) {
        new Audio(resolveMediaUrl(data.translated_audio_url)!).play();
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Translation failed");
    } finally {
      setIsLoading(false);
    }
  };

  const handleMicClick = () => isRecording ? stopRecording() : startRecording();
  const attemptDots = Array.from({ length: MAX_ATTEMPTS }, (_, i) => i < attemptsLeft);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="glass-nav sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
          <button onClick={() => router.push("/")} className="flex items-center gap-2 transition-opacity hover:opacity-80">
            <img src="/images/logo_v2.png" alt="ECHO Logo" className="w-auto h-6 md:h-7 object-contain dark:invert" />
          </button>
          <div className="flex items-center gap-3">
            <Link href="/login" className="text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors">Sign in</Link>
            <Link href="/signup" className="african-gradient text-white text-sm font-bold px-4 py-2 rounded-full hover:opacity-90 transition shadow-sm">
              Create Account
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-10 pb-20">
        {/* Hero badge */}
        <div className="flex justify-center mb-6">
          <span className="inline-flex items-center gap-2 bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400 text-xs font-bold px-4 py-2 rounded-full border border-orange-200 dark:border-orange-700">
            <Sparkles className="w-3.5 h-3.5" /> Live Demo — No account required
          </span>
        </div>

        <h1 className="text-3xl sm:text-4xl font-extrabold text-center text-foreground mb-3">
          Try Echo <span className="text-[#F97316]">Speech-to-Speech</span>
        </h1>
        <p className="text-center text-muted-foreground text-base mb-6 max-w-xl mx-auto">
          Speak in any language, hear the translation spoken back instantly. You have{" "}
          <strong>{attemptsLeft} free attempt{attemptsLeft !== 1 ? "s" : ""}</strong> — no sign-up needed.
        </p>

        {/* Attempt counter */}
        <div className="flex items-center justify-center gap-3 mb-8">
          <span className="text-sm font-medium text-muted-foreground">Attempts remaining:</span>
          <div className="flex gap-2">
            {attemptDots.map((available, i) => (
              <div key={i} className={`w-3 h-3 rounded-full transition-all duration-500 ${
                available ? "bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]" : "bg-gray-300 dark:bg-gray-600"
              }`} />
            ))}
          </div>
          <span className="text-sm font-bold text-foreground">{attemptsLeft}/{MAX_ATTEMPTS}</span>
        </div>

        {limitReached ? (
          <LimitReachedCard />
        ) : (
          <div className="space-y-6">
            {/* ── VoiceCard-style recording panel ─────────────────────── */}
            <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-xl p-6 sm:p-8 lg:p-12 flex-1 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-green-50 dark:from-green-900/10 via-transparent to-orange-50 dark:to-orange-900/10 pointer-events-none" />

              {/* Language selector row — same style as VoiceCard's Lang badges */}
              <div className="relative flex items-center justify-center mb-8 sm:mb-12 gap-3">
                <LangSelector
                  lang={inputLang}
                  sub="INPUT"
                  color="green"
                  languages={languages}
                  isOpen={showInputDropdown}
                  onToggle={() => { setShowInputDropdown(!showInputDropdown); setShowOutputDropdown(false); }}
                  onSelect={(l) => { setInputLang(l); setShowInputDropdown(false); }}
                />
                <button
                  onClick={swapLanguages}
                  className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center shrink-0 hover:bg-gray-200 dark:hover:bg-gray-600 transition"
                  title="Swap languages"
                >
                  <ArrowLeftRight size={14} className="dark:text-white" />
                </button>
                <LangSelector
                  lang={outputLang}
                  sub="OUTPUT"
                  color="orange"
                  languages={languages}
                  isOpen={showOutputDropdown}
                  onToggle={() => { setShowOutputDropdown(!showOutputDropdown); setShowInputDropdown(false); }}
                  onSelect={(l) => { setOutputLang(l); setShowOutputDropdown(false); }}
                />
              </div>

              {/* Mic + waveform — identical to VoiceCard */}
              <div className="relative flex flex-col items-center text-center gap-4 sm:gap-6">
                <h2 className="text-xl sm:text-2xl lg:text-3xl font-semibold dark:text-white">
                  {isRecording
                    ? `Recording… ${recordingSecs}s`
                    : isLoading
                    ? "Processing, please wait…"
                    : "Ready to translate"}
                </h2>
                <p className="text-gray-500 dark:text-gray-400 text-sm sm:text-base">
                  {isRecording
                    ? `Speaking in ${inputLang.name} — click ■ to stop`
                    : isLoading
                    ? `Converting ${inputLang.name} → ${outputLang.name}…`
                    : "Click the microphone to start recording"}
                </p>

                <div className="flex flex-col items-center gap-4">
                  <button
                    onClick={handleMicClick}
                    disabled={isLoading}
                    id="demo-mic-button"
                    className={`w-20 h-20 sm:w-28 sm:h-28 rounded-full text-white flex items-center justify-center shadow-2xl transition-all duration-75 ${
                      isRecording
                        ? "bg-red-500 shadow-red-300 scale-110"
                        : isLoading
                        ? "bg-gray-400 cursor-not-allowed"
                        : "bg-green-500 shadow-green-300 hover:scale-110"
                    }`}
                  >
                    {isRecording ? (
                      <Square size={32} className="sm:w-10 sm:h-10" />
                    ) : isLoading ? (
                      <div className="w-8 h-8 border-4 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <Mic size={32} className="sm:w-10 sm:h-10" />
                    )}
                  </button>

                  <LiveWaveform analyser={liveAnalyser} bars={40} height={72} className="mt-2" />
                </div>

                <span className="text-xs sm:text-sm text-gray-400 dark:text-gray-500 mt-2 sm:mt-4">
                  <kbd className="px-2 py-1 bg-gray-200 dark:bg-gray-700 dark:text-gray-300 rounded-md text-gray-600">Space</kbd>{" "}
                  to {isRecording ? "stop" : "speak"}
                </span>
              </div>
            </div>

            {/* Error */}
            {error && (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4 text-red-700 dark:text-red-400 text-sm font-medium text-center">
                {error}
              </div>
            )}

            {/* Result — same TranslationResult style */}
            {result && (
              <DemoResultCard
                result={result}
                inputLang={inputLang}
                outputLang={outputLang}
              />
            )}

            {/* Trust indicators */}
            <div className="mt-4 grid grid-cols-3 gap-4 text-center">
              {[
                { icon: "🔒", label: "No account needed" },
                { icon: "⚡", label: "Real-time AI" },
                { icon: "🌍", label: "50+ languages" },
              ].map((item) => (
                <div key={item.label} className="bg-white dark:bg-gray-900 border border-[#b9ced5] dark:border-gray-700 rounded-xl p-4">
                  <div className="text-2xl mb-1">{item.icon}</div>
                  <p className="text-xs font-semibold text-muted-foreground">{item.label}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

// ── LangSelector: VoiceCard Lang badge + click-to-expand dropdown ──────────
function LangSelector({
  lang, sub, color, languages, isOpen, onToggle, onSelect,
}: {
  lang: Language; sub: string; color: "green" | "orange";
  languages: Language[]; isOpen: boolean;
  onToggle: () => void; onSelect: (l: Language) => void;
}) {
  const countryCode = languageToCountry[lang.code] ?? lang.code.toUpperCase();
  return (
    <div className="relative flex flex-col items-center gap-1 sm:gap-2">
      <button
        onClick={onToggle}
        className="flex flex-col items-center gap-1 group"
        title={`Change ${sub.toLowerCase()} language`}
      >
        <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center border-2 transition ${
          color === "green"
            ? "bg-green-100 dark:bg-green-900/30 border-green-200 dark:border-green-700 group-hover:border-green-400"
            : "bg-orange-100 dark:bg-orange-900/30 border-orange-200 dark:border-orange-700 group-hover:border-orange-400"
        }`}>
          <ReactCountryFlag countryCode={countryCode} svg style={{ width: "1.8em", height: "1.8em" }} />
        </div>
        <span className="font-semibold text-sm sm:text-base dark:text-white flex items-center gap-1">
          {lang.code.toUpperCase()} {lang.name}
          <ChevronDown className="w-3 h-3 opacity-50" />
        </span>
        <span className="text-xs sm:text-sm text-gray-400 dark:text-gray-500">{sub}</span>
      </button>

      {isOpen && (
        <div className="absolute top-full mt-2 bg-popover border border-border rounded-xl shadow-xl max-h-52 overflow-y-auto z-50 min-w-[180px]">
          {languages.map((l) => (
            <button
              key={l.code}
              onClick={() => onSelect(l)}
              className={`w-full px-4 py-2.5 text-left hover:bg-muted text-sm flex items-center gap-2 border-b border-border last:border-b-0 text-foreground ${
                l.code === lang.code ? "bg-muted font-semibold" : ""
              }`}
            >
              <ReactCountryFlag
                countryCode={languageToCountry[l.code] ?? l.code.toUpperCase()}
                svg style={{ width: "1.1em", height: "1.1em" }}
              />
              {l.name}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// ── DemoResultCard: mirrors TranslationResult component exactly ─────────────
const btnClass = "border dark:border-gray-600 rounded-full px-3 py-1 flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 hover:text-orange-500 dark:hover:text-orange-400 transition-colors";

function DemoResultCard({
  result, inputLang, outputLang,
}: {
  result: DemoTranslationResult;
  inputLang: { code: string; name: string };
  outputLang: { code: string; name: string };
}) {
  const [playingOriginal, setPlayingOriginal] = useState(false);
  const [playingTranslated, setPlayingTranslated] = useState(false);
  const [copied, setCopied] = useState<"original" | "translated" | null>(null);
  const originalAudioRef = useRef<HTMLAudioElement>(null);
  const translatedAudioRef = useRef<HTMLAudioElement>(null);

  const toggleOriginal = () => {
    if (!originalAudioRef.current) return;
    if (playingOriginal) originalAudioRef.current.pause();
    else originalAudioRef.current.play();
    setPlayingOriginal(!playingOriginal);
  };

  const toggleTranslated = () => {
    if (!translatedAudioRef.current) return;
    if (playingTranslated) translatedAudioRef.current.pause();
    else translatedAudioRef.current.play();
    setPlayingTranslated(!playingTranslated);
  };

  const handleCopy = async (text: string, type: "original" | "translated") => {
    await navigator.clipboard.writeText(text);
    setCopied(type);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <div className="bg-white dark:bg-gray-900 border border-[#b9ced5] dark:border-gray-700 rounded-xl p-4 sm:p-6 hover:shadow-md transition">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        <div className="flex items-center gap-3">
          <span className="text-xs bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300 px-2 py-1 rounded-full font-medium">
            Voice
          </span>
          <span className="text-sm bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 px-3 py-1 rounded-full font-medium">
            {inputLang.code.toUpperCase()}
          </span>
          <ArrowRight className="w-4 h-4 text-gray-400 dark:text-gray-500" />
          <span className="text-sm bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-300 px-3 py-1 rounded-full font-medium">
            {outputLang.code.toUpperCase()}
          </span>
        </div>
        {result.confidence_score > 0 && (
          <span className="text-xs text-gray-400 dark:text-gray-500">
            {Math.round(result.confidence_score * 100)}% confidence
          </span>
        )}
      </div>

      {/* Cards */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Original */}
        <div className="space-y-2">
          <h4 className="font-bold text-gray-700 dark:text-gray-300">Original Text</h4>
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-700 dark:border-blue-700/50 rounded-lg p-4">
            <p className="text-gray-800 dark:text-gray-200 text-justify leading-relaxed mb-3 max-h-[120px] min-h-[60px] overflow-y-auto">
              {result.original_text}
            </p>
            <hr className="my-3 border-gray-300 dark:border-gray-600" />
            <div className="flex justify-between items-center">
              {result.original_audio_url && (
                <button onClick={toggleOriginal} className={btnClass}>
                  {playingOriginal ? <Pause size={16} /> : <Play size={16} />}
                  {playingOriginal ? "Pause" : "Listen"}
                </button>
              )}
              <button onClick={() => handleCopy(result.original_text, "original")} className={btnClass}>
                <Copy size={16} />
                {copied === "original" ? "Copied!" : "Copy"}
              </button>
            </div>
          </div>
          <audio ref={originalAudioRef} src={resolveMediaUrl(result.original_audio_url)} onEnded={() => setPlayingOriginal(false)} />
        </div>

        {/* Translated */}
        <div className="space-y-2">
          <h4 className="font-bold text-gray-700 dark:text-gray-300">Translation</h4>
          <div className="bg-green-50 dark:bg-green-900/20 border border-green-700 dark:border-green-700/50 rounded-lg p-4">
            <p className="text-gray-800 dark:text-gray-200 text-justify leading-relaxed mb-3 max-h-[120px] min-h-[60px] overflow-y-auto">
              {result.translated_text}
            </p>
            <hr className="my-3 border-gray-300 dark:border-gray-600" />
            <div className="flex justify-between items-center">
              {result.translated_audio_url && (
                <button onClick={toggleTranslated} className={btnClass}>
                  {playingTranslated ? <Pause size={16} /> : <Play size={16} />}
                  {playingTranslated ? "Pause" : "Listen"}
                </button>
              )}
              <button onClick={() => handleCopy(result.translated_text, "translated")} className={btnClass}>
                <Copy size={16} />
                {copied === "translated" ? "Copied!" : "Copy"}
              </button>
            </div>
          </div>
          <audio ref={translatedAudioRef} src={resolveMediaUrl(result.translated_audio_url)} onEnded={() => setPlayingTranslated(false)} />
        </div>
      </div>

      {/* CTA to sign up */}
      <div className="mt-6 pt-4 border-t border-gray-100 dark:border-gray-700 text-center">
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
          Loved it? Create a free account for unlimited translations.
        </p>
        <Link
          href="/signup"
          className="inline-flex items-center gap-2 african-gradient text-white px-6 py-2 rounded-full text-sm font-bold hover:opacity-90 transition"
        >
          Get Started Free <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}

function LimitReachedCard() {
  return (
    <div className="bg-white dark:bg-gray-900 border-2 border-orange-300 dark:border-orange-700 rounded-3xl p-8 sm:p-12 text-center shadow-xl">
      <div className="w-16 h-16 rounded-full bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center mx-auto mb-5">
        <Lock className="w-8 h-8 text-orange-500" />
      </div>
      <h2 className="text-2xl font-extrabold text-foreground mb-3">
        You&apos;ve used all 3 free demo attempts
      </h2>
      <p className="text-muted-foreground mb-8 max-w-sm mx-auto">
        Create a free account to continue translating — unlimited access with your free credits.
      </p>
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Link
          href="/signup"
          className="african-gradient text-white px-8 py-3 rounded-xl font-bold hover:opacity-90 transition shadow-lg shadow-orange-500/25 flex items-center justify-center gap-2"
        >
          Create Free Account <ArrowRight className="w-4 h-4" />
        </Link>
        <Link
          href="/login"
          className="border border-border bg-card text-foreground px-8 py-3 rounded-xl font-bold hover:bg-muted transition flex items-center justify-center"
        >
          Sign In
        </Link>
      </div>
      <p className="mt-6 text-xs text-muted-foreground">
        🔒 Limit enforced server-side — resetting browser storage won&apos;t bypass this.
      </p>
    </div>
  );
}
