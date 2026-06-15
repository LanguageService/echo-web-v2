"use client";

import { useState, useRef, useEffect } from "react";
import { Volume2, Square } from "lucide-react";
import { resolveMediaUrl } from "@/lib/api";

interface PlayAudioButtonProps {
  audioUrl: string | null;
  className?: string;
}

export default function PlayAudioButton({ audioUrl, className = "" }: PlayAudioButtonProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
    };
  }, []);

  const handlePlayPause = () => {
    if (!audioUrl) return;
    
    if (isPlaying) {
      audioRef.current?.pause();
      setIsPlaying(false);
      return;
    }

    if (!audioRef.current) {
      const url = resolveMediaUrl(audioUrl);
      if (!url) return;
      audioRef.current = new Audio(url);
      audioRef.current.onended = () => setIsPlaying(false);
      audioRef.current.onerror = () => setIsPlaying(false);
    }
    
    audioRef.current.play().then(() => {
      setIsPlaying(true);
    }).catch(err => {
      console.error("Audio playback failed", err);
      setIsPlaying(false);
    });
  };

  if (!audioUrl) return null;

  return (
    <button onClick={handlePlayPause} className={`flex items-center gap-2 ${className}`}>
      {isPlaying ? (
        <>
          <div className="flex items-center gap-[2px] h-4">
            <div className="w-1 bg-orange-500 rounded-full animate-[bounce_1s_infinite_0ms]"></div>
            <div className="w-1 bg-orange-500 rounded-full animate-[bounce_1s_infinite_200ms]" style={{ height: '80%' }}></div>
            <div className="w-1 bg-orange-500 rounded-full animate-[bounce_1s_infinite_400ms]"></div>
          </div>
          <span className="text-orange-500">Playing</span>
        </>
      ) : (
        <>
          <Volume2 size={16} />
          <span>Listen</span>
        </>
      )}
    </button>
  );
}
