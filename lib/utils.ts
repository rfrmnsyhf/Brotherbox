/* ==========================================================================
   BROTHERBOX — pure helpers
   No React, no DOM. Every function here is covered by lib/selfcheck.ts.
   ========================================================================== */
import {
  type Branch,
  type CutStyle,
  type Effort,
  type FaceShape,
  type HairType,
  type Lifestyle,
  waForBranch,
} from "./data.ts";

/* ------------------------------------------------------------- WhatsApp -- */

/**
 * Build a wa.me deep link with a pre-filled Indonesian message.
 * `phone` must be international format, digits only.
 */
export const waLink = (phone: string, message: string): string =>
  `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;

/** Booking message for a specific branch + optional service. */
export const bookingMessage = (
  branch: Branch,
  serviceName?: string,
): string => {
  const lines = [
    `Halo ${branch.name}, saya mau booking.`,
    "",
    `Cabang: ${branch.area} (${branch.city})`,
  ];
  if (serviceName) lines.push(`Layanan: ${serviceName}`);
  lines.push("", "Nama saya: ", "Jam yang saya mau: ");
  return lines.join("\n");
};

export const bookingLink = (branch: Branch, serviceName?: string): string =>
  waLink(waForBranch(branch), bookingMessage(branch, serviceName));

/** A booking as assembled in the modal. Every field except the branch is
 *  optional, so a one-tap CTA can still deep-link straight into WhatsApp. */
export type BookingRequest = {
  branch: Branch;
  service?: string;
  name?: string;
  /** Free text, e.g. the §12 quiz result the visitor landed on. */
  note?: string;
  /** "HH:MM" from a native time input, in WIB. */
  time?: string;
};

export const bookingMessageDetailed = (r: BookingRequest): string => {
  const lines = [
    `Halo ${r.branch.name}, saya mau booking.`,
    "",
    `Cabang: ${r.branch.area} (${r.branch.city})`,
  ];
  if (r.service) lines.push(`Layanan: ${r.service}`);
  if (r.note) lines.push(`Catatan: ${r.note}`);
  lines.push(
    "",
    `Nama: ${r.name?.trim() || "-"}`,
    `Jam yang saya mau: ${r.time || "-"} WIB`,
  );
  return lines.join("\n");
};

export const bookingLinkDetailed = (r: BookingRequest): string =>
  waLink(waForBranch(r.branch), bookingMessageDetailed(r));

/* ------------------------------------------------- open / closed (WIB) --- */

/** Minutes since midnight for "HH:MM". Returns null when unparseable. */
export const toMinutes = (hhmm: string): number | null => {
  const m = /^(\d{1,2}):(\d{2})$/.exec(hhmm.trim());
  if (!m) return null;
  const h = Number(m[1]);
  const min = Number(m[2]);
  if (h > 23 || min > 59) return null;
  return h * 60 + min;
};

/**
 * Current wall-clock time in Asia/Jakarta (UTC+7), independent of the
 * visitor's own timezone. Returns weekday (0 = Sunday) and minutes.
 */
export const wibNow = (at: Date = new Date()): {
  day: number;
  minutes: number;
} => {
  const shifted = new Date(at.getTime() + 7 * 60 * 60 * 1000);
  return {
    day: shifted.getUTCDay(),
    minutes: shifted.getUTCHours() * 60 + shifted.getUTCMinutes(),
  };
};

export type OpenState =
  | { status: "open"; label: string }
  | { status: "closed"; label: string }
  | { status: "unknown"; label: string };

/**
 * Open/closed badge for a branch, evaluated in WIB.
 * Overnight windows (close < open) are treated as crossing midnight.
 */
export const openState = (branch: Branch, at: Date = new Date()): OpenState => {
  const { hours } = branch;
  if (!hours) return { status: "unknown", label: "Jam buka belum tersedia" };

  const open = toMinutes(hours.open);
  const close = toMinutes(hours.close);
  if (open === null || close === null) {
    return { status: "unknown", label: "Jam buka belum tersedia" };
  }

  const { day, minutes } = wibNow(at);
  const closesNextDay = close <= open;
  const openToday = !branch.closedDays.includes(day);
  const openYesterday = !branch.closedDays.includes((day + 6) % 7);

  const isOpen = closesNextDay
    ? (openToday && minutes >= open) || (openYesterday && minutes < close)
    : openToday && minutes >= open && minutes < close;

  if (isOpen) {
    return { status: "open", label: `Buka sekarang · tutup ${hours.close}` };
  }
  return { status: "closed", label: `Tutup · buka ${hours.open} WIB` };
};

/* ---------------------------------------------------------- §12 matcher -- */

export type QuizAnswers = {
  face: FaceShape;
  hair: HairType;
  lifestyle: Lifestyle;
  effort: Effort;
};

/** Lower is better. Face shape matters most, then hair, then vibe, then upkeep. */
export const scoreStyle = (style: CutStyle, a: QuizAnswers): number =>
  (style.face.includes(a.face) ? 0 : 6) +
  (style.hair.includes(a.hair) ? 0 : 4) +
  (style.vibe.includes(a.lifestyle) ? 0 : 2) +
  (style.effort === a.effort ? 0 : 1);

/**
 * Rank styles for the quiz. Ties break on catalogue order so the result is
 * stable across renders.
 */
export const recommendStyles = (
  styles: CutStyle[],
  answers: QuizAnswers,
  limit = 3,
): { style: CutStyle; score: number }[] =>
  styles
    .map((style, index) => ({ style, score: scoreStyle(style, answers), index }))
    .sort((x, y) => x.score - y.score || x.index - y.index)
    .slice(0, limit)
    .map(({ style, score }) => ({ style, score }));

/* ------------------------------------------------------------- contrast -- */

/** WCAG relative luminance. */
export const luminance = (hex: string): number => {
  const clean = hex.replace("#", "");
  const channel = (i: number) => {
    const c = parseInt(clean.slice(i * 2, i * 2 + 2), 16) / 255;
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  };
  return 0.2126 * channel(0) + 0.7152 * channel(1) + 0.0722 * channel(2);
};

/** WCAG contrast ratio between two hex colours. */
export const contrast = (a: string, b: string): number => {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
};

/** Needs an anchor if the same page scrolls to it — used by nav. */
export const slugify = (s: string): string =>
  s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
