"use client";

/* The open/closed badge MUST be client-side. In a static export a server
 * render would freeze the state at build time and claim "Buka" forever.
 * Renders a neutral dash until mounted, so hydration matches the server HTML. */
import { useEffect, useState } from "react";
import type { Branch } from "@/lib/data";
import { openState, type OpenState } from "@/lib/utils";

const badgeClass = (status: OpenState["status"]): string => {
  switch (status) {
    case "open":
      return "bg-signal text-carbon";
    case "closed":
      return "bg-white/5 text-concrete ring-1 ring-white/10";
    default:
      return "bg-white/5 text-concrete/70 ring-1 ring-white/10";
  }
};

const short = (status: OpenState["status"]): string =>
  status === "open" ? "Buka" : status === "closed" ? "Tutup" : "—";

export const OpenBadge = ({
  branch,
  showLabel = false,
}: {
  branch: Branch;
  /** Render the long form ("Buka sekarang · tutup 21:00") beside the pill. */
  showLabel?: boolean;
}) => {
  const [state, setState] = useState<OpenState | null>(null);

  useEffect(() => {
    const tick = () => setState(openState(branch));
    tick();
    // Cheap re-check so a page left open overnight does not lie. ponytail:
    // minute granularity is plenty; drop the interval if it ever matters.
    const id = setInterval(tick, 60_000);
    return () => clearInterval(id);
  }, [branch]);

  const status = state?.status ?? "unknown";

  return (
    <span className="inline-flex items-center gap-2">
      <span
        className={`label shrink-0 rounded-full px-2.5 py-1 ${badgeClass(status)}`}
        // Announce changes politely rather than as an alert.
        aria-live="polite"
      >
        {short(status)}
      </span>
      {showLabel && state ? (
        <span className="text-xs text-concrete">{state.label}</span>
      ) : null}
    </span>
  );
};