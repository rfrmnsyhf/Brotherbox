/* ==========================================================================
   Shared UI primitives. Deliberately tiny — no component library.
   ========================================================================== */
import type { ReactNode } from "react";

export const Container = ({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) => (
  <div className={`mx-auto w-full max-w-6xl px-5 sm:px-8 ${className}`}>
    {children}
  </div>
);

/** Section shell: consistent vertical rhythm + anchor id. */
export const Section = ({
  id,
  children,
  className = "",
  tone = "dark",
}: {
  id: string;
  children: ReactNode;
  className?: string;
  tone?: "dark" | "bone";
}) => (
  <section
    id={id}
    className={`${
      tone === "bone" ? "on-bone" : ""
    } scroll-mt-24 py-20 sm:py-28 ${className}`}
  >
    <Container>{children}</Container>
  </section>
);

/** Eyebrow label, e.g. "THE MENU". Display copy stays in English. */
export const SectionLabel = ({ children }: { children: ReactNode }) => (
  <p className="label mb-3 text-signal">{children}</p>
);

export const SectionTitle = ({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) => (
  <h2
    className={`font-display text-3xl leading-[1.05] font-extrabold tracking-tight uppercase sm:text-5xl ${className}`}
  >
    {children}
  </h2>
);

/** Small pill used for tags, statuses, and filter chips. */
export const Pill = ({
  children,
  active = false,
  className = "",
}: {
  children: ReactNode;
  active?: boolean;
  className?: string;
}) => (
  <span
    className={`label inline-flex items-center rounded-full px-3 py-1.5 ${
      active
        ? "bg-signal text-carbon"
        : "bg-white/5 text-concrete ring-1 ring-white/10"
    } ${className}`}
  >
    {children}
  </span>
);

/** Honest visual stand-in for imagery we do not have yet. Never a stock
 *  photo passed off as a branch — a labelled frame instead.
 *  `flush` drops the radius and keeps only a bottom rule, for use as the top
 *  of a card. Passed as a prop rather than fighting `border-0` against
 *  `border-b`, whose generated order is not deterministic. */
export const PlaceholderFrame = ({
  label,
  className = "",
  ratio = "aspect-[4/3]",
  flush = false,
}: {
  label: string;
  className?: string;
  ratio?: string;
  flush?: boolean;
}) => (
  <div
    className={`box-grid relative flex ${ratio} w-full items-center justify-center overflow-hidden bg-carbon-soft ${
      flush ? "border-b border-white/10" : "rounded-lg border border-white/10"
    } ${className}`}
  >
    <div className="px-4 text-center">
      <p className="label text-concrete">Foto belum tersedia</p>
      <p className="mt-1 text-xs text-concrete/80">{label}</p>
    </div>
  </div>
);

/** Rating stars without an icon dependency. */
export const Stars = ({ rating }: { rating: number }) => (
  <span
    className="text-signal"
    aria-label={`${rating} dari 5 bintang`}
    role="img"
  >
    {"★".repeat(rating)}
    <span className="text-white/20">{"★".repeat(5 - rating)}</span>
  </span>
);
