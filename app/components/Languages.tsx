import { languages } from "@/lib/languages";

export default function Languages() {
  return (
    <section className="px-6 py-16 text-center max-w-5xl mx-auto">
      <h2 className="text-xl font-semibold mb-6 dark:text-white">Supported Languages</h2>
      <div className="flex flex-wrap gap-3 justify-center">
        {languages.map((lang) => (
          <span
            key={lang.name}
            className="px-3 py-1 border border-[#B9CED5] dark:border-gray-600 rounded-full text-xs font-semibold bg-white dark:bg-gray-800 shadow-sm text-[#0C141D] dark:text-gray-200"
          >
            {lang.name}
          </span>
        ))}
      </div>
    </section>
  );
}
