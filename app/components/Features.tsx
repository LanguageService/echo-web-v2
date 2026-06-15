"use client";

import { motion } from "framer-motion";
import { Variants } from "framer-motion";
import { Mic, Zap, Globe } from "lucide-react";
import Feature from "./Feature";

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2
    }
  }
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" }
  }
};

export default function Features() {
  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-100px" }}
      className="w-full grid grid-cols-1 sm:grid-cols-3 gap-8 mt-16 mb-8"
    >
      <motion.div variants={itemVariants}>
        <Feature
          icon={
            <div className="p-4 bg-primary/10 rounded-full mb-4">
              <Mic className="w-8 h-8 text-primary" />
            </div>
          }
          title="Speak Naturally"
          description="Just record your voice in any supported language"
        />
      </motion.div>
      <motion.div variants={itemVariants}>
        <Feature
          icon={
            <div className="p-4 bg-blue-500/10 rounded-full mb-4">
              <Zap className="w-8 h-8 text-blue-500" />
            </div>
          }
          title="Instant Translation"
          description="Get accurate translations in seconds with AI"
        />
      </motion.div>
      <motion.div variants={itemVariants}>
        <Feature
          icon={
            <div className="p-4 bg-emerald-500/10 rounded-full mb-4">
              <Globe className="w-8 h-8 text-emerald-500" />
            </div>
          }
          title="Hear It Back"
          description="Listen to natural-sounding voice in the target language"
        />
      </motion.div>
    </motion.div>
  );
}
