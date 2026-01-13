import { Users } from "lucide-react";

export default function CTAButtons() {
  return (
    <div className="flex flex-col sm:flex-row gap-4 justify-center mt-12 mb-12">
      <button className="relative bg-green-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-green-700">
        Try Demo (3 free translations)
        <span className="absolute -top-2 -right-2 bg-red-500 text-xs px-2 py-0.5 rounded-full">
          3 Free
        </span>
      </button>

      <button className="flex bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-blue-700">
        <Users className="w-5 h-5 mr-2" />
        Create Account
      </button>
    </div>
  );
}
