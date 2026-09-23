import { ArrowUpRight, Clock, MapPin, Navigation } from "lucide-react";
import { BRANCHES, type Branch } from "@/lib/data";
import { bookingLink } from "@/lib/utils";
import { OpenBadge } from "../open-badge";
import { Reveal } from "../reveal";
import { Container, SectionLabel, SectionTitle } from "../ui";

/** Google Maps link: an explicit URL if the client supplied one, otherwise a
 *  plain search on the address. Never a hardcoded pin we cannot verify. */
export const mapsHref = (branch: Branch): string =>
  branch.mapsUrl ??
  `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    `${branch.name} ${branch.address}`,
  )}`;

const LocationRow = ({ branch, index }: { branch: Branch; index: number }) => (
  <li><Reveal delay={index * 50}>
    <div className="flex flex-col gap-4 py-6 sm:flex-row sm:items-center sm:justify-between">
      <div className="max-w-xl">
        <div className="flex flex-wrap items-center gap-3">
          <h3 className="font-display text-lg leading-tight font-extrabold uppercase">
            {branch.name}
          </h3>
          <OpenBadge branch={branch} />
        </div>
        <p className="mt-2 flex gap-2 text-sm text-concrete">
          <MapPin className="mt-0.5 size-4 shrink-0" aria-hidden />
          {branch.address}
        </p>
        <p className="mt-1.5 flex gap-2 text-sm text-concrete">
          <Clock className="mt-0.5 size-4 shrink-0" aria-hidden />
          {branch.hours
            ? `${branch.hours.open}–${branch.hours.close} WIB`
            : "Jam buka belum tersedia"}
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        <a
          href={mapsHref(branch)}
          target="_blank"
          rel="noopener noreferrer"
          className="label inline-flex items-center gap-2 rounded-md border border-white/15 px-4 py-2.5 text-bone hover:bg-white/5"
        >
          <Navigation className="size-3.5" aria-hidden />
          Rute
        </a>
        <a
          href={bookingLink(branch)}
          data-booking
          data-branch-slug={branch.slug}
          className="label inline-flex items-center gap-2 rounded-md bg-signal px-4 py-2.5 text-carbon"
        >
          Booking
          <ArrowUpRight className="size-3.5" aria-hidden />
        </a>
      </div>
    </div>
  </Reveal></li>
);

export const Location = () => (
  <section id="lokasi" className="scroll-mt-24 border-b border-white/10 py-20 sm:py-28">
    <Container>
      <Reveal>
        <SectionLabel>Lokasi</SectionLabel>
        <SectionTitle>Alamat lengkap semua cabang</SectionTitle>
        <p className="mt-4 max-w-2xl text-base leading-relaxed text-concrete">
          Ketuk “Rute” untuk langsung membuka panduan arah di Google Maps.
        </p>
      </Reveal>

      <ul className="mt-10 divide-y divide-white/10 border-y border-white/10">
        {BRANCHES.map((branch, i) => (
          <LocationRow key={branch.slug} branch={branch} index={i} />
        ))}
      </ul>
    </Container>
  </section>
);
