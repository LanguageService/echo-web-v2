export default function RecentTranslations() {
  return (
    <div className="bg-white rounded-3xl shadow-xl p-6 sm:p-8 lg:p-10 w-full md:w-96 flex flex-col">
      <div className="flex items-center justify-between mb-6 sm:mb-10">
        <h3 className="font-semibold text-base sm:text-lg">
          Recent translations
        </h3>
        <span className="text-sm text-gray-400 cursor-pointer">View All</span>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center text-center text-gray-400 gap-3 sm:gap-4">
        <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gray-100 flex items-center justify-center text-2xl sm:text-3xl">
          文A
        </div>
        <p className="font-medium text-gray-600 text-sm sm:text-base">
          No translation yet
        </p>
        <p className="text-xs sm:text-sm max-w-xs">
          No translations yet. Start one to build your history.
        </p>
      </div>
    </div>
  );
}
