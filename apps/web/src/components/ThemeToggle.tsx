"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { FiSun, FiMoon } from "react-icons/fi";

export function ThemeToggle() {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme, resolvedTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  const handleToggle = () => {
    // If current theme is system, switch to the opposite of resolved theme
    if (theme === "system") {
      setTheme(resolvedTheme === "dark" ? "light" : "dark");
    } else {
      // If explicit theme is set, toggle between light and dark
      setTheme(theme === "dark" ? "light" : "dark");
    }
  };

  // Use resolvedTheme for icon display to show the actual current theme
  const isDark = resolvedTheme === "dark";

  return (
    <button
      onClick={handleToggle}
      className="fixed top-6 outline-none right-6 z-50 p-3 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-200 hover:bg-primary-100 dark:hover:bg-primary-900 transition-colors duration-200 shadow-lg"
      aria-label="Toggle theme"
    >
      {isDark ? (
        <FiSun className="w-5 h-5" />
      ) : (
        <FiMoon className="w-5 h-5" />
      )}
    </button>
  );
} 