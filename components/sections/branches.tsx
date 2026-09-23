import Link from "next/link";
import { ArrowUpRight, Clock, MapPin } from "lucide-react";
import { BRANCHES, type Branch } from "@/lib/data";
import { bookingLink } from "@/lib/utils";
import { OpenBadge } from "../open-badge";
import { Reveal } from "../reveal";
import {
  Container,
  PlaceholderFrame,
  SectionLabel,
  SectionTitle,
} from "../ui";

export const BranchCard = ({ branch, index = 0 }: { branch: Branch; index?: number }) => (
  <li><Reveal delay={index * 60}>
    <article className="group flex h-full flex-col overflow-hidden rounded-xl border border-white/10 bg-carbon-soft transition-colors hover:border-signal/40">
      {branch.image ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={branch.image}
          alt={`Cabang ${branch.name}`}
          className="aspect-[4/3] w-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />
      ) : (
        <PlaceholderFrame label={branch.name} flush />
      )}

      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="label text-signal">{branch.city}</p>
            <h3 className="font-display mt-1 text-lg leading-tight font-extrabold uppercase">
              {branch.name}
            </h3>
          </div>
          <OpenBadge branch={branch} />
        </div>

        <p className="mt-3 text-sm leading-relaxed text-concrete">{branch.note}</p>

        <dl className="mt-4 space-y-2 text-sm text-concrete">
          <div className="flex gap-2">
            <dt className="sr-only">Alamat</dt>
            <MapPin className="mt-0.5 size-4 shrink-0" aria-hidden />
            <dd>{branch.address}</dd>
          </div>
          <div className="flex gap-2">
            <dt className="sr-only">Jam operasional</dt>
            <Clock className="mt-0.5 size-4 shrink-0" aria-hidden />
            <dd>
              {branch.hours
                ? `${branch.hours.open}–${branch.hours.close} WIB`
                : "Jam buka belum tersedia"}
            </dd>
          </div>
        </dl>

        <div className="mt-5 flex flex-wrap gap-2 pt-1">
          <a
            href={bookingLink(branch)}
            data-booking
            data-branch-slug={branch.slug}
            className="label inline-flex flex-1 items-center justify-center gap-2 rounded-md bg-signal px-4 py-2.5 text-carbon"
          >
            Booking
          </a>
          <Link
            href={`/branches/${branch.slug}`}
            className="label inline-flex items-center gap-2 rounded-md border border-white/15 px-4 py-2.5 text-bone hover:bg-white/5"
          >
            Detail
            <ArrowUpRight className="size-3.5" aria-hidden />
          </Link>
        </div>
      </div>
    </article>
  </Reveal></li>
);

export const BranchSelector = () => (
  <section
    id="cabang"
    className="scroll-mt-24 border-b border-white/10 py-20 sm:py-28"
  >
    <Container>
      <Reveal>
        <SectionLabel>Cabang</SectionLabel>
        <SectionTitle>Pilih yang paling dekat</SectionTitle>
        <p className="mt-4 max-w-2xl text-base leading-relaxed text-concrete">
          Delapan cabang di dua kota. Status buka/tutup di bawah dihitung
          langsung pakai WIB, jadi yang kamu lihat itu kondisi saat ini — bukan
          jadwal lama.
        </p>
      </Reveal>

      <ul className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {BRANCHES.map((branch, i) => (
          <BranchCard key={branch.slug} branch={branch} index={i} />
        ))}
      </ul>
    </Container>
  </section>
);
