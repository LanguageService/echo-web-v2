"use client";

import { useRouter } from "next/navigation";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useState, useEffect } from "react";

const NavBar = () => {
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  return (
    <header className="glass-nav sticky top-0 z-50">
      <div className="w-full px-4 py-3 sm:py-4 md:max-w-none md:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          <button
            onClick={() => router.push("/")}
            className="flex items-center gap-2 transition-opacity hover:opacity-80"
            data-testid="button-home"
            title="ECHO Home"
          >
            <img src="/images/logo_v2.png" alt="ECHO Logo" className="w-auto h-6 md:h-7 object-contain dark:invert" />
          </button>

          <div className="hidden md:flex items-center gap-6 ml-6 mr-auto text-sm font-bold text-muted-foreground">
            <button onClick={() => router.push("/about")} className="hover:text-foreground transition-colors">About Us</button>
            <button onClick={() => router.push("/pricing")} className="hover:text-foreground transition-colors">Pricing</button>
            <button onClick={() => router.push("/developer/docs")} className="hover:text-foreground transition-colors">Developer</button>
          </div>

          <div className="flex items-center ml-auto gap-1 md:gap-2">
            {/* Theme toggle */}
            <button
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="p-2 rounded-lg hover:bg-muted transition-colors text-muted-foreground"
              title="Toggle theme"
            >
              {mounted ? (theme === "dark" ? <Sun size={18} /> : <Moon size={18} />) : <Moon size={18} />}
            </button>

            <button
              onClick={() => router.push("/login")}
              className="inline-flex items-center justify-center gap-2 whitespace-nowrap font-bold transition-colors h-9 rounded-md text-foreground hover:bg-muted text-xs md:text-sm px-2 md:px-3 ml-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-log-in w-3 h-3 md:w-4 md:h-4 mr-1">
                <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"></path>
                <polyline points="10 17 15 12 10 7"></polyline>
                <line x1="15" x2="3" y1="12" y2="12"></line>
              </svg>
              Login
            </button>

            <button
              onClick={() => router.push("/signup")}
              className="inline-flex items-center justify-center gap-2 whitespace-nowrap font-bold transition-all h-9 rounded-md african-gradient hover:opacity-90 text-white text-xs md:text-sm px-4 shadow-sm"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-user-plus w-3 h-3 md:w-4 md:h-4 mr-1">
                <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
                <circle cx="9" cy="7" r="4"></circle>
                <line x1="19" x2="19" y1="8" y2="14"></line>
                <line x1="22" x2="16" y1="11" y2="11"></line>
              </svg>
              Sign Up
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default NavBar;
