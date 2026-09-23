"use client";

/* ==========================================================================
   Booking dialog.
   Rendered into the page once. Triggers stay plain server-rendered <a> tags
   carrying data attributes, so they deep-link to WhatsApp with no JS at all.
   With JS, a single delegated listener upgrades the click into this dialog.
   Native <dialog> gives focus trapping, Esc-to-close and background inerting
   for free — no Radix, no shadcn.
   ========================================================================== */
import { useEffect, useRef, useState } from "react";
import { ArrowUpRight, X } from "lucide-react";
import { BRANCHES, SERVICES, type Branch } from "@/lib/data";
import { bookingLinkDetailed, openState } from "@/lib/utils";

type Prefill = {
  branchSlug?: string;
  service?: string;
  note?: string;
};

const resolveBranch = (slug?: string): Branch =>
  BRANCHES.find((b) => b.slug === slug) ?? BRANCHES[0];

export const BookingDialog = () => {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [open, setOpen] = useState(false);
  const [prefill, setPrefill] = useState<Prefill>({});
  const [branchSlug, setBranchSlug] = useState(BRANCHES[0].slug);
  const [service, setService] = useState("");
  const [name, setName] = useState("");
  const [time, setTime] = useState("");

  /* Delegated trigger: any element with [data-booking] opens the dialog. */
  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      const trigger = (event.target as HTMLElement | null)?.closest?.(
        "[data-booking]",
      ) as HTMLElement | null;
      if (!trigger) return;
      event.preventDefault();
      setPrefill({
        branchSlug: trigger.dataset.branchSlug,
        service: trigger.dataset.service,
        note: trigger.dataset.note,
      });
      setBranchSlug(trigger.dataset.branchSlug ?? BRANCHES[0].slug);
      setService(trigger.dataset.service ?? "");
      setName("");
      setTime("");
      setOpen(true);
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);

  useEffect(() => {
    const el = dialogRef.current;
    if (!el) return;
    if (open && !el.open) el.showModal();
    if (!open && el.open) el.close();
  }, [open]);

  const branch = resolveBranch(branchSlug);
  const state = openState(branch);
  const href = bookingLinkDetailed({
    branch,
    service: service || undefined,
    name,
    time,
    note: prefill.note,
  });

  return (
    <dialog
      ref={dialogRef}
      onClose={() => setOpen(false)}
      onClick={(e) => {
        // Click on the backdrop (the dialog element itself) closes.
        if (e.target === dialogRef.current) setOpen(false);
      }}
      aria-labelledby="booking-title"
      className="m-auto w-[min(92vw,32rem)] rounded-xl border border-white/10 bg-carbon-soft p-0 text-bone backdrop:bg-carbon/80 backdrop:backdrop-blur-sm"
    >
      <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
        <div>
          <p className="label text-signal">Booking</p>
          <h2
            id="booking-title"
            className="font-display text-lg font-extrabold uppercase"
          >
            Atur jadwal kamu
          </h2>
        </div>
        <button
          type="button"
          onClick={() => setOpen(false)}
          aria-label="Tutup"
          className="rounded-full p-2 text-concrete transition-colors hover:bg-white/5 hover:text-bone"
        >
          <X className="size-5" aria-hidden />
        </button>
      </div>

      <div className="space-y-4 px-5 py-5">
        <div>
          <label htmlFor="bk-branch" className="label mb-1.5 block text-concrete">
            Cabang
          </label>
          <select
            id="bk-branch"
            value={branchSlug}
            onChange={(e) => setBranchSlug(e.target.value)}
            className="w-full rounded-md border border-white/15 bg-carbon px-3 py-2.5 text-sm text-bone"
          >
            {BRANCHES.map((b) => (
              <option key={b.slug} value={b.slug}>
                {b.name} — {b.city}
              </option>
            ))}
          </select>
          <p className="mt-1.5 text-xs text-concrete">{state.label}</p>
        </div>

        <div>
          <label htmlFor="bk-service" className="label mb-1.5 block text-concrete">
            Layanan
          </label>
          <select
            id="bk-service"
            value={service}
            onChange={(e) => setService(e.target.value)}
            className="w-full rounded-md border border-white/15 bg-carbon px-3 py-2.5 text-sm text-bone"
          >
            <option value="">Belum tahu / mau tanya dulu</option>
            {SERVICES.map((s) => (
              <option key={s.id} value={s.name}>
                {s.name}
              </option>
            ))}
          </select>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="bk-name" className="label mb-1.5 block text-concrete">
              Nama
            </label>
            <input
              id="bk-name"
              name="name"
              autoComplete="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Nama kamu"
              className="w-full rounded-md border border-white/15 bg-carbon px-3 py-2.5 text-sm text-bone placeholder:text-concrete/70"
            />
          </div>
          <div>
            <label htmlFor="bk-time" className="label mb-1.5 block text-concrete">
              Jam (WIB)
            </label>
            <input
              id="bk-time"
              name="time"
              type="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className="w-full rounded-md border border-white/15 bg-carbon px-3 py-2.5 text-sm text-bone"
            />
          </div>
        </div>

        {prefill.note ? (
          <p className="rounded-md border border-signal/30 bg-signal/5 px-3 py-2 text-xs text-bone">
            Catatan ikut terkirim: <strong>{prefill.note}</strong>
          </p>
        ) : null}

        <p className="text-xs leading-relaxed text-concrete">
          Pesanan diteruskan ke WhatsApp{" "}
          {branch.whatsapp ? `cabang ${branch.area}` : "pusat"}. Aplikasi
          WhatsApp akan terbuka dengan pesan yang sudah terisi — kamu masih bisa
          ubah sebelum kirim.
        </p>
      </div>

      <div className="flex flex-col gap-2 border-t border-white/10 px-5 py-4 sm:flex-row-reverse">
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="label inline-flex flex-1 items-center justify-center gap-2 rounded-md bg-signal px-5 py-3 text-carbon transition-transform hover:-translate-y-0.5"
        >
          Lanjut ke WhatsApp
          <ArrowUpRight className="size-4" aria-hidden />
        </a>
        <button
          type="button"
          onClick={() => setOpen(false)}
          className="label rounded-md px-5 py-3 text-concrete transition-colors hover:bg-white/5 hover:text-bone"
        >
          Nanti dulu
        </button>
      </div>
    </dialog>
  );
};
