"use client";

import { ArrowLeftRight, Mic, Square } from "lucide-react";
import { useState, useRef } from "react";
import TranslationResult from "@/Components/TranslationResult";

interface SelectedLanguages {
  input: {
    code: string;
    name: string;
    native_name: string;
  };
  output: {
    code: string;
    name: string;
    native_name: string;
  };
}

interface TranslationResponse {
  success: boolean;
  translation_id: string;
  original_text: string;
  translated_text: string;
  original_language: string;
  target_language: string;
  original_audio_url: string;
  translated_audio_url: string;
  confidence_score: number;
  processing_time: number;
  audio_available: boolean;
}

export default function VoiceCard({
  selectedLanguages,
}: {
  selectedLanguages?: SelectedLanguages;
}) {
  const inputLang = selectedLanguages?.input || {
    code: "en",
    name: "English",
    native_name: "English",
  };
  const outputLang = selectedLanguages?.output || {
    code: "rw",
    name: "Kinyarwanda",
    native_name: "Ikinyarwanda",
  };

  const [isRecording, setIsRecording] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [translationResult, setTranslationResult] =
    useState<TranslationResponse | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, {
          type: "audio/wav",
        });
        await uploadAudio(audioBlob);
        stream.getTracks().forEach((track) => track.stop());
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

      const token = localStorage.getItem("token");
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/voice/translate/`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        },
      );

      const result = await response.json();
      console.log("Translation response:", result);

      if (result.success) {
        setTranslationResult(result);
        // Auto-play translated audio
        const audio = new Audio(result.translated_audio_url);
        audio.play();
      }
    } catch (error) {
      console.error("Error uploading audio:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleMicClick = () => {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-3xl shadow-xl p-6 sm:p-8 lg:p-12 flex-1 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-green-50 via-transparent to-orange-50 pointer-events-none" />

        <div className="relative flex flex-col sm:flex-row items-center sm:justify-between mb-8 sm:mb-16 gap-4 sm:gap-0">
          <Lang
            label={`${inputLang.code.toUpperCase()} ${inputLang.name}`}
            sub="INPUT"
            color="green"
          />
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gray-100 flex items-center justify-center">
            <ArrowLeftRight size={18} className="sm:text-base" />
          </div>
          <Lang
            label={`${outputLang.code.toUpperCase()} ${outputLang.name}`}
            sub="OUTPUT"
            color="orange"
          />
        </div>

        <div className="relative flex flex-col items-center text-center gap-4 sm:gap-6">
          <h2 className="text-xl sm:text-2xl lg:text-3xl font-semibold">
            {isRecording
              ? "Recording..."
              : isLoading
                ? "Processing please wait..."
                : "Ready to translate"}
          </h2>
          <p className="text-gray-500 text-sm sm:text-base">
            {isRecording
              ? "Click to stop recording"
              : "Click the microphone to start recording"}
          </p>

          <button
            onClick={handleMicClick}
            disabled={isLoading}
            className={`w-20 h-20 sm:w-28 sm:h-28 rounded-full text-white flex items-center justify-center shadow-2xl hover:scale-105 transition ${
              isRecording
                ? "bg-red-500 shadow-red-300"
                : isLoading
                  ? "bg-gray-400"
                  : "bg-green-500 shadow-green-300"
            }`}
          >
            {isRecording ? (
              <Square size={32} className="sm:w-10 sm:h-10" />
            ) : (
              <Mic size={32} className="sm:w-10 sm:h-10" />
            )}
          </button>

          <span className="text-xs sm:text-sm text-gray-400 mt-2 sm:mt-4">
            <kbd className="px-2 py-1 bg-gray-200 rounded-md text-gray-600">
              Space
            </kbd>{" "}
            to speak
          </span>
        </div>
      </div>

      {translationResult && (
        <TranslationResult
          result={translationResult}
          inputLang={inputLang}
          outputLang={outputLang}
        />
      )}
    </div>
  );
}

function Lang({
  label,
  sub,
  color,
}: {
  label: string;
  sub: string;
  color: "green" | "orange";
}) {
  return (
    <div className="flex flex-col items-center gap-1 sm:gap-2">
      <div
        className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center text-lg sm:text-xl ${
          color === "green"
            ? "bg-green-100 text-green-600"
            : "bg-orange-100 text-orange-500"
        }`}
      >
        ⚑
      </div>
      <span className="font-semibold text-sm sm:text-base">{label}</span>
      <span className="text-xs sm:text-sm text-gray-400">{sub}</span>
    </div>
  );
}
