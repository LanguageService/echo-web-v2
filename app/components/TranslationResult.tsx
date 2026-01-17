"use client";

import { Play, Pause, Volume2, Clock, TrendingUp } from "lucide-react";
import { useState, useRef } from "react";

interface TranslationResultProps {
  result: {
    original_text: string;
    translated_text: string;
    original_audio_url: string;
    translated_audio_url: string;
    confidence_score: number;
    processing_time: number;
    original_language: string;
    target_language: string;
  };
  inputLang: {
    code: string;
    name: string;
    native_name: string;
  };
  outputLang: {
    code: string;
    name: string;
    native_name: string;
  };
}

export default function TranslationResult({
  result,
  inputLang,
  outputLang,
}: TranslationResultProps) {
  const [playingOriginal, setPlayingOriginal] = useState(false);
  const [playingTranslated, setPlayingTranslated] = useState(false);
  const originalAudioRef = useRef<HTMLAudioElement>(null);
  const translatedAudioRef = useRef<HTMLAudioElement>(null);

  const toggleOriginalAudio = () => {
    if (originalAudioRef.current) {
      if (playingOriginal) {
        originalAudioRef.current.pause();
      } else {
        originalAudioRef.current.play();
      }
      setPlayingOriginal(!playingOriginal);
    }
  };

  const toggleTranslatedAudio = () => {
    if (translatedAudioRef.current) {
      if (playingTranslated) {
        translatedAudioRef.current.pause();
      } else {
        translatedAudioRef.current.play();
      }
      setPlayingTranslated(!playingTranslated);
    }
  };

  return (
    <div className="bg-white rounded-3xl shadow-xl p-6 sm:p-8 space-y-6">
      {/* Header with Stats */}
      <div className="flex flex-wrap gap-4 justify-between items-center pb-4 border-b">
        <h3 className="text-xl font-semibold text-gray-800">
          Translation Result
        </h3>
        <div className="flex gap-4">
          <div className="flex items-center gap-2 bg-green-50 px-4 py-2 rounded-full">
            <TrendingUp className="w-4 h-4 text-green-600" />
            <span className="text-sm font-semibold text-green-700">
              {result.confidence_score}% Confidence
            </span>
          </div>
          <div className="flex items-center gap-2 bg-blue-50 px-4 py-2 rounded-full">
            <Clock className="w-4 h-4 text-blue-600" />
            <span className="text-sm font-semibold text-blue-700">
              {result.processing_time.toFixed(2)}s
            </span>
          </div>
        </div>
      </div>

      {/* Translation Cards */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Original */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                <span className="text-sm font-semibold text-green-600">
                  {inputLang.code.toUpperCase()}
                </span>
              </div>
              <span className="font-semibold text-gray-700">
                {inputLang.name}
              </span>
            </div>
            <button
              onClick={toggleOriginalAudio}
              className="p-2 rounded-full bg-green-100 hover:bg-green-200 transition"
            >
              {playingOriginal ? (
                <Pause className="w-5 h-5 text-green-600" />
              ) : (
                <Play className="w-5 h-5 text-green-600" />
              )}
            </button>
          </div>
          <div className="bg-green-50 rounded-2xl p-4 min-h-[120px]">
            <p className="text-gray-800 leading-relaxed">
              {result.original_text}
            </p>
          </div>
          <audio
            ref={originalAudioRef}
            src={result.original_audio_url}
            onEnded={() => setPlayingOriginal(false)}
          />
        </div>

        {/* Translated */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center">
                <span className="text-sm font-semibold text-orange-600">
                  {outputLang.code.toUpperCase()}
                </span>
              </div>
              <span className="font-semibold text-gray-700">
                {outputLang.name}
              </span>
            </div>
            <button
              onClick={toggleTranslatedAudio}
              className="p-2 rounded-full bg-orange-100 hover:bg-orange-200 transition"
            >
              {playingTranslated ? (
                <Pause className="w-5 h-5 text-orange-600" />
              ) : (
                <Play className="w-5 h-5 text-orange-600" />
              )}
            </button>
          </div>
          <div className="bg-orange-50 rounded-2xl p-4 min-h-[120px]">
            <p className="text-gray-800 leading-relaxed">
              {result.translated_text}
            </p>
          </div>
          <audio
            ref={translatedAudioRef}
            src={result.translated_audio_url}
            onEnded={() => setPlayingTranslated(false)}
          />
        </div>
      </div>

      {/* Audio Indicator */}
      <div className="flex items-center justify-center gap-2 text-sm text-gray-500 pt-2">
        <Volume2 className="w-4 h-4" />
        <span>Click the play buttons to hear the audio</span>
      </div>
    </div>
  );
}
