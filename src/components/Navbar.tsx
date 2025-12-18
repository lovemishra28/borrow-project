"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useTheme } from "@/components/ThemeProvider";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState<{ name: string } | null>(null);
  const [mounted, setMounted] = useState(false); // Hydration fix
  const router = useRouter();
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();

  // Hydration fix: only run on client
  useEffect(() => {
    setMounted(true);
  }, []);

  // Check login status on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        // We use the profile endpoint to check if we have a valid session
        const res = await fetch("/api/profile");
        if (res.ok) {
          const data = await res.json();
          setUser(data.user);
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error("Auth check failed", error);
        setUser(null);
      }
    };

    checkAuth();
  }, [pathname]); // Re-check when route changes (optional, but good for consistency)

  const handleLogout = async () => {
    try {
      await fetch("/api/user/logout", { method: "POST" });
      setUser(null);
      router.push("/login");
      router.refresh(); // Refresh to clear any server-side protected state
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  return (
    <nav className="bg-background border-b border-border sticky top-0 z-50 transition-colors duration-300">
      <div className=" mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            {/* Logo */}
            <div className="shrink-0 flex items-center">
              <Link href="/" className="text-2xl font-bold text-primary dark:text-white">
                CampusShare
              </Link>
            </div>
            {/* Desktop Links */}
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              <Link
                href="/components"
                className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors ${
                  pathname === "/components"
                    ? "border-accent text-foreground"
                    : "border-transparent text-muted-foreground hover:border-border hover:text-foreground"
                }`}
              >
                Marketplace
              </Link>
              <Link
                href="/projects"
                className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors ${
                  pathname === "/projects"
                    ? "border-accent text-foreground"
                    : "border-transparent text-muted-foreground hover:border-border hover:text-foreground"
                }`}
              >
                Project Showcase
              </Link>
            </div>
          </div>
          
          {/* Right Side Buttons */}
          <div className="hidden sm:ml-6 sm:flex sm:items-center space-x-4">
            {mounted && (
              <button
                onClick={toggleTheme}
                className="p-2 rounded-md text-muted-foreground hover:text-foreground hover:bg-accent/10 transition-colors"
                aria-label="Toggle theme"
              >
                {theme === "dark" ? (
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z" />
                  </svg>
                )}
              </button>
            )}

            {user ? (
              <>
                 <span className="text-sm text-muted-foreground mr-2">Hello, {user.name}</span>
                 <Link
                  href="/profile"
                  className="text-foreground hover:text-accent px-3 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  My Profile
                </Link>
                <Link
                  href="/dashboard"
                  className="text-foreground hover:text-accent px-3 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  My Transactions
                </Link>
                <button
                  onClick={handleLogout}
                  className="text-muted-foreground hover:text-destructive px-3 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  Log out
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="text-muted-foreground hover:text-foreground px-3 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  Log in
                </Link>
                <Link
                  href="/register"
                  className="bg-primary text-primary-foreground px-4 py-2 rounded-md text-sm font-medium hover:bg-primary/90 transition-colors"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="-mr-2 flex items-center sm:hidden">
            {mounted && (
              <button
                onClick={toggleTheme}
                className="p-2 mr-2 rounded-md text-muted-foreground hover:text-foreground hover:bg-accent/10 transition-colors"
              >
                {theme === "dark" ? (
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z" />
                  </svg>
                )}
              </button>
            )}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-muted-foreground hover:text-foreground hover:bg-accent/10 transition-colors"
            >
              <span className="sr-only">Open main menu</span>
              <svg
                className="h-6 w-6"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d={isOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}
                />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="sm:hidden bg-background border-t border-border">
          <div className="pt-2 pb-3 space-y-1">
            <Link
              href="/components"
              className="border-transparent text-muted-foreground hover:bg-accent/10 hover:border-accent hover:text-foreground block pl-3 pr-4 py-2 border-l-4 text-base font-medium transition-colors"
            >
              Marketplace
            </Link>
            <Link
              href="/projects"
              className="border-transparent text-muted-foreground hover:bg-accent/10 hover:border-accent hover:text-foreground block pl-3 pr-4 py-2 border-l-4 text-base font-medium transition-colors"
            >
              Showcase
            </Link>
            
            {user ? (
               <>
                 <Link
                    href="/profile"
                    className="border-transparent text-muted-foreground hover:bg-accent/10 hover:border-accent hover:text-foreground block pl-3 pr-4 py-2 border-l-4 text-base font-medium transition-colors"
                  >
                    My Profile
                  </Link>
                 <Link
                    href="/dashboard"
                    className="border-transparent text-muted-foreground hover:bg-accent/10 hover:border-accent hover:text-foreground block pl-3 pr-4 py-2 border-l-4 text-base font-medium transition-colors"
                  >
                    My Transactions
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left border-transparent text-destructive hover:bg-destructive/10 hover:border-destructive hover:text-destructive block pl-3 pr-4 py-2 border-l-4 text-base font-medium transition-colors"
                  >
                    Log Out
                  </button>
               </>
            ) : (
                <Link
                href="/login"
                className="border-transparent text-muted-foreground hover:bg-accent/10 hover:border-accent hover:text-foreground block pl-3 pr-4 py-2 border-l-4 text-base font-medium transition-colors"
              >
                Log In
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}