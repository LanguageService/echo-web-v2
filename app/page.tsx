import NavBar from "./components/NavBar";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-gray-50 text-gray-900">
      {/* Header */}
      <NavBar />

      {/* Hero */}
      <section className="text-center px-6 py-16 max-w-4xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-bold flex justify-center items-center gap-2">
          <div className="w-12 h-12 bg-gradient-to-br from-primary via-accent to-secondary rounded-full flex items-center justify-center mr-3 shadow-lg">
            <span className="text-xl world-logo">🌍</span>
          </div>
          <span className="text-green-500">✨</span>
          <span className="text-green-600">ECHO</span>
          <span className="text-yellow-400">✨</span>
        </h1>

        <p className="mt-4 text-lg text-gray-600">
          Speak in any language, hear it in another. Real-time voice translation
          powered by AI.
        </p>

        {/* Features */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 mt-12">
          <Feature
            icon="🎤"
            title="Speak Naturally"
            description="Just record your voice in any supported language"
          />
          <Feature
            icon="⚡"
            title="Instant Translation"
            description="Get accurate translations in seconds with AI"
          />
          <Feature
            icon="🌍"
            title="Hear It Back"
            description="Listen to natural-sounding voice in the target language"
          />
        </div>

        {/* CTA */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mt-12">
          <button className="relative bg-green-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-green-700">
            Try Demo (3 free translations)
            <span className="absolute -top-2 -right-2 bg-red-500 text-xs px-2 py-0.5 rounded-full">
              3 Free
            </span>
          </button>

          <button className="bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-blue-700">
            Create Account
          </button>
        </div>

        <p className="mt-4 text-sm text-gray-500">
          Already have an account?{" "}
          <span className="text-blue-600 cursor-pointer hover:underline">
            Sign in here
          </span>
        </p>
      </section>

      {/* Pricing */}
      <section className="px-6 py-16 max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Free Demo */}
          <PricingCard
            badge="GUEST"
            badgeColor="bg-orange-100 text-orange-600"
            title="Free Demo"
            price="Free"
            features={[
              "3 translations per day",
              "All supported languages",
              "Voice-to-voice translation",
            ]}
          />

          {/* Limited Access */}
          <PricingCard
            recommended
            badge="BRONZE"
            badgeColor="bg-blue-100 text-blue-600"
            title="Limited Access"
            price="Free"
            subtitle="Currently free during beta"
            features={[
              "More translations",
              "All supported languages",
              "Voice-to-voice translation",
              "Translation history (coming soon)",
              "Save favorites (coming soon)",
            ]}
            action="Sign Up Now"
          />
        </div>
      </section>

      {/* Languages */}
      <section className="px-6 py-16 text-center max-w-5xl mx-auto">
        <h2 className="text-xl font-semibold mb-6">Supported Languages</h2>

        <div className="flex flex-wrap gap-3 justify-center">
          {[
            "English",
            "Spanish",
            "French",
            "German",
            "Chinese",
            "Japanese",
            "Korean",
            "Arabic",
            "Hindi",
            "Portuguese",
            "Russian",
            "Italian",
            "Kinyarwanda",
            "Swahili",
            "Amharic",
            "Yoruba",
            "Hausa",
            "Igbo",
          ].map((lang) => (
            <span
              key={lang}
              className="px-4 py-2 border rounded-full text-sm bg-white shadow-sm"
            >
              {lang}
            </span>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="text-center py-6 text-sm text-gray-500">
        © 2025 ECHO. Built with ❤️ for bridging cultures through voice.
      </footer>
    </main>
  );
}

/* Components */

function Feature({
  icon,
  title,
  description,
}: {
  icon: string;
  title: string;
  description: string;
}) {
  return (
    <div className="flex flex-col items-center text-center">
      <div className="text-3xl mb-3">{icon}</div>
      <h3 className="font-semibold">{title}</h3>
      <p className="text-sm text-gray-600 mt-1">{description}</p>
    </div>
  );
}

function PricingCard({
  badge,
  badgeColor,
  title,
  price,
  subtitle,
  features,
  action,
  recommended,
}: {
  badge: string;
  badgeColor: string;
  title: string;
  price: string;
  subtitle?: string;
  features: string[];
  action?: string;
  recommended?: boolean;
}) {
  return (
    <div
      className={`relative rounded-2xl p-6 bg-white shadow-sm ${
        recommended ? "border-2 border-blue-600" : "border"
      }`}
    >
      {recommended && (
        <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-blue-600 text-white text-xs px-3 py-1 rounded-full">
          Recommended
        </span>
      )}

      <span
        className={`inline-block text-xs font-semibold px-3 py-1 rounded-full ${badgeColor}`}
      >
        {badge}
      </span>

      <h3 className="mt-4 text-lg font-semibold">{title}</h3>
      <p className="mt-2 text-3xl font-bold">{price}</p>
      {subtitle && <p className="text-sm text-gray-500">{subtitle}</p>}

      <ul className="mt-4 space-y-2 text-sm">
        {features.map((item) => (
          <li key={item} className="flex items-center gap-2">
            <span className="text-green-600">✓</span>
            {item}
          </li>
        ))}
      </ul>

      {action && (
        <button className="mt-6 w-full bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700">
          {action}
        </button>
      )}
    </div>
  );
}
