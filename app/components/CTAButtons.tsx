import { Users } from "lucide-react";

export default function CTAButtons() {
  return (
    <div className="flex flex-col sm:flex-row gap-4 justify-center mt-12 mb-12">
      <button className="relative african-gradient text-white px-6 py-3 rounded-xl font-bold hover:opacity-90 transition shadow-lg shadow-orange-500/25">
        Try Demo (3 free translations)
        <span className="absolute -top-3 -right-3 bg-destructive text-destructive-foreground text-xs font-bold px-3 py-1 rounded-full shadow-md">
          3 Free
        </span>
      </button>

      <button className="flex items-center justify-center bg-card text-foreground border border-border px-6 py-3 rounded-xl font-bold hover:bg-muted transition shadow-sm">
        <Users className="w-5 h-5 mr-2 text-primary" />
        Create Account
      </button>
    </div>
  );
}
