"use client";

import { ArrowLeftRight, Mic, Square } from "lucide-react";
import { useState, useRef } from "react";
import TranslationResult from "@/components/TranslationResult";
import ReactCountryFlag from "react-country-flag";
import NoFundsModal from "@/components/NoFundsModal";
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
  const [audioLevel, setAudioLevel] = useState(0);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animationFrameRef = useRef<number | undefined>(undefined);

  function WaveAnimation({ audioLevel }: { audioLevel: number }) {
    const bars = [0.7, 1, 0.8, 1.2, 0.9, 1.1, 0.6, 1.3, 0.8, 1, 0.7];
    return (
      <div className="flex items-end justify-center gap-1 h-16 mt-6">
        {bars.map((baseHeight, index) => (
          <div
            key={index}
            className="bg-gradient-to-t from-red-500 to-red-300 rounded-full transition-all duration-75 animate-pulse"
            style={{
              width: "6px",
              height: `${Math.max(8, (audioLevel / 255) * 64 * baseHeight)}px`,
              animationDelay: `${index * 0.05}s`,
              transform: `scaleY(${1 + (audioLevel / 255) * 2})`,
            }}
          />
        ))}
      </div>
    );
  }

  const startRecording = async () => {
    const sufficient = await hasSufficientBalance();
    if (!sufficient) {
      setShowNoFunds(true);
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      const audioContext = new AudioContext();
      const analyser = audioContext.createAnalyser();
      const microphone = audioContext.createMediaStreamSource(stream);
      analyser.fftSize = 256;
      microphone.connect(analyser);
      analyserRef.current = analyser;

      const updateAudioLevel = () => {
        if (analyserRef.current) {
          const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount);
          analyserRef.current.getByteFrequencyData(dataArray);
          const average = dataArray.reduce((a, b) => a + b) / dataArray.length;
          setAudioLevel(average);
          animationFrameRef.current = requestAnimationFrame(updateAudioLevel);
        }
      };
      updateAudioLevel();

      mediaRecorder.ondataavailable = (event) => { audioChunksRef.current.push(event.data); };
      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: "audio/wav" });
        await uploadAudio(audioBlob);
        stream.getTracks().forEach((track) => track.stop());
        if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
        setAudioLevel(0);
      };

      mediaRecorder.start();
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
      const formData = new FormData();
      formData.append("audio_file", audioBlob, "recording.wav");
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

            <div className="flex flex-col items-center">
              <button
                onClick={handleMicClick}
                disabled={isLoading}
                className={`w-20 h-20 sm:w-28 sm:h-28 rounded-full text-white flex items-center justify-center shadow-2xl transition-all duration-75 ${isRecording ? "bg-red-500 shadow-red-300 animate-pulse"
                  : isLoading ? "bg-gray-400"
                    : "bg-green-500 shadow-green-300 hover:scale-110"
                  }`}
                style={{
                  transform: isRecording ? `scale(${1.1 + (audioLevel / 255) * 0.8}) rotate(${(audioLevel / 255) * 10 - 5}deg)` : "scale(1)",
                  boxShadow: isRecording ? `0 0 ${20 + (audioLevel / 255) * 40}px rgba(239, 68, 68, 0.6)` : undefined,
                }}
              >
                {isRecording ? (
                  <Square size={32} className="sm:w-10 sm:h-10" style={{ transform: `scale(${1 + (audioLevel / 255) * 0.3})` }} />
                ) : (
                  <Mic size={32} className="sm:w-10 sm:h-10" />
                )}
              </button>
              {isRecording && <WaveAnimation audioLevel={audioLevel} />}
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
