"use client";

import { useEffect, useState } from "react";

/**
 * Tracks which section is currently in the scroll-spy band near the top of the
 * viewport. Uses IntersectionObserver so the active id is set on mount (no
 * need for an initial scroll event).
 */
export function useActiveSection(
  sectionIds: readonly string[],
  defaultId?: string,
) {
  const [activeId, setActiveId] = useState(
    defaultId ?? sectionIds[0] ?? "",
  );

  useEffect(() => {
    const elements = sectionIds
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => Boolean(el));

    if (elements.length === 0) return;

    // A thin horizontal band ~middle of the viewport so only one section is
    // "active" at a time, and the first visible section lights up on load.
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        }
      },
      {
        rootMargin: "-40% 0px -55% 0px",
        threshold: 0,
      },
    );

    for (const el of elements) observer.observe(el);
    return () => observer.disconnect();
  }, [sectionIds]);

  return activeId;
}
