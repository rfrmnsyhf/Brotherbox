/* ==========================================================================
   BROTHERBOX — runnable self-check
   `npm run selfcheck`   (node strips the types natively, no test framework)

   Guards the three non-trivial pieces of logic: the WIB open/closed window,
   the §12 recommendation ranking, and the WCAG contrast pairs the palette
   depends on. Also lists every placeholder still open before launch.
   ========================================================================== */
import assert from "node:assert/strict";
import {
  BRANCHES,
  CUT_STYLES,
  SITE,
  type Branch,
  openPlaceholders,
} from "./data.ts";
import {
  bookingLinkDetailed,
  bookingMessageDetailed,
  contrast,
  openState,
  recommendStyles,
  toMinutes,
  wibNow,
} from "./utils.ts";

let checks = 0;
const check = (label: string, fn: () => void) => {
  fn();
  checks += 1;
  console.log(`  ok  ${label}`);
};

const branchAt = (over: Partial<Branch>): Branch => ({
  ...BRANCHES[0],
  hours: { open: "10:00", close: "21:00" },
  closedDays: [],
  ...over,
});

/** A fixed instant expressed as WIB wall-clock: build it from a UTC stamp. */
const wibInstant = (day: number, hour: number, minute = 0): Date => {
  // 2026-09-20 is a Sunday, so day 0 = Sunday.
  const utc = Date.UTC(2026, 8, 20 + day, hour - 7, minute);
  return new Date(utc);
};

console.log("\ntoMinutes");
check("parses HH:MM", () => {
  assert.equal(toMinutes("10:30"), 630);
  assert.equal(toMinutes("00:00"), 0);
  assert.equal(toMinutes("23:59"), 1439);
});
check("rejects garbage", () => {
  assert.equal(toMinutes("nope"), null);
  assert.equal(toMinutes("25:00"), null);
  assert.equal(toMinutes("10:75"), null);
});

console.log("\nwibNow");
check("reads Jakarta time, not the visitor's", () => {
  const { day, minutes } = wibNow(wibInstant(1, 14, 5));
  assert.equal(day, 1);
  assert.equal(minutes, 14 * 60 + 5);
});

console.log("\nopenState");
check("open inside the window", () => {
  const s = openState(branchAt({}), wibInstant(1, 12));
  assert.equal(s.status, "open");
});
check("closed before opening", () => {
  assert.equal(openState(branchAt({}), wibInstant(1, 9)).status, "closed");
});
check("closed at the closing minute", () => {
  assert.equal(openState(branchAt({}), wibInstant(1, 21)).status, "closed");
});
check("overnight window is open after midnight", () => {
  const b = branchAt({ hours: { open: "20:00", close: "02:00" } });
  assert.equal(openState(b, wibInstant(1, 23)).status, "open");
  assert.equal(openState(b, wibInstant(2, 1)).status, "open");
  assert.equal(openState(b, wibInstant(2, 3)).status, "closed");
});
check("closed day wins", () => {
  // Closed Sundays; Sunday 12:00 WIB must be closed.
  assert.equal(openState(branchAt({ closedDays: [0] }), wibInstant(0, 12)).status, "closed");
});
check("missing hours are unknown, not a crash", () => {
  assert.equal(openState(branchAt({ hours: null }), wibInstant(1, 12)).status, "unknown");
});

