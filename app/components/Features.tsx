import { Mic, Zap, Globe } from "lucide-react";
import Feature from "./Feature";

export default function Features() {
  return (
    <div className="w-full grid grid-cols-1 sm:grid-cols-3 gap-8 mt-12">
      <Feature
        icon={
          <div className="p-4 bg-green-100 dark:bg-green-900 rounded-full mb-4">
            <Mic className="w-8 h-8 text-green-600 dark:text-green-400" />
          </div>
        }
        title="Speak Naturally"
        description="Just record your voice in any supported language"
      />
      <Feature
        icon={
          <div className="p-4 bg-blue-100 dark:bg-blue-900 rounded-full mb-4">
            <Zap className="w-8 h-8 text-blue-600 dark:text-blue-400" />
          </div>
        }
        title="Instant Translation"
        description="Get accurate translations in seconds with AI"
      />
      <Feature
        icon={
          <div className="p-4 bg-purple-100 dark:bg-purple-900 rounded-full mb-4">
            <Globe className="w-8 h-8 text-purple-600 dark:text-purple-400" />
          </div>
        }
        title="Hear It Back"
        description="Listen to natural-sounding voice in the target language"
      />
    </div>
  );
}
