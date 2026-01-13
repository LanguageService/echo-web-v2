import { Mic, Zap, Globe } from "lucide-react";
import Feature from "./Features";
import CTAButtons from "./CTAButtons";
import Features from "./Features";

export default function Hero() {
  return (
    <section className="text-center px-6 py-16 max-w-[1536px] mx-auto">
      <h1 className="text-3xl md:text-4xl font-bold flex justify-center items-center gap-2">
        <div className="w-12 h-12 bg-gradient-to-br from-[#249E8E] via-[#F2C94C] to-[#E96A3A] rounded-full flex items-center justify-center mr-3 shadow-lg">
          {/* <div className="w-12 h-12 bg-gradient-to-br from-primary via-accent to-secondary rounded-full flex items-center justify-center mr-3 shadow-lg"> */}
          <span className="text-xl world-logo">🌍</span>
        </div>
        <span className="text-green-500">✨</span>
        <span className="text-green-600">ECHO</span>
        <span className="text-yellow-400">✨</span>
      </h1>

      <p className="mt-4 text-lg text-gray-600">
        Speak in any language, hear it in another. Real-time voice translation
        <br /> powered by AI.
      </p>

      <Features />
      <CTAButtons />
      <p className="mt-4 text-sm text-gray-600 font-bold">
        Already have an account?{" "}
        <span className="text-blue-600 cursor-pointer hover:underline">
          Sign in here
        </span>
      </p>
    </section>
  );
}
