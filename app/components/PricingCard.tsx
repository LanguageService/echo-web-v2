import { Star } from "lucide-react";
import Link from "next/link";

interface PricingCardProps {
  recommended?: boolean;
  badge: string;
  badgeColor?: string;
  title: string;
  price: string;
  subtitle?: string;
  description: string;
  prefix?: string;
  features: string[];
  action?: string;
  href?: string;
}

export default function PricingCard({
  recommended = false,
  badge,
  badgeColor = "bg-primary text-primary-foreground",
  title,
  price,
  subtitle,
  description,
  prefix,
  features,
  action = "Get Started",
  href = "/dashboard",
}: PricingCardProps) {
  return (
    <div className={`relative rounded-2xl p-6 glass-card text-card-foreground border-2 transition duration-300 hover:shadow-xl hover:-translate-y-1 ${
      recommended ? "border-primary shadow-orange-500/10" : "border-border"
    }`}>
      {recommended && (
        <span className="flex justify-center items-center absolute -top-3 left-1/2 -translate-x-1/2 african-gradient text-white text-xs px-3 py-1 rounded-full">
          <Star className="w-4 h-4 mr-2" /> Recommended
        </span>
      )}

      <div className="flex items-center gap-3">
        <span className={`inline-block text-xs font-semibold px-3 py-1 rounded-full ${badgeColor}`}>
          {badge}
        </span>
        <h3 className="text-lg font-semibold text-foreground">{title}</h3>
      </div>

      <h3 className="text-sm text-muted-foreground mt-3">{description}</h3>
      <div className="mt-8">
        {prefix && <p className="text-sm text-muted-foreground mb-1">{prefix}</p>}
        <p className="text-3xl font-bold text-foreground">{price}</p>
        {subtitle && <p className="text-sm text-muted-foreground">{subtitle}</p>}
      </div>

      <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
        {features.map((item) => (
          <li key={item} className="flex items-center gap-2">
            <span className="text-orange-500">✓</span>
            {item}
          </li>
        ))}
      </ul>

      {action && (
        <div className="mt-6">
          <Link href={href} className={`block w-full text-center py-3 rounded-xl font-bold transition shadow-sm ${
            recommended ? "african-gradient text-white hover:opacity-90 shadow-orange-500/25" : "bg-muted text-foreground hover:bg-background border border-border"
          }`}>
            {action}
          </Link>
        </div>
      )}
    </div>
  );
}
