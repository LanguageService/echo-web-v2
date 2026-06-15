"use client";
import { Moon, Sun, Menu, X } from "lucide-react";
import { useState, useEffect } from "react";
import Link from "next/link";
import Sidebar from "@/components/Sidebar";
import { fetchUserProfile, type UserProfile } from "@/lib/api";
import { useTheme } from "next-themes";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [user, setUser] = useState<UserProfile | null>(null);

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    fetchUserProfile().then(setUser).catch(() => { });
  }, []);

  const sidebarWidth = collapsed ? "w-16" : "w-72";
  const mainMargin = collapsed ? "md:ml-16" : "md:ml-72";

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-950 relative">
      {/* Sidebar */}
      <div
        className={`fixed z-40 inset-y-0 left-0 ${sidebarWidth} bg-white dark:bg-gray-900 border-r border-[#b9ced5] dark:border-gray-700 transform transition-all duration-300 ease-in-out overflow-hidden ${mobileOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}`}
      >
        <Sidebar
          collapsed={collapsed}
          onToggleCollapse={() => setCollapsed(!collapsed)}
          onItemClick={() => setMobileOpen(false)}
        />
      </div>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-30 md:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Main content */}
      <div className={`flex-1 flex flex-col transition-all duration-300 ml-0 ${mainMargin}`}>
        {/* Top bar */}
        <div className="sticky top-0 z-50 bg-white dark:bg-gray-900 border-b border-[#b9ced5] dark:border-gray-700">
          <div className="flex items-center px-4 sm:px-6 lg:px-8 py-3 gap-3">

            {/* Mobile hamburger */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="p-2 bg-orange-50 dark:bg-gray-800 hover:bg-orange-100 dark:hover:bg-gray-700 rounded-lg transition-all duration-200 shrink-0 md:hidden"
            >
              <div className="relative w-5 h-5">
                <Menu
                  size={20}
                  className={`absolute text-orange-500 dark:text-orange-400 transition-all duration-200 ${mobileOpen ? "opacity-0 rotate-90 scale-75" : "opacity-100 rotate-0 scale-100"}`}
                />
                <X
                  size={20}
                  className={`absolute text-orange-500 dark:text-orange-400 transition-all duration-200 ${mobileOpen ? "opacity-100 rotate-0 scale-100" : "opacity-0 -rotate-90 scale-75"}`}
                />
              </div>
            </button>

            <div className="hidden sm:flex flex-col flex-1">
              <p className="font-semibold text-sm text-[#0C141D] dark:text-white leading-tight">
                Hi, {user ? user.first_name : "..."} 👋
              </p>
              <p className="text-xs text-[#667085] dark:text-gray-400">Welcome back</p>
            </div>

            {/* Public page links — desktop only */}
            <div className="hidden lg:flex items-center gap-5 text-xs font-semibold text-[#667085] dark:text-gray-400">
              <Link href="/about" className="hover:text-orange-500 transition-colors">About Us</Link>
              <Link href="/pricing" className="hover:text-orange-500 transition-colors">Pricing</Link>
              <Link href="/developer/docs" className="hover:text-orange-500 transition-colors">Developer</Link>
            </div>

            {/* Right: theme toggle + avatar */}
            <div className="flex items-center gap-2 ml-auto lg:ml-4">
              <button
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-[#667085] dark:text-gray-400"
                title="Toggle theme"
              >
                {mounted ? (theme === "dark" ? <Sun size={18} /> : <Moon size={18} />) : <Moon size={18} />}
              </button>

              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-orange-100 to-orange-200 dark:from-orange-900/40 dark:to-orange-800/40 flex items-center justify-center text-sm font-bold text-orange-500 shrink-0 ring-2 ring-white dark:ring-gray-900 shadow-sm">
                {user ? (user.first_name?.[0] || "?").toUpperCase() : "?"}
              </div>
            </div>

          </div>
        </div>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-2 lg:p-2">
          <div className="min-h-screen african-geometric-pattern bg-background dark:bg-transparent">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
