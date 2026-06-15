"use client";
import {
  Home,
  Clock,
  Heart,
  User,
  LogOut,
  Settings,
  Shield,
  CreditCard,
  Mic,
  Type,
  FileText,
  Key,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

interface SidebarProps {
  collapsed?: boolean;
  onToggleCollapse?: () => void;
  onItemClick?: () => void;
}

export default function Sidebar({ collapsed = false, onToggleCollapse, onItemClick }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("refreshToken");
    router.push("/login");
  };

  return (
    <aside className="bg-white dark:bg-gray-900 flex flex-col h-full w-full border-r border-[#b9ced5] dark:border-gray-700">
      {/* Logo + collapse toggle */}
      <div className="flex items-center justify-between px-4 py-5 border-b border-[#b9ced5] dark:border-gray-700 shrink-0 min-w-0">
        {/* Logo — always rendered, fades between icon-only and full */}
        <div
          className="cursor-pointer flex items-center min-w-0 overflow-hidden"
          onClick={() => router.push("/dashboard")}
        >
          {/* Icon badge — visible when collapsed */}
          <div
            className={`shrink-0 w-8 h-8 rounded-lg bg-orange-500 flex items-center justify-center text-white font-bold text-sm transition-all duration-300 ${
              collapsed ? "opacity-100 scale-100" : "opacity-0 scale-75 w-0 mr-0"
            }`}
          >
            E
          </div>
          {/* Full logo — visible when expanded */}
          <div
            className={`transition-all duration-300 overflow-hidden ${
              collapsed ? "max-w-0 opacity-0" : "max-w-[160px] opacity-100"
            }`}
          >
            <img src="/images/logo_v2.png" alt="Logo" className="w-auto h-10 object-contain dark:invert" />
          </div>
        </div>

        {/* Collapse toggle — desktop only */}
        <button
          onClick={onToggleCollapse}
          className="hidden md:flex shrink-0 items-center justify-center w-7 h-7 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 dark:text-gray-400 transition-colors ml-1"
          title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
        </button>
      </div>

      {/* Nav items */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden py-3">
        <nav className="space-y-0.5 px-2">
          <NavItem
            icon={<Home size={18} />}
            label="Home"
            href="/dashboard"
            active={pathname === "/dashboard"}
            collapsed={collapsed}
            onClick={onItemClick}
          />

          <SectionLabel label="Services" collapsed={collapsed} />

          <NavItem
            icon={<Mic size={18} />}
            label="Voice"
            href="/dashboard/voice"
            active={pathname.startsWith("/dashboard/voice")}
            collapsed={collapsed}
            onClick={onItemClick}
          />
          <NavItem
            icon={<Type size={18} />}
            label="Text"
            href="/dashboard/text"
            active={pathname.startsWith("/dashboard/text")}
            collapsed={collapsed}
            onClick={onItemClick}
          />
          <NavItem
            icon={<FileText size={18} />}
            label="Document"
            href="/dashboard/document"
            active={pathname.startsWith("/dashboard/document")}
            collapsed={collapsed}
            onClick={onItemClick}
          />

          <SectionLabel label="Library" collapsed={collapsed} />

          <NavItem
            icon={<Clock size={18} />}
            label="History"
            href="/dashboard/history"
            active={pathname === "/dashboard/history"}
            collapsed={collapsed}
            onClick={onItemClick}
          />
          <NavItem
            icon={<Heart size={18} />}
            label="Favourites"
            href="/dashboard/favourites"
            active={pathname === "/dashboard/favourites"}
            collapsed={collapsed}
            onClick={onItemClick}
          />

          <SectionLabel label="Settings" collapsed={collapsed} />

          <NavItem
            icon={<Settings size={18} />}
            label="Settings"
            href="/dashboard/settings"
            active={pathname === "/dashboard/settings"}
            collapsed={collapsed}
            onClick={onItemClick}
          />
          <NavItem
            icon={<Shield size={18} />}
            label="Security"
            href="/dashboard/security"
            active={pathname === "/dashboard/security"}
            collapsed={collapsed}
            onClick={onItemClick}
          />
          <NavItem
            icon={<User size={18} />}
            label="Profile"
            href="/dashboard/profile"
            active={pathname === "/dashboard/profile"}
            collapsed={collapsed}
            onClick={onItemClick}
          />

          <SectionLabel label="Account" collapsed={collapsed} />

          <NavItem
            icon={<CreditCard size={18} />}
            label="Billing & Wallet"
            href="/dashboard/billing"
            active={pathname === "/dashboard/billing"}
            collapsed={collapsed}
            onClick={onItemClick}
          />
          <NavItem
            icon={<Key size={18} />}
            label="API Keys"
            href="/dashboard/api-keys"
            active={pathname === "/dashboard/api-keys"}
            collapsed={collapsed}
            onClick={onItemClick}
          />
        </nav>
      </div>

      {/* Logout */}
      <div className="shrink-0 border-t border-[#b9ced5] dark:border-gray-700 p-2">
        <button
          onClick={handleLogout}
          title="Logout"
          className={`w-full flex items-center rounded-xl transition-colors overflow-hidden ${
            collapsed
              ? "justify-center p-3 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20"
              : "gap-3 px-4 py-3 bg-orange-500 hover:bg-orange-600 text-white justify-center"
          }`}
        >
          <LogOut size={18} className="shrink-0" />
          <span
            className={`font-medium text-sm whitespace-nowrap transition-all duration-300 overflow-hidden ${
              collapsed ? "max-w-0 opacity-0" : "max-w-[120px] opacity-100"
            }`}
          >
            Logout
          </span>
        </button>
      </div>
    </aside>
  );
}

function SectionLabel({ label, collapsed }: { label: string; collapsed: boolean }) {
  return (
    <div className="overflow-hidden">
      {/* Divider always visible */}
      <div className="mt-3 border-t border-gray-100 dark:border-gray-800" />
      {/* Label text fades in/out */}
      <div
        className={`transition-all duration-300 overflow-hidden ${
          collapsed ? "max-h-0 opacity-0" : "max-h-8 opacity-100"
        }`}
      >
        <p className="px-3 pt-3 pb-1 text-xs font-semibold text-gray-400 uppercase tracking-wider whitespace-nowrap">
          {label}
        </p>
      </div>
    </div>
  );
}

function NavItem({
  icon,
  label,
  active = false,
  href,
  collapsed = false,
  onClick,
}: {
  icon: React.ReactNode;
  label: string;
  active?: boolean;
  href?: string;
  collapsed?: boolean;
  onClick?: () => void;
}) {
  const handleClick = () => {
    if (typeof window !== "undefined" && window.innerWidth < 768) {
      onClick?.();
    }
  };

  const content = (
    <div
      className={`flex items-center rounded-xl cursor-pointer transition-colors overflow-hidden ${
        collapsed ? "justify-center p-3" : "gap-3 px-4 py-2.5"
      } ${
        active
          ? "bg-orange-50 dark:bg-orange-500/10 text-orange-500"
          : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
      }`}
      onClick={handleClick}
      title={collapsed ? label : undefined}
    >
      <span className="shrink-0">{icon}</span>
      {/* Label: always in DOM, slides and fades with CSS */}
      <span
        className={`font-medium text-sm whitespace-nowrap transition-all duration-300 overflow-hidden leading-none ${
          collapsed ? "max-w-0 opacity-0 ml-0" : "max-w-[180px] opacity-100"
        }`}
      >
        {label}
      </span>
    </div>
  );

  return href ? <Link href={href}>{content}</Link> : content;
}
