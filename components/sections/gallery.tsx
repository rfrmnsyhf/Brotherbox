"use client";

/* THE CUTS gallery with the §10 tag filter.
 * Filter state is local; every card is rendered for every tag from the start
 * so the grid never reflows from zero and no JS is needed to see the content.
 */
import { useMemo, useState } from "react";
import { CUT_STYLES, CUT_TAGS } from "@/lib/data";
import { Reveal } from "../reveal";
import { Container, PlaceholderFrame, SectionLabel, SectionTitle } from "../ui";

export const Gallery = () => {
  const [tag, setTag] = useState<string>("all");

  const visible = useMemo(
    () =>
      tag === "all" ? CUT_STYLES : CUT_STYLES.filter((s) => s.tags.includes(tag)),
    [tag],
  );

  const filters = ["all", ...CUT_TAGS];

  return (
    <section id="cuts" className="scroll-mt-24 border-b border-white/10 py-20 sm:py-28">
      <Container>
        <Reveal>
          <SectionLabel>The Cuts</SectionLabel>
          <SectionTitle>Gaya yang kami kuasai</SectionTitle>
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-concrete">
            Filter di bawah buat nyari gaya sesuai selera. Belum yakin cocok
            yang mana? Jawab empat pertanyaan di bagian Know Your Cut.
          </p>
        </Reveal>

        <Reveal delay={80}>
          <div
            className="mt-8 flex flex-wrap gap-2"
            role="group"
            aria-label="Filter gaya potongan"
          >
            {filters.map((f) => {
              const active = f === tag;
              return (
                <button
                  key={f}
                  type="button"
                  onClick={() => setTag(f)}
                  aria-pressed={active}
                  className={`label rounded-full px-3.5 py-2 transition-colors ${
                    active
                      ? "bg-signal text-carbon"
                      : "bg-white/5 text-concrete ring-1 ring-white/10 hover:text-bone"
                  }`}
                >
                  {f === "all" ? "Semua" : f}
                </button>
              );
            })}
          </div>
        </Reveal>

        <p className="mt-4 text-xs text-concrete" aria-live="polite">
          {visible.length} gaya ditampilkan
          {tag !== "all" ? ` untuk filter “${tag}”` : ""}.
        </p>

        <ul className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {visible.map((style, i) => (
            <Reveal as="li" key={style.id} delay={i * 50}>
              <article className="group overflow-hidden rounded-xl border border-white/10 bg-carbon-soft">
                {style.image ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={style.image}
                    alt={`Contoh gaya ${style.name}`}
                    className="aspect-[4/3] w-full object-cover"
                    loading="lazy"
                  />
                ) : (
                  <PlaceholderFrame label={style.name} flush />
                )}
                <div className="p-5">
                  <h3 className="font-display text-lg font-extrabold uppercase">
                    {style.name}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-concrete">
                    {style.reason}
                  </p>
                  <ul className="mt-4 flex flex-wrap gap-1.5">
                    {style.tags.map((t) => (
                      <li
                        key={t}
                        className="label rounded-full bg-white/5 px-2.5 py-1 text-concrete ring-1 ring-white/10"
                      >
                        {t}
                      </li>
                    ))}
                  </ul>
                </div>
              </article>
            </Reveal>
          ))}
        </ul>

        {visible.length === 0 ? (
          <p className="mt-10 text-center text-sm text-concrete">
            Belum ada gaya untuk filter ini.
          </p>
        ) : null}
      </Container>
    </section>
  );
};
