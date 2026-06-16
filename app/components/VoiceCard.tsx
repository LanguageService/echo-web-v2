"use client";

import { ArrowLeftRight, Mic, Square } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import TranslationResult from "@/components/TranslationResult";
import ReactCountryFlag from "react-country-flag";
import NoFundsModal from "@/components/NoFundsModal";
import LiveWaveform from "@/components/LiveWaveform";
import { hasSufficientBalance, resolveMediaUrl } from "@/lib/api";

const languageToCountry: Record<string, string> = {
  EN: "GB", RW: "RW", FR: "FR", AR: "SA", PT: "PT",
  ES: "ES", HA: "NG", IG: "NG", SW: "TZ", YO: "NG",
};

interface SelectedLanguages {
  input: { code: string; name: string; native_name: string };
  output: { code: string; name: string; native_name: string };
}

interface TranslationResponse {
  id: string; title: string; mode: string; speech_service: string;
  audio_format: string; duration: number; original_audio_url: string;
  translated_audio_url: string; original_text: string; translated_text: string;
  status: string; original_language: string; target_language: string;
  confidence_score: number; total_processing_time: number; date_created: string;
}

export default function VoiceCard({ selectedLanguages }: { selectedLanguages?: SelectedLanguages }) {
  const inputLang = selectedLanguages?.input || { code: "en", name: "English", native_name: "English" };
  const outputLang = selectedLanguages?.output || { code: "rw", name: "Kinyarwanda", native_name: "Ikinyarwanda" };

  const [isRecording, setIsRecording] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [translationResult, setTranslationResult] = useState<TranslationResponse | null>(null);
  const [showNoFunds, setShowNoFunds] = useState(false);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const audioContextRef = useRef<AudioContext | null>(null);
  const mimeTypeRef = useRef<string>("audio/webm");
  const [liveAnalyser, setLiveAnalyser] = useState<AnalyserNode | null>(null);
  const isRecordingRef = useRef(false); // stable ref for Space handler

  // Sync ref whenever state changes so the keyboard handler always sees the current value
  useEffect(() => { isRecordingRef.current = isRecording; }, [isRecording]);

  // Space key = toggle recording (same as clicking the mic button)
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.code !== "Space") return;
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      e.preventDefault(); // prevent page scroll
      if (isRecordingRef.current) {
        // stop: call stop() directly on the recorder — avoids stale isRecording state
        if (mediaRecorderRef.current) {
          mediaRecorderRef.current.stop();
          setIsRecording(false);
        }
      } else {
        startRecording();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const startRecording = async () => {
    const sufficient = await hasSufficientBalance();
    if (!sufficient) { setShowNoFunds(true); return; }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

      // Detect the best supported MIME type for this browser
      const preferredTypes = [
        "audio/webm;codecs=opus", "audio/webm",
        "audio/ogg;codecs=opus", "audio/ogg", "audio/mp4",
      ];
      const mimeType = preferredTypes.find((t) => MediaRecorder.isTypeSupported(t)) ?? "";
      mimeTypeRef.current = mimeType || "audio/webm";

      const mediaRecorder = new MediaRecorder(stream, mimeType ? { mimeType } : undefined);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      // AudioContext starts "suspended" in most browsers — must resume() after user gesture
      const audioContext = new AudioContext();
      audioContextRef.current = audioContext;
      await audioContext.resume();

      const analyser = audioContext.createAnalyser();
      analyser.fftSize = 2048;
      analyser.smoothingTimeConstant = 0.5;
      audioContext.createMediaStreamSource(stream).connect(analyser);
      setLiveAnalyser(analyser);

      // Timeslice: collect chunks every 100ms so we always have data on stop
      mediaRecorder.ondataavailable = (e) => {
        if (e.data && e.data.size > 0) audioChunksRef.current.push(e.data);
      };

      mediaRecorder.onstop = async () => {
        stream.getTracks().forEach((t) => t.stop());
        setLiveAnalyser(null);
        audioContextRef.current?.close();
        audioContextRef.current = null;

        const chunks = audioChunksRef.current;
        if (chunks.length === 0) {
          console.warn("[VoiceCard] No audio data captured");
          return;
        }
        const audioBlob = new Blob(chunks, { type: mimeTypeRef.current });
        await uploadAudio(audioBlob);
      };

      mediaRecorder.start(100);
      setIsRecording(true);
    } catch (error) {
      console.error("Error accessing microphone:", error);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const uploadAudio = async (audioBlob: Blob) => {
    setIsLoading(true);
    try {
      const ext = mimeTypeRef.current.includes("ogg") ? "ogg"
               : mimeTypeRef.current.includes("mp4") ? "mp4" : "webm";
      const formData = new FormData();
      formData.append("audio_file", audioBlob, `recording.${ext}`);
      formData.append("source_language", inputLang.code);
      formData.append("target_language", outputLang.code);
      formData.append("speech_service", "STS");

      const token = localStorage.getItem("token");
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/translations/speech/base/`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      if (!response.ok) {
        if (response.status === 403) {
          const errorData = await response.json().catch(() => ({}));
          if (errorData.error === "TRIAL_LIMIT_REACHED") {
            alert(errorData.message || "You have reached your 3 free trials. Please create an account to continue.");
            window.location.href = "/signup";
            return;
          }
          setShowNoFunds(true);
          return;
        }
        throw new Error(`Translation failed: ${response.status}`);
      }

      const result: TranslationResponse = await response.json();
      setTranslationResult(result);
      if (result.translated_audio_url) new Audio(resolveMediaUrl(result.translated_audio_url)!).play();
    } catch (error) {
      console.error("Error uploading audio:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleMicClick = () => isRecording ? stopRecording() : startRecording();

  return (
    <>
      <div className="space-y-6">
        <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-xl p-6 sm:p-8 lg:p-12 flex-1 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-green-50 dark:from-green-900/10 via-transparent to-orange-50 dark:to-orange-900/10 pointer-events-none" />

          <div className="relative flex items-center justify-center mb-8 sm:mb-16 gap-3">
            <Lang code={inputLang.code} label={`${inputLang.code.toUpperCase()} ${inputLang.name}`} sub="INPUT" color="green" />
            <div className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center shrink-0">
              <ArrowLeftRight size={14} className="dark:text-white" />
            </div>
            <Lang code={outputLang.code} label={`${outputLang.code.toUpperCase()} ${outputLang.name}`} sub="OUTPUT" color="orange" />
          </div>

          <div className="relative flex flex-col items-center text-center gap-4 sm:gap-6">
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-semibold dark:text-white">
              {isRecording ? "Recording..." : isLoading ? "Processing please wait..." : "Ready to translate"}
            </h2>
            <p className="text-gray-500 dark:text-gray-400 text-sm sm:text-base">
              {isRecording ? "Click to stop recording" : "Click the microphone to start recording"}
            </p>

            <div className="flex flex-col items-center gap-4">
              <button
                onClick={handleMicClick}
                disabled={isLoading}
                className={`w-20 h-20 sm:w-28 sm:h-28 rounded-full text-white flex items-center justify-center shadow-2xl transition-all duration-75 ${
                  isRecording
                    ? "bg-red-500 shadow-red-300"
                    : isLoading
                    ? "bg-gray-400"
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

              {/* Real-time canvas waveform — always visible, idles when not recording */}
              <LiveWaveform
                analyser={liveAnalyser}
                bars={40}
                height={72}
                className="mt-2"
              />
            </div>

            <span className="text-xs sm:text-sm text-gray-400 dark:text-gray-500 mt-2 sm:mt-4">
              <kbd className="px-2 py-1 bg-gray-200 dark:bg-gray-700 dark:text-gray-300 rounded-md text-gray-600">Space</kbd>{" "}to speak
            </span>
          </div>
        </div>

        {translationResult && (
          <TranslationResult result={translationResult} inputLang={inputLang} outputLang={outputLang} />
        )}
      </div>

      <NoFundsModal isOpen={showNoFunds} onClose={() => setShowNoFunds(false)} />
    </>
  );
}

function Lang({ code, label, sub, color }: { code: string; label: string; sub: string; color: "green" | "orange" }) {
  return (
    <div className="flex flex-col items-center gap-1 sm:gap-2">
      <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center ${color === "green" ? "bg-green-100 dark:bg-green-900/30" : "bg-orange-100 dark:bg-orange-900/30"}`}>
        <ReactCountryFlag
          countryCode={languageToCountry[code.toUpperCase()] ?? code.toUpperCase()}
          svg
          style={{ width: "1.8em", height: "1.8em" }}
        />
      </div>
      <span className="font-semibold text-sm sm:text-base dark:text-white">{label}</span>
      <span className="text-xs sm:text-sm text-gray-400 dark:text-gray-500">{sub}</span>
    </div>
  );
}
