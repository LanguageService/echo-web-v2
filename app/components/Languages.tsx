import { languages } from "@/lib/languages";

export default function Languages() {
  return (
    <section className="px-6 py-16 text-center max-w-5xl mx-auto">
      <h2 className="text-xl font-semibold mb-6">Supported Languages</h2>
      <div className="flex flex-wrap gap-3 justify-center">
        {languages.map((lang) => (
          <span
            key={lang.name}
            className="px-3 py-1 border border-[#B9CED5] rounded-full text-xs font-semibold bg-white shadow-sm text-[#0C141D]"
          >
            {lang.name}
          </span>
        ))}
      </div>
    </section>
  );
}
