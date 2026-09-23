"use client";

/* Floating mobile action bar. Appears after the hero so it never covers the
 *  first screen, and stays out of the way on desktop. */
import { useEffect, useState } from "react";
import Link from "next/link";
import { CalendarCheck, MapPin } from "lucide-react";
import { BRANCHES } from "@/lib/data";
import { bookingLink } from "@/lib/utils";

export const MobileCta = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 560);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div
      className={`fixed inset-x-0 bottom-0 z-30 border-t border-white/10 bg-carbon/95 backdrop-blur-md transition-transform duration-300 lg:hidden ${
        visible ? "translate-y-0" : "translate-y-full"
      }`}
      // `inert` (not aria-hidden) while off-screen: it removes the subtree from
      // the a11y tree AND from tab order in one attribute, so a focusable link
      // can never live inside a hidden region.
      inert={!visible}
    >
      <div className="mx-auto flex max-w-6xl gap-2 px-4 py-3">
        <Link
          href="/#lokasi"
          className="label inline-flex flex-1 items-center justify-center gap-2 rounded-md border border-white/15 px-4 py-3 text-bone"
        >
          <MapPin className="size-4" aria-hidden />
          Lokasi
        </Link>
        <a
          href={bookingLink(BRANCHES[0])}
          data-booking
          className="label inline-flex flex-[1.6] items-center justify-center gap-2 rounded-md bg-signal px-4 py-3 text-carbon"
        >
          <CalendarCheck className="size-4" aria-hidden />
          Booking Sekarang
        </a>
      </div>
    </div>
  );
};
