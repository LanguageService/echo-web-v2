import { Mic, MessageSquare, Image, Clock } from "lucide-react";

export default function Header() {
  return (
    <header className="bg-white border-b">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-2 font-semibold text-lg">
          <div className="w-9 h-9 rounded-full bg-orange-100 flex items-center justify-center text-orange-600">
            文A
          </div>
          Lingua<span className="text-green-500">Flow</span>
        </div>

        {/* Navigation */}
        <nav className="flex items-center gap-8 text-sm font-medium text-gray-500">
          <NavItem icon={<Mic size={16} />} label="Voice" active />
          <NavItem icon={<MessageSquare size={16} />} label="Text" />
          <NavItem icon={<Image size={16} />} label="Image" />
          <NavItem icon={<Clock size={16} />} label="History" />
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-4">
          <button className="bg-orange-500 text-white px-5 py-2 rounded-full shadow-md">
            Try Premium
          </button>

          <div className="relative">
            <div className="w-9 h-9 rounded-full bg-orange-100 flex items-center justify-center">
              📄
            </div>
            <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full border border-white" />
          </div>
        </div>
      </div>
    </header>
  );
}

function NavItem({
  icon,
  label,
  active = false,
}: {
  icon: React.ReactNode;
  label: string;
  active?: boolean;
}) {
  return (
    <div
      className={`flex items-center gap-2 cursor-pointer pb-1 ${
        active
          ? "text-orange-500 border-b-2 border-orange-500"
          : "hover:text-gray-700"
      }`}
    >
      {icon}
      {label}
    </div>
  );
}
