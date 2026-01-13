import PricingCard from "./PricingCard";

export default function Pricing() {
  return (
    <section className="px-6 py-16 max-w-6xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <PricingCard
          badge="Guest"
          description="Try our service with no commitment"
          badgeColor="bg-orange-600 text-white"
          title="Free Demo"
          price="Free"
          features={[
            "3 translations per day",
            "All supported languages",
            "Voice-to-voice translation",
          ]}
        />

        <PricingCard
          recommended
          badge="Bronze"
          description="Full access to all features"
          badgeColor="bg-blue-600 text-white"
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
  );
}
