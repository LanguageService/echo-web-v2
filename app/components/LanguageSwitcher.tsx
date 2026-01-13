import { ArrowLeftRight } from "lucide-react";

export default function LanguageSwitcher() {
  return (
    <div className="bg-white p-4 rounded-xl border flex items-center justify-center gap-4">
      <Language label="English (US)" />
      <button className="p-2 rounded-full bg-orange-50 text-orange-500">
        <ArrowLeftRight size={18} />
      </button>
      <Language label="Kinyarwanda (KW)" orange />
    </div>
  );
}

function Language({
  label,
  orange = false,
}: {
  label: string;
  orange?: boolean;
}) {
  return (
    <div
      className={`px-6 py-3 rounded-xl border font-medium ${
        orange ? "text-orange-500" : ""
      }`}
    >
      {label}
    </div>
  );
}
