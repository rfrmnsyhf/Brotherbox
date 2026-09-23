"use client";

/* Scroll reveal via IntersectionObserver — replaces a motion library for the
   one effect we actually need. Elements stay hidden only after JS confirms it
   can reveal them, so a no-JS client sees full content (see globals.css). */

import { useEffect, useRef, type ReactNode } from "react";

export const Reveal = ({
  children,
  delay = 0,
  className = "",
  as: Tag = "div",
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
  as?: "div" | "li" | "article";
}) => {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (typeof IntersectionObserver === "undefined") {
      el.dataset.revealed = "true";
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          (entry.target as HTMLElement).dataset.revealed = "true";
          io.unobserve(entry.target);
        }
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.08 },
    );

    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <Tag
      ref={ref as never}
      data-reveal=""
      style={delay ? ({ "--reveal-delay": `${delay}ms` } as never) : undefined}
      className={className}
    >
      {children}
    </Tag>
  );
};
