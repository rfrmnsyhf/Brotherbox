"use client";

import { ArrowUpRight, Scissors } from "lucide-react";
import { motion, useScroll, useTransform } from "motion/react";
import { BRANCHES, SITE } from "@/lib/data";
import { bookingLink } from "@/lib/utils";
import { Reveal } from "../reveal";
import { Container, SectionLabel } from "../ui";

const STATS = [
  { value: "8", label: "Cabang" },
  { value: "2", label: "Kota" },
  { value: "1", label: "Standar" },
];

export const Hero = () => {
  // Slow parallax on the backdrop. `useScroll` needs no target here — page
  // scroll drives it. Reduced motion: motion resolves this to no transform.
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 700], [0, 140]);
  const scale = useTransform(scrollY, [0, 700], [1.05, 1.18]);

  return (
    <section className="relative overflow-hidden border-b border-white/10">
      {/* Photo backdrop. Slightly oversized so the parallax never exposes an
       * edge. Dark gradient keeps the headline legible over any photo. */}
      <motion.div
        style={{ y, scale }}
        className="pointer-events-none absolute -inset-x-8 -top-8 -bottom-24"
        aria-hidden
      >
        <img
          src="/images/hero/barbershop-hero.jpg"
          alt=""
          className="size-full object-cover"
        />
      </motion.div>

      {/* Legibility + brand grading over the photo. */}
      <div
        className="pointer-events-none absolute inset-0 bg-carbon/72"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-0 bg-gradient-to-t from-carbon via-carbon/55 to-carbon/30"
        aria-hidden
      />

      {/* Motif grid stays, now over the photo. */}
      <div className="box-grid pointer-events-none absolute inset-0 opacity-40" />
      <div
        className="pointer-events-none absolute -top-40 right-0 size-[34rem] rounded-full bg-signal/15 blur-3xl"
        aria-hidden
      />

      <Container className="relative py-20 sm:py-28 lg:py-36">
        <div className="grid gap-12 lg:grid-cols-[1.4fr_1fr] lg:items-end">
          <div>
            <Reveal>
              <SectionLabel>
                {SITE.city.join(" · ")} — sejak cabang pertama
              </SectionLabel>
            </Reveal>

            <Reveal delay={80} direction="left">
              <h1 className="font-display text-[3.25rem] leading-[0.92] font-extrabold tracking-tight uppercase drop-shadow-[0_2px_24px_rgb(0_0_0/0.55)] sm:text-7xl lg:text-8xl">
                Come in.
                <br />
                Get <span className="text-signal">sharp.</span>
              </h1>
            </Reveal>

            <Reveal delay={160}>
              <p className="mt-6 max-w-xl text-base leading-relaxed text-bone/85 sm:text-lg">
                Brotherbox bukan cuma potong rambut. Setiap cabang pakai standar
                potongan yang sama, jadi kamu tahu apa yang kamu dapat — di
                Tanjungpinang maupun Batam.
              </p>
            </Reveal>

            <Reveal delay={240}>
              <div className="mt-8 flex flex-wrap items-center gap-3">
                <a
                  href={bookingLink(BRANCHES[0])}
                  data-booking
                  className="label inline-flex items-center gap-2 rounded-md bg-signal px-6 py-3.5 text-carbon transition-transform hover:-translate-y-0.5"
                >
                  Booking via WhatsApp
                  <ArrowUpRight className="size-4" aria-hidden />
                </a>
                <a
                  href="#menu"
                  className="label inline-flex items-center gap-2 rounded-md border border-white/15 bg-white/5 px-6 py-3.5 text-bone transition-colors hover:bg-white/10"
                >
                  <Scissors className="size-4" aria-hidden />
                  Lihat layanan
                </a>
              </div>
            </Reveal>
          </div>

          <Reveal delay={320} direction="right">
            <dl className="grid grid-cols-3 gap-4 border-t border-white/10 pt-8 lg:border-t-0 lg:border-l lg:pt-0 lg:pl-10">
              {STATS.map((stat) => (
                <div key={stat.label}>
                  <dt className="sr-only">{stat.label}</dt>
                  <dd>
                    <span className="font-display block text-4xl font-extrabold sm:text-5xl">
                      {stat.value}
                    </span>
                    <span className="label mt-1 block text-concrete">
                      {stat.label}
                    </span>
                  </dd>
                </div>
              ))}
            </dl>
          </Reveal>
        </div>
      </Container>
    </section>
  );
};

/** Scrolling brand strip. Pure CSS marquee, duplicated content for the loop. */
export const Marquee = () => {
  const words = [
    "Classic Cut",
    "Skin Fade",
    "Beard Sculpt",
    "Hot Towel Shave",
    "Hair Tattoo",
    "Kids Cut",
  ];
  const run = [...words, ...words];

  return (
    <div
      className="overflow-hidden border-b border-white/10 bg-carbon-soft py-4"
      aria-hidden
    >
      <div className="flex w-max animate-marquee">
        {run.map((word, i) => (
          <span
            key={`${word}-${i}`}
            className="label flex shrink-0 items-center gap-6 px-6 text-concrete"
          >
            {word}
            <span className="text-signal">✳</span>
          </span>
        ))}
      </div>
    </div>
  );
};

/** Short "who we are" band that hands off to the branch list. */
export const Intro = () => (
  <section className="border-b border-white/10 py-20 sm:py-24">
    <Container>
      <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
        <Reveal>
          <SectionLabel>Tentang</SectionLabel>
          <h2 className="font-display text-3xl leading-[1.05] font-extrabold tracking-tight uppercase sm:text-4xl">
            Satu brand, delapan kursi, nol kompromi soal rapi.
          </h2>
        </Reveal>
        <Reveal delay={120}>
          <div className="space-y-4 text-base leading-relaxed text-concrete">
            <p>
              Kami mulai dari satu kursi di Batu 9. Sekarang ada delapan cabang
              yang tersebar di Tanjungpinang dan Batam, tapi cara kerjanya tidak
              berubah: konsultasi dulu, baru potong.
            </p>
            <p>
              Semua barber kami dilatih dengan standar yang sama, jadi hasilnya
              konsisten di cabang mana pun kamu datang. Tidak ada kejutan, tidak
              ada tebak-tebakan.
            </p>
          </div>
        </Reveal>
      </div>
    </Container>
  </section>
);
