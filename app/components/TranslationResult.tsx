// "use client";

// import { Play, Pause, Volume2, Clock, TrendingUp } from "lucide-react";
// import { useState, useRef } from "react";

// interface TranslationResultProps {
//   result: {
//     original_text: string;
//     translated_text: string;
//     original_audio_url: string;
//     translated_audio_url: string;
//     confidence_score: number;
//     total_processing_time: number;
//     original_language: string;
//     target_language: string;
//   };
//   inputLang: { code: string; name: string; native_name: string };
//   outputLang: { code: string; name: string; native_name: string };
// }

// export default function TranslationResult({ result, inputLang, outputLang }: TranslationResultProps) {
//   const [playingOriginal, setPlayingOriginal] = useState(false);
//   const [playingTranslated, setPlayingTranslated] = useState(false);
//   const originalAudioRef = useRef<HTMLAudioElement>(null);
//   const translatedAudioRef = useRef<HTMLAudioElement>(null);

//   const toggleOriginalAudio = () => {
//     if (originalAudioRef.current) {
//       if (playingOriginal) { originalAudioRef.current.pause(); }
//       else { originalAudioRef.current.play(); }
//       setPlayingOriginal(!playingOriginal);
//     }
//   };

//   const toggleTranslatedAudio = () => {
//     if (translatedAudioRef.current) {
//       if (playingTranslated) { translatedAudioRef.current.pause(); }
//       else { translatedAudioRef.current.play(); }
//       setPlayingTranslated(!playingTranslated);
//     }
//   };

//   return (
//     <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-xl p-6 sm:p-8 space-y-6">
//       {/* Header with Stats */}
//       <div className="flex flex-wrap gap-4 justify-between items-center pb-4 border-b dark:border-gray-700">
//         <h3 className="text-xl font-semibold text-gray-800 dark:text-white">
//           Translation Result
//         </h3>
//         <div className="flex gap-4">
//           {/* <div className="flex items-center gap-2 bg-green-50 dark:bg-green-900/30 px-4 py-2 rounded-full">
//             <TrendingUp className="w-4 h-4 text-green-600 dark:text-green-400" />
//             <span className="text-sm font-semibold text-green-700 dark:text-green-400">
//               {result.confidence_score ?? 0}% Confidence
//             </span>
//           </div> */}
//           <div className="flex items-center gap-2 bg-blue-50 dark:bg-blue-900/30 px-4 py-2 rounded-full">
//             <Clock className="w-4 h-4 text-blue-600 dark:text-blue-400" />
//             <span className="text-sm font-semibold text-blue-700 dark:text-blue-400">
//               {(result.total_processing_time ?? 0).toFixed(2)}s
//             </span>
//           </div>
//         </div>
//       </div>

//       {/* Translation Cards */}
//       <div className="grid md:grid-cols-2 gap-6">
//         {/* Original */}
//         <div className="space-y-3">
//           <div className="flex items-center justify-between">
//             <div className="flex items-center gap-2">
//               <div className="w-8 h-8 rounded-full bg-green-100 dark:bg-green-900/40 flex items-center justify-center">
//                 <span className="text-sm font-semibold text-green-600 dark:text-green-400">
//                   {inputLang.code.toUpperCase()}
//                 </span>
//               </div>
//               <span className="font-semibold text-gray-700 dark:text-gray-300">{inputLang.name}</span>
//             </div>
//             <button onClick={toggleOriginalAudio} className="p-2 rounded-full bg-green-100 dark:bg-green-900/40 hover:bg-green-200 dark:hover:bg-green-900/60 transition">
//               {playingOriginal
//                 ? <Pause className="w-5 h-5 text-green-600 dark:text-green-400" />
//                 : <Play className="w-5 h-5 text-green-600 dark:text-green-400" />}
//             </button>
//           </div>
//           <div className="bg-green-50 dark:bg-green-900/20 rounded-2xl p-4 min-h-[120px]">
//             <p className="text-gray-800 dark:text-gray-200 leading-relaxed">{result.original_text}</p>
//           </div>
//           <audio ref={originalAudioRef} src={resolveMediaUrl(result.original_audio_url)} onEnded={() => setPlayingOriginal(false)} />
//         </div>