console.log("\nrecommendStyles");
check("returns at most `limit` results", () => {
  const out = recommendStyles(CUT_STYLES, {
    face: "oval", hair: "lurus", lifestyle: "profesional", effort: "low",
  }, 3);
  assert.equal(out.length, 3);
});
check("results are sorted best-first", () => {
  const out = recommendStyles(CUT_STYLES, {
    face: "round", hair: "keriting", lifestyle: "kreatif", effort: "medium",
  });
  for (let i = 1; i < out.length; i += 1) {
    assert.ok(out[i - 1].score <= out[i].score, "not sorted");
  }
});
check("a perfect match scores zero", () => {
  const out = recommendStyles(CUT_STYLES, {
    face: "oval",
    hair: "lurus",
    lifestyle: "profesional",
    effort: "low",
  }, CUT_STYLES.length);
  const perfect = out.filter((r) => r.score === 0).map((r) => r.style.id);
  assert.ok(perfect.includes("textured-crop"), `expected textured-crop, got ${perfect}`);
});
check("ranking is stable for identical input", () => {
  const answers = {
    face: "square", hair: "lurus", lifestyle: "sporty", effort: "medium",
  } as const;
  const a = recommendStyles(CUT_STYLES, answers).map((r) => r.style.id);
  const b = recommendStyles(CUT_STYLES, answers).map((r) => r.style.id);
  assert.deepEqual(a, b);
});
check("every style is reachable as a top pick", () => {
  const seen = new Set<string>();
  const faces = ["oval", "round", "square", "long", "heart"] as const;
  const hairs = ["lurus", "bergelombang", "keriting", "tipis"] as const;
  const vibes = ["profesional", "santai", "sporty", "kreatif"] as const;
  const efforts = ["low", "medium", "high"] as const;
  for (const face of faces) for (const hair of hairs)
    for (const lifestyle of vibes) for (const effort of efforts)
      recommendStyles(CUT_STYLES, { face, hair, lifestyle, effort }, 3)
        .forEach((r) => seen.add(r.style.id));
  const orphans = CUT_STYLES.filter((s) => !seen.has(s.id)).map((s) => s.id);
  assert.deepEqual(orphans, [], `styles never recommended: ${orphans}`);
});

console.log("\nbooking links");
check("wa.me link is percent-encoded and digits-only", () => {
  const link = bookingLinkDetailed({
    branch: BRANCHES[0],
    service: "Skin Fade",
    name: "Budi",
    time: "14:30",
    note: "gaya Textured Crop",
  });
  assert.ok(link.startsWith(`https://wa.me/${BRANCHES[0].whatsapp ?? SITE.waPusat}?text=`));
  assert.ok(!link.includes(" "), "spaces must be encoded");
  assert.ok(link.includes(encodeURIComponent("Skin Fade")));
});
check("branch without its own number falls back to the central one", () => {
  const noNumber = BRANCHES.find((b) => b.whatsapp === null);
  assert.ok(noNumber, "expected at least one branch with a placeholder number");
  assert.ok(bookingLinkDetailed({ branch: noNumber }).includes(SITE.waPusat));
});
check("omitted optional fields degrade to '-'", () => {
  const msg = bookingMessageDetailed({ branch: BRANCHES[0] });
  assert.ok(msg.includes("Nama: -"));
  assert.ok(!msg.includes("Layanan:"));
});

console.log("\ncontrast (WCAG 2.2)");
const AA_NORMAL = 4.5;
check("carbon on bone clears AA normal", () => {
  assert.ok(contrast("#111110", "#f5f2eb") >= AA_NORMAL);
});
check("bone on carbon clears AA normal", () => {
  assert.ok(contrast("#f5f2eb", "#111110") >= AA_NORMAL);
});
check("concrete-deep on bone clears AA normal", () => {
  assert.ok(contrast("#5a5a54", "#f5f2eb") >= AA_NORMAL);
});
check("signal-deep on bone clears AA normal", () => {
  assert.ok(
    contrast("#c4341a", "#f5f2eb") >= AA_NORMAL,
    "signal-deep must stay AA-legible on bone — that is why it exists",
  );
});
check("raw signal on bone is only allowed as a surface, not text", () => {
  // Documents *why* signal-deep exists. If this ever passes AA, the deep
  // variant can be deleted.
  assert.ok(contrast("#ff4d24", "#f5f2eb") < AA_NORMAL);
});
check("carbon on signal clears AA normal", () => {
  assert.ok(contrast("#111110", "#ff4d24") >= AA_NORMAL);
});
check("concrete on carbon clears AA normal", () => {
  // #74746d was only 4.01:1 here; the token was lightened to #80807a.
  assert.ok(contrast("#80807a", "#111110") >= AA_NORMAL);
});

console.log(`\n${checks} checks passed.`);

const open = openPlaceholders();
if (open.length) {
  console.log(`\n${open.length} placeholder(s) still open:`);
  open.forEach((p) => console.log(`  - ${p}`));
} else {
  console.log("\nNo placeholders left. Ready to ship.");
}
console.log(`\nCanonical URL in use: ${SITE.url}`);
