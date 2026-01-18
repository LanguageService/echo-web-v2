"use client";
import { Moon } from "lucide-react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "@/Components/Sidebar";
import { toast } from "react-toastify";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(true);
  const router = useRouter();
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      toast.error("Please log in to access the dashboard.");
    }
  }, [router]);

  return (
    <div className="flex min-h-screen bg-gray-50 relative">
      {/* Sidebar */}
      <div
        className={`
          fixed z-40 inset-y-0 left-0 w-72 bg-white border-r
          transform transition-transform duration-300 ease-in-out
          ${open ? "translate-x-0" : "-translate-x-72"}
        `}
      >
        {/* <Sidebar /> */}
        <Sidebar onToggle={() => setOpen(!open)} />
      </div>

      {/* Overlay for mobile */}
      {open && (
        <div
          className="fixed inset-0 bg-black/40 z-30 md:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Main content */}
      <div
        className={`
          flex-1 flex flex-col transition-margin duration-300
          ${open ? "ml-72" : "ml-0"}
        `}
      >
        {/* Top bar */}

        <div className="flex items-center justify-between px-4 sm:px-6 lg:px-8 py-4 border-b border-[#b9ced5] bg-white z-50">
          {/* User */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#F2F4F7] flex items-center justify-center">
              👨‍💼
            </div>
            <div>
              <p className="font-semibold text-sm text-[#0C141D]">
                Hi, John 👋
              </p>
              <p className="text-xs text-[#667085]">Welcome back</p>
            </div>
          </div>

          {/* Right */}
          <div className="flex items-center gap-4">
            <Moon className="w-5 h-5 text-[#667085]" />

            <button className="bg-[#F79009] hover:bg-[#E68200] text-white px-5 py-2 rounded-full text-sm font-semibold shadow">
              Try Premium
            </button>
          </div>
        </div>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-2 lg:p-2">
          <div className="min-h-screen african-geometric-pattern bg-background">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
