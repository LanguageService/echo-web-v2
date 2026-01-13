import { Volume2, Mic, Copy, Share2, Heart } from "lucide-react";

export default function TranslationCard({
  title,
  text,
  footer,
  orange = false,
}: {
  title: string;
  text: string;
  footer?: string;
  orange?: boolean;
}) {
  return (
    <div className="bg-white rounded-xl border p-6 flex flex-col justify-between">
      <div>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xs font-semibold text-gray-400 uppercase">
            {title}
          </h3>
          {orange && <Heart size={18} className="text-gray-400" />}
        </div>

        <p
          className={`text-sm leading-relaxed ${
            orange ? "text-orange-500" : ""
          }`}
        >
          {text}
        </p>
      </div>

      <div className="flex justify-between items-center mt-6 text-gray-400">
        <div className="flex gap-4">
          <Volume2 size={18} />
          {!orange && <Mic size={18} />}
        </div>

        {footer && <span className="text-xs">{footer}</span>}

        {orange && (
          <div className="flex gap-4">
            <Share2 size={18} />
            <Copy size={18} />
          </div>
        )}
      </div>
    </div>
  );
}
