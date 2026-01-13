import { Star } from "lucide-react";

export default function PricingCard({
  badge,
  badgeColor,
  title,
  price,
  description,
  subtitle,
  features,
  action,
  recommended,
}: {
  badge: string;
  badgeColor: string;
  title: string;
  price: string;
  description: string;
  subtitle?: string;
  features: string[];
  action?: string;
  recommended?: boolean;
}) {
  return (
    <div
      className={`relative rounded-2xl p-6 bg-[#EFF4F5] shadow-sm ${
        recommended ? "border-2 border-blue-600" : "border-2 border-gray-200"
      }`}
    >
      {recommended && (
        <span className="flex justify-center align-center absolute -top-3 left-1/2 -translate-x-1/2 bg-blue-600 text-white text-xs px-3 py-1 rounded-full">
          <Star className="w-4 h-4 mr-2" />
          Recommended
        </span>
      )}

      <div className="flex items-center gap-3">
        <span
          className={`inline-block text-xs font-semibold px-3 py-1 rounded-full ${badgeColor}`}
        >
          {badge}
        </span>
        <h3 className="text-lg font-semibold">{title}</h3>
      </div>

      <h3 className="text-sm text-[#4D6680] mt-3">{description}</h3>

      <p className="mt-8 text-3xl font-bold">{price}</p>
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
