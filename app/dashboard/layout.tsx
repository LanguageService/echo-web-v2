"use client";

import { useState } from "react";
import Sidebar from "@/Components/Sidebar";
import { Menu, X } from "lucide-react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(true); // default open on desktop

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
        <Sidebar />
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
        <div className="flex items-center justify-between px-4 sm:px-6 lg:px-8 py-4 border-b bg-white z-50">
          <h1 className="font-semibold text-lg">Dashboard</h1>
          <button
            onClick={() => setOpen(!open)}
            className="p-2 rounded-md hover:bg-gray-100"
          >
            {open ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <div className="min-h-screen african-geometric-pattern bg-background">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
