"use client";

import React from "react";
import { useActiveSection } from "@/hooks/useActiveSection";

const NAV_ITEMS = [
  { id: "about", label: "About" },
  { id: "experience", label: "Experience" },
  { id: "projects", label: "Projects" },
  // { id: "blog", label: "Blog" }, // Re-enable with Blog section
] as const;

const SECTION_IDS = NAV_ITEMS.map((item) => item.id);

const NavigationLinks = () => {
  const activeId = useActiveSection(SECTION_IDS, "about");

  return (
    <nav className="nav hidden lg:block" aria-label="In-page jump links">
      <ul className="mt-16 w-max">
        {NAV_ITEMS.map(({ id, label }) => {
          const isActive = activeId === id;
          return (
            <li key={id}>
              <a
                className={`group flex items-center py-3 cursor-pointer${isActive ? " active" : ""}`}
                href={`#${id}`}
                aria-current={isActive ? "location" : undefined}
              >
                <span className="nav-indicator mr-4 h-px w-8 bg-slate-600 dark:bg-slate-400 transition-all group-hover:w-16 group-hover:bg-primary-600 dark:group-hover:bg-primary-300 group-focus-visible:w-16 group-focus-visible:bg-primary-600 dark:group-focus-visible:bg-primary-300 motion-reduce:transition-none"></span>
                <span className="nav-text text-xs font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400 group-hover:text-primary-600 dark:group-hover:text-primary-300 group-focus-visible:text-primary-600 dark:group-focus-visible:text-primary-300">
                  {label}
                </span>
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
};

export default NavigationLinks;
