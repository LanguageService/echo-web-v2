"use client";

import { ArrowLeftRight, Mic, Square } from "lucide-react";
import { useState, useRef } from "react";
import TranslationResult from "@/components/TranslationResult";

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

// interface TranslationResponse {
//   success: boolean;
//   translation_id: string;
//   original_text: string;
//   translated_text: string;
//   original_language: string;
//   target_language: string;
//   original_audio_url: string;
//   translated_audio_url: string;
//   confidence_score: number;
//   processing_time: number;
//   audio_available: boolean;
// }

interface TranslationResponse {
  id: string;
  title: string;
  mode: string;
  speech_service: string;
  audio_format: string;
  duration: number;
  original_audio_url: string;
  translated_audio_url: string;
  original_text: string;
  translated_text: string;
  status: string;
  original_language: string;
  target_language: string;
  confidence_score: number;
  total_processing_time: number;
  date_created: string;
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

  // const startRecording = async () => {
  //   try {
  //     const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
  //     const mediaRecorder = new MediaRecorder(stream);
  //     mediaRecorderRef.current = mediaRecorder;
  //     audioChunksRef.current = [];

  //     mediaRecorder.ondataavailable = (event) => {
  //       audioChunksRef.current.push(event.data);
  //     };

  //     mediaRecorder.onstop = async () => {
  //       const audioBlob = new Blob(audioChunksRef.current, {
  //         type: "audio/wav",
  //       });
  //       await uploadAudio(audioBlob);
  //       stream.getTracks().forEach((track) => track.stop());
  //     };

  //     mediaRecorder.start();
  //     setIsRecording(true);
  //   } catch (error) {
  //     console.error("Error accessing microphone:", error);
  //   }
  // };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      // Set up audio analysis for wave animation
      const audioContext = new AudioContext();
      const analyser = audioContext.createAnalyser();
      const microphone = audioContext.createMediaStreamSource(stream);

      analyser.fftSize = 256;
      microphone.connect(analyser);
      analyserRef.current = analyser;

      // Start audio level monitoring
      const updateAudioLevel = () => {
        if (analyserRef.current) {
          const dataArray = new Uint8Array(
            analyserRef.current.frequencyBinCount,
          );
          analyserRef.current.getByteFrequencyData(dataArray);
          const average = dataArray.reduce((a, b) => a + b) / dataArray.length;
          setAudioLevel(average);
          animationFrameRef.current = requestAnimationFrame(updateAudioLevel);
        }
      };
      updateAudioLevel();

      mediaRecorder.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, {
          type: "audio/wav",
        });
        await uploadAudio(audioBlob);
        stream.getTracks().forEach((track) => track.stop());

        // Clean up audio analysis
        if (animationFrameRef.current) {
          cancelAnimationFrame(animationFrameRef.current);
        }
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

  // const uploadAudio = async (audioBlob: Blob) => {
  //   setIsLoading(true);
  //   try {
  //     const formData = new FormData();
  //     formData.append("audio_file", audioBlob, "recording.wav");
  //     formData.append("source_language", inputLang.code);
  //     formData.append("target_language", outputLang.code);

  //     const token = localStorage.getItem("token");
  //     const response = await fetch(
  //       `${process.env.NEXT_PUBLIC_API_BASE_URL}/voice/translate/`,
  //       {
  //         method: "POST",
  //         headers: {
  //           Authorization: `Bearer ${token}`,
  //         },
  //         body: formData,
  //       },
  //     );

  //     const result = await response.json();
  //     console.log("Translation response:", result);

  //     if (result.success) {
  //       setTranslationResult(result);
  //       // Auto-play translated audio
  //       const audio = new Audio(result.translated_audio_url);
  //       audio.play();
  //     }
  //   } catch (error) {
  //     console.error("Error uploading audio:", error);
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };

  const uploadAudio = async (audioBlob: Blob) => {
    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.append("audio_file", audioBlob, "recording.wav");
      formData.append("source_language", inputLang.code);
      formData.append("target_language", outputLang.code);
      formData.append("speech_service", "STS");

      const token = localStorage.getItem("token");
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/translations/speech/base/`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        },
      );

      if (!response.ok) {
        throw new Error(`Translation failed: ${response.status}`);
      }

      const result: TranslationResponse = await response.json();
      setTranslationResult(result);

      if (result.translated_audio_url) {
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

          {/* <button
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
          </button> */}

          <div className="flex flex-col items-center">
            <button
              onClick={handleMicClick}
              disabled={isLoading}
              className={`w-20 h-20 sm:w-28 sm:h-28 rounded-full text-white flex items-center justify-center shadow-2xl transition-all duration-75 ${
                isRecording
                  ? "bg-red-500 shadow-red-300 animate-pulse"
                  : isLoading
                    ? "bg-gray-400"
                    : "bg-green-500 shadow-green-300 hover:scale-110"
              }`}
              style={{
                transform: isRecording
                  ? `scale(${1.1 + (audioLevel / 255) * 0.8}) rotate(${(audioLevel / 255) * 10 - 5}deg)`
                  : "scale(1)",
                boxShadow: isRecording
                  ? `0 0 ${20 + (audioLevel / 255) * 40}px rgba(239, 68, 68, 0.6)`
                  : undefined,
              }}
            >
              {isRecording ? (
                <Square
                  size={32}
                  className="sm:w-10 sm:h-10"
                  style={{
                    transform: `scale(${1 + (audioLevel / 255) * 0.3})`,
                  }}
                />
              ) : (
                <Mic size={32} className="sm:w-10 sm:h-10" />
              )}
            </button>

            {isRecording && <WaveAnimation audioLevel={audioLevel} />}
          </div>

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
