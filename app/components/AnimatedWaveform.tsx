"use client";

import { motion } from "framer-motion";

export default function AnimatedWaveform() {
  return (
    <div className="flex items-center justify-center gap-1 h-12 my-6">
      {[...Array(5)].map((_, i) => (
        <motion.div
          key={i}
          animate={{
            height: ["20%", "100%", "20%"],
          }}
          transition={{
            duration: 1.2,
            repeat: Infinity,
            ease: "easeInOut",
            delay: i * 0.15,
          }}
          className="w-2 rounded-full african-gradient"
          style={{ height: "20%" }}
        />
      ))}
    </div>
  );
}
