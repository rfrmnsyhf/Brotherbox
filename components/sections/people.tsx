import { ArrowUpRight, Quote } from "lucide-react";
import {
  BRANCHES,
  CREW,
  INSTAGRAM_POSTS,
  REVIEWS,
  REVIEWS_ARE_PLACEHOLDER,
  SITE,
} from "@/lib/data";
import { Reveal } from "../reveal";
import {
  Container,
  PlaceholderFrame,
  SectionLabel,
  SectionTitle,
  Stars,
} from "../ui";

export const Crew = () => (
  <section id="crew" className="scroll-mt-24 border-b border-white/10 py-20 sm:py-28">
    <Container>
      <Reveal>
        <SectionLabel>Barber</SectionLabel>
        <SectionTitle>Orang yang pegang gunting</SectionTitle>
        <p className="mt-4 max-w-2xl text-base leading-relaxed text-concrete">
          Semua barber kami lewat pelatihan standar Brotherbox sebelum pegang
          kursi sendiri.
        </p>
      </Reveal>

      <ul className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {CREW.map((person, i) => {
          const branch = BRANCHES.find((b) => b.slug === person.branchSlug);
          return (
            <li><Reveal key={person.id} delay={i * 60}>
              <article className="group h-full overflow-hidden rounded-xl border border-white/10 bg-carbon-soft transition-colors hover:border-signal/40">
                {person.image ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={person.image}
                    alt={person.name}
                    className="aspect-square w-full object-cover transition-transform duration-500 group-hover:scale-105"
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
                  <h3 className="font-display text-base leading-tight font-extrabold uppercase">
                    {person.name}
                  </h3>
                  <p className="label mt-1 text-signal">{person.role}</p>
                  {branch ? (
                    <p className="mt-2 text-xs text-concrete">{branch.name}</p>
                  ) : null}
                  <ul className="mt-3 flex flex-wrap gap-1.5">
                    {person.specialties.map((s) => (
                      <li
                        key={s}
                        className="label rounded-full bg-white/5 px-2.5 py-1 text-concrete ring-1 ring-white/10"
                      >
                        {s}
                      </li>
                    ))}
                  </ul>
                </div>
              </article>
            </Reveal></li>
          );
        })}
      </ul>
    </Container>
  </section>
);

export const Reviews = () => (
  <section className="border-b border-white/10 py-20 sm:py-28">
    <Container>
      <Reveal>
        <SectionLabel>Kata Mereka</SectionLabel>
        <SectionTitle>Yang bilang setelah duduk di kursi</SectionTitle>
      </Reveal>

      {REVIEWS_ARE_PLACEHOLDER ? (
        <Reveal delay={60}>
          <p
            className="mt-6 inline-flex rounded-md border border-signal/40 bg-signal/10 px-4 py-3 text-sm text-bone"
            role="note"
          >
            <strong className="mr-1">Perhatian:</strong> ulasan di bawah masih
            contoh. Belum kami tampilkan ulasan asli sampai ada izin dari
            pelanggan.
          </p>
        </Reveal>
      ) : null}

      <ul className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {REVIEWS.map((review, i) => (
          <li><Reveal key={review.id} delay={i * 60}>
            <figure className="flex h-full flex-col rounded-xl border border-white/10 bg-carbon-soft p-6">
              <Quote className="size-6 text-signal" aria-hidden />
              <blockquote className="mt-4 flex-1 text-sm leading-relaxed text-bone">
                {review.text}
              </blockquote>
              <figcaption className="mt-5 flex items-center justify-between gap-3 border-t border-white/10 pt-4">
                <span className="text-sm text-concrete">{review.name}</span>
                <Stars rating={review.rating} />
              </figcaption>
            </figure>
          </Reveal></li>
        ))}
      </ul>
    </Container>
  </section>
);

export const Instagram = () => (
  <section className="border-b border-white/10 py-20 sm:py-28">
    <Container>
      <Reveal>
        <SectionLabel>Dari Kotak</SectionLabel>
        <SectionTitle>Hasil terbaru di Instagram</SectionTitle>
        <p className="mt-4 max-w-2xl text-base leading-relaxed text-concrete">
          Foto asli hasil potongan barber kami — bukan stok foto.
        </p>
      </Reveal>

      <ul className="mt-12 grid grid-cols-2 gap-4 lg:grid-cols-4">
        {INSTAGRAM_POSTS.map((post, i) => (
          <li><Reveal key={post.id} delay={i * 50}>
            <a
              href={post.url}
              target="_blank"
              rel="noopener noreferrer"
              className="block overflow-hidden rounded-xl border border-white/10 bg-carbon-soft transition-colors hover:border-signal/40"
            >
              {post.image ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={post.image}
                  alt={post.caption}
                  className="aspect-square w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  loading="lazy"
                />
              ) : (
                <PlaceholderFrame
                  label="Foto dari Instagram"
                  ratio="aspect-square"
                  flush
                />
              )}
              <p className="p-4 text-xs text-concrete">{post.caption}</p>
            </a>
          </Reveal></li>
        ))}
      </ul>

      <Reveal delay={200}>
        <a
          href={`https://instagram.com/${SITE.instagram}`}
          target="_blank"
          rel="noopener noreferrer"
          className="label mt-8 inline-flex items-center gap-2 rounded-md border border-white/15 px-6 py-3.5 text-bone hover:bg-white/5"
        >
          Ikuti @{SITE.instagram}
          <ArrowUpRight className="size-4" aria-hidden />
        </a>
      </Reveal>
    </Container>
  </section>
);
