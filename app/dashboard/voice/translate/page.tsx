import Header from "@/Components/Header";
import VoiceCard from "@/Components/VoiceCard";
import RecentTranslations from "@/Components/RecentTranslations";

export default function Home() {
  return (
    <>
      {/* <Header /> */}

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 py-8 sm:py-12">
        <div className="flex flex-col md:flex-row gap-6 md:gap-8">
          <VoiceCard />
          <RecentTranslations />
        </div>
      </main>

      {/* Footer */}
      <footer className="text-center text-sm text-gray-400 py-6 sm:py-8">
        © 2023 LinguaFlow. All rights reserved.
      </footer>

      {/* Theme Toggle */}
      <button className="fixed bottom-4 sm:bottom-6 right-4 sm:right-6 w-12 h-12 sm:w-14 sm:h-14 bg-white rounded-full shadow-lg flex items-center justify-center text-xl sm:text-2xl">
        🌙
      </button>
    </>
  );
}
