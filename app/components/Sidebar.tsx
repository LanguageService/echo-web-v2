"use client";

import { Home, Clock, Heart, User, Star, Settings, Menu } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

export default function Sidebar({ onToggle }: { onToggle: () => void }) {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("refreshToken");
    router.push("/login");
  };

  return (
    <aside className=" bg-white flex flex-col h-screen">
      {/* Top content */}
      <div className="flex-1 flex flex-col overflow-auto">
        <div className="flex items-center justify-between px-6 py-6">
          <div className="text-xl font-bold text-orange-500">Echo</div>
        </div>

        <nav className="px-4 space-y-2">
          <NavItem
            icon={<Home size={18} />}
            label="Home"
            href="/dashboard"
            active={pathname === "/dashboard"}
          />
          <NavItem
            icon={<Clock size={18} />}
            label="History"
            active={pathname === "/history"}
          />
          <NavItem
            icon={<Heart size={18} />}
            label="Favourites"
            active={pathname === "/favourites"}
          />
          <NavItem
            icon={<Settings size={18} />}
            label="Settings"
            href="/dashboard/settings"
            active={pathname === "/dashboard/settings"}
          />
          <NavItem
            icon={<User size={18} />}
            label="Profile"
            href="/dashboard/profile"
            active={pathname === "/dashboard/profile"}
          />
        </nav>
      </div>

      {/* Bottom content */}
      <div className="p-4">
        <button
          onClick={handleLogout}
          className="w-full bg-orange-500 hover:bg-orange-600 text-white py-3 rounded-xl flex items-center justify-center gap-2 transition-colors"
        >
          <Star size={18} />
          Logout
        </button>
      </div>
    </aside>
  );
}

function NavItem({
  icon,
  label,
  active = false,
  href,
}: {
  icon: React.ReactNode;
  label: string;
  active?: boolean;
  href?: string;
}) {
  const content = (
    <div
      className={`flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer ${
        active
          ? "bg-orange-50 text-orange-500"
          : "text-gray-600 hover:bg-gray-100"
      }`}
    >
      {icon}
      <span className="font-medium">{label}</span>
    </div>
  );
  return href ? <Link href={href}>{content}</Link> : content;
}
