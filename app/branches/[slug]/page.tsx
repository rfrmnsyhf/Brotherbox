import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, ArrowUpRight, Clock, MapPin, Navigation } from "lucide-react";
import { BRANCHES, CREW, SERVICES, SITE, formatPrice } from "@/lib/data";
import { bookingLink } from "@/lib/utils";
import { jsonLd } from "@/lib/schema";
import { OpenBadge } from "@/components/open-badge";
import { mapsHref } from "@/components/sections/location";
import { Reveal } from "@/components/reveal";
import { Container, PlaceholderFrame, SectionLabel } from "@/components/ui";

// Fully static: one HTML file per branch, no server.
export const dynamicParams = false;

export function generateStaticParams() {
  return BRANCHES.map((branch) => ({ slug: branch.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const branch = BRANCHES.find((b) => b.slug === slug);
  if (!branch) return {};

  const title = `${branch.name} — ${branch.city}`;
  const description = `${branch.name} di ${branch.area}, ${branch.city}. ${branch.note} Booking via WhatsApp.`;

  return {
    title,
    description,
    alternates: { canonical: `/branches/${branch.slug}/` },
    openGraph: {
      type: "website",
      locale: "id_ID",
      title,
      description,
      url: `${SITE.url}/branches/${branch.slug}/`,
    },
  };
}

export default async function BranchPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const branch = BRANCHES.find((b) => b.slug === slug);
  if (!branch) notFound();

  const crew = CREW.filter((c) => c.branchSlug === branch.slug);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "HairSalon",
            name: branch.name,
            url: `${SITE.url}/branches/${branch.slug}/`,
            address: {
              "@type": "PostalAddress",
              streetAddress: branch.address,
              addressLocality: branch.city,
              addressRegion: SITE.region,
              addressCountry: SITE.country,
            },
          }),
        }}
      />

      <Container className="py-10">
        <Link
          href="/#cabang"
          className="label inline-flex items-center gap-2 text-concrete transition-colors hover:text-bone"
        >
          <ArrowLeft className="size-4" aria-hidden />
          Semua cabang
        </Link>
      </Container>

      <section className="border-y border-white/10 py-14 sm:py-20">
        <Container>
          <div className="grid gap-10 lg:grid-cols-[1.3fr_1fr]">
            <div>
              <SectionLabel>
                {branch.area} — {branch.city}
              </SectionLabel>
              <h1 className="font-display text-4xl leading-[0.98] font-extrabold tracking-tight uppercase sm:text-6xl">
                {branch.name}
              </h1>
              <p className="mt-5 max-w-xl text-base leading-relaxed text-concrete">
                {branch.note}
              </p>

              <div className="mt-7">
                <OpenBadge branch={branch} showLabel />
              </div>

              <div className="mt-8 flex flex-wrap gap-3">
                <a
                  href={bookingLink(branch)}
                  data-booking
                  data-branch-slug={branch.slug}
                  className="label inline-flex items-center gap-2 rounded-md bg-signal px-6 py-3.5 text-carbon transition-transform hover:-translate-y-0.5"
                >
                  Booking cabang ini
                  <ArrowUpRight className="size-4" aria-hidden />
                </a>
                <a
                  href={mapsHref(branch)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="label inline-flex items-center gap-2 rounded-md border border-white/15 px-6 py-3.5 text-bone hover:bg-white/5"
                >
                  <Navigation className="size-4" aria-hidden />
                  Buka rute
                </a>
              </div>
            </div>

            <div className="rounded-xl border border-white/10 bg-carbon-soft p-6">
              <h2 className="label text-signal">Info cabang</h2>
              <dl className="mt-4 space-y-4 text-sm">
                <div>
                  <dt className="label text-concrete">Alamat</dt>
                  <dd className="mt-1 flex gap-2 text-bone">
                    <MapPin className="mt-0.5 size-4 shrink-0 text-concrete" aria-hidden />
                    {branch.address}
                  </dd>
                </div>
                <div>
                  <dt className="label text-concrete">Jam operasional</dt>
                  <dd className="mt-1 flex gap-2 text-bone">
                    <Clock className="mt-0.5 size-4 shrink-0 text-concrete" aria-hidden />
                    {branch.hours
                      ? `${branch.hours.open}–${branch.hours.close} WIB`
                      : "Belum tersedia"}
                  </dd>
                </div>
                <div>
                  <dt className="label text-concrete">Status</dt>
                  <dd className="mt-1">
                    {/* Client-side on purpose: a server render would freeze
                        this at build time and lie after the first hour. */}
                    <OpenBadge branch={branch} showLabel />
                  </dd>
                </div>
              </dl>
              {!branch.whatsapp ? (
                <p className="mt-5 border-t border-white/10 pt-4 text-xs leading-relaxed text-concrete">
                  Cabang ini belum punya nomor sendiri, jadi booking diarahkan
                  ke WhatsApp pusat.
                </p>
              ) : null}
            </div>
          </div>
        </Container>
      </section>

      <section className="border-b border-white/10 py-16">
        <Container>
          <SectionLabel>Layanan</SectionLabel>
          <h2 className="font-display text-2xl font-extrabold uppercase">
            Tersedia di cabang ini
          </h2>
          <ul className="mt-8 divide-y divide-white/10 border-y border-white/10">
            {SERVICES.map((service) => (
              <li
                key={service.id}
                className="flex items-center justify-between gap-4 py-4"
              >
                <div>
                  <p className="font-display text-base font-extrabold uppercase">
                    {service.name}
                  </p>
                  <p className="mt-1 text-xs text-concrete">
                    Sekitar {service.minutes} menit
                  </p>
                </div>
                <span className="font-display text-lg font-extrabold whitespace-nowrap">
                  {formatPrice(service.price)}
                </span>
              </li>
            ))}
          </ul>
        </Container>
      </section>

      <section className="py-16">
        <Container>
          <SectionLabel>Barber</SectionLabel>
          <h2 className="font-display text-2xl font-extrabold uppercase">
            Yang bertugas di sini
          </h2>

          {crew.length ? (
            <ul className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {crew.map((person) => (
                <li key={person.id}>
                  <Reveal>
                    <article className="overflow-hidden rounded-xl border border-white/10 bg-carbon-soft">
                      {person.image ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={person.image}
                          alt={person.name}
                          className="aspect-square w-full object-cover"
                          loading="lazy"
                        />
                      ) : (
                        <PlaceholderFrame
                          label="Foto barber"
                          ratio="aspect-square"
                          flush
                        />
                      )}
                      <div className="p-5">
                        <h3 className="font-display text-base font-extrabold uppercase">
                          {person.name}
                        </h3>
                        <p className="label mt-1 text-signal">{person.role}</p>
                      </div>
                    </article>
                  </Reveal>
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-6 max-w-xl text-sm leading-relaxed text-concrete">
              Belum ada barber yang terdaftar untuk cabang ini. Hubungi WhatsApp
              pusat untuk tahu siapa yang bertugas hari ini.
            </p>
          )}
        </Container>
      </section>
    </>
  );
}