//         {/* Translated */}
//         <div className="space-y-3">
//           <div className="flex items-center justify-between">
//             <div className="flex items-center gap-2">
//               <div className="w-8 h-8 rounded-full bg-orange-100 dark:bg-orange-900/40 flex items-center justify-center">
//                 <span className="text-sm font-semibold text-orange-600 dark:text-orange-400">
//                   {outputLang.code.toUpperCase()}
//                 </span>
//               </div>
//               <span className="font-semibold text-gray-700 dark:text-gray-300">{outputLang.name}</span>
//             </div>
//             <button onClick={toggleTranslatedAudio} className="p-2 rounded-full bg-orange-100 dark:bg-orange-900/40 hover:bg-orange-200 dark:hover:bg-orange-900/60 transition">
//               {playingTranslated
//                 ? <Pause className="w-5 h-5 text-orange-600 dark:text-orange-400" />
//                 : <Play className="w-5 h-5 text-orange-600 dark:text-orange-400" />}
//             </button>
//           </div>
//           <div className="bg-orange-50 dark:bg-orange-900/20 rounded-2xl p-4 min-h-[120px]">
//             <p className="text-gray-800 dark:text-gray-200 leading-relaxed">{result.translated_text}</p>
//           </div>
//           <audio ref={translatedAudioRef} src={resolveMediaUrl(result.translated_audio_url)} onEnded={() => setPlayingTranslated(false)} />
//         </div>
//       </div>

//       <div className="flex items-center justify-center gap-2 text-sm text-gray-500 dark:text-gray-400 pt-2">
//         <Volume2 className="w-4 h-4" />
//         <span>Click the play buttons to hear the audio</span>
//       </div>
//     </div>
//   );
// }



"use client";

import { Play, Pause, Volume2, Clock, Copy, ArrowRight } from "lucide-react";
import { useState, useRef } from "react";
import { resolveMediaUrl } from "@/lib/api";

const btnClass = "border dark:border-gray-600 rounded-full px-3 py-1 flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 hover:text-orange-500 dark:hover:text-orange-400 transition-colors";

interface TranslationResultProps {
  result: {
    original_text: string;
    translated_text: string;
    original_audio_url: string;
    translated_audio_url: string;
    confidence_score: number;
    total_processing_time: number;
    original_language: string;
    target_language: string;
  };
  inputLang: { code: string; name: string; native_name: string };
  outputLang: { code: string; name: string; native_name: string };
}

export default function TranslationResult({ result, inputLang, outputLang }: TranslationResultProps) {
  const [playingOriginal, setPlayingOriginal] = useState(false);
  const [playingTranslated, setPlayingTranslated] = useState(false);
  const [copied, setCopied] = useState<"original" | "translated" | null>(null);
  const originalAudioRef = useRef<HTMLAudioElement>(null);
  const translatedAudioRef = useRef<HTMLAudioElement>(null);

  const toggleOriginalAudio = () => {
    if (originalAudioRef.current) {
      if (playingOriginal) { originalAudioRef.current.pause(); }
      else { originalAudioRef.current.play(); }
      setPlayingOriginal(!playingOriginal);
    }
  };

  const toggleTranslatedAudio = () => {
    if (translatedAudioRef.current) {
      if (playingTranslated) { translatedAudioRef.current.pause(); }
      else { translatedAudioRef.current.play(); }
      setPlayingTranslated(!playingTranslated);
    }
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
        {/* <div className="flex items-center gap-2 text-xs text-gray-400 dark:text-gray-500">
          <Clock className="w-3 h-3" />
          {(result.total_processing_time ?? 0).toFixed(2)}s processing time
        </div> */}
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
                <button onClick={toggleOriginalAudio} className={btnClass}>
                  {playingOriginal
                    ? <Pause size={16} />
                    : <Play size={16} />}
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
                <button onClick={toggleTranslatedAudio} className={btnClass}>
                  {playingTranslated
                    ? <Pause size={16} />
                    : <Play size={16} />}
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
    </div>
  );
}
