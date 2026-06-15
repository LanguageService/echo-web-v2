"use client";

import { motion } from "framer-motion";
import Features from "./Features";
import CTAButtons from "./CTAButtons";
import AnimatedWaveform from "./AnimatedWaveform";

import Image from "next/image";

export default function Hero() {
  return (
    <section className="text-center px-6 py-16 max-w-[1536px] mx-auto overflow-hidden">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="flex flex-col justify-center items-center mb-8"
      >
        <div className="flex items-center justify-center p-4 mb-2">
          <img src="/images/logo_v2.png" alt="ECHO Logo" className="w-auto h-12 md:h-16 object-contain dark:invert dark:drop-shadow-[0_0_15px_rgba(255,255,255,0.15)]" />
        </div>
        
        <AnimatedWaveform />

        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-foreground">
          Universal AI Translation
        </h1>
      </motion.div>

      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
        className="mt-6 text-xl md:text-2xl text-muted-foreground font-medium max-w-3xl mx-auto leading-relaxed"
      >
        Speak, read, and listen in any language. Real-time translation for voice, documents, and text powered by AI.
      </motion.p>

      <Features />
      <CTAButtons />
      <p className="mt-8 text-sm text-muted-foreground font-bold">
        Already have an account?{" "}
        <span className="text-primary cursor-pointer hover:underline underline-offset-4">
          Sign in here
        </span>
      </p>
    </section>
  );
}
