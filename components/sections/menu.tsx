import { ArrowUpRight, Clock } from "lucide-react";
import {
  BRANCHES,
  PRICES_ARE_PLACEHOLDER,
  SERVICES,
  formatPrice,
} from "@/lib/data";
import { bookingLink } from "@/lib/utils";
import { Reveal } from "../reveal";
import { Container, SectionLabel, SectionTitle } from "../ui";

export const Menu = () => (
  <section id="menu" className="scroll-mt-24 border-b border-white/10 py-20 sm:py-28">
    <Container>
      <Reveal>
        <SectionLabel>The Menu</SectionLabel>
        <SectionTitle>Layanan &amp; tarif</SectionTitle>
        <p className="mt-4 max-w-2xl text-base leading-relaxed text-concrete">
          Harga berlaku sama di semua cabang. Semua layanan sudah termasuk
          konsultasi sebelum mulai.
        </p>
      </Reveal>

      {PRICES_ARE_PLACEHOLDER ? (
        <Reveal delay={80}>
          <p
            className="mt-6 inline-flex rounded-md border border-signal/40 bg-signal/10 px-4 py-3 text-sm text-bone"
            role="note"
          >
            <strong className="mr-1">Perhatian:</strong> daftar harga di bawah
            masih contoh dan belum final. Konfirmasi tarif terbaru lewat
            WhatsApp.
          </p>
        </Reveal>
      ) : null}

      <ul className="mt-12 divide-y divide-white/10 border-y border-white/10">
        {SERVICES.map((service, i) => (
          <Reveal as="li" key={service.id} delay={i * 40}>
            <div className="group flex flex-col gap-4 py-6 sm:flex-row sm:items-center sm:justify-between">
              <div className="max-w-2xl">
                <div className="flex flex-wrap items-center gap-3">
                  <h3 className="font-display text-xl leading-tight font-extrabold uppercase">
                    {service.name}
                  </h3>
                  {service.featured ? (
                    <span className="label rounded-full bg-signal/15 px-2.5 py-1 text-signal">
                      Favorit
                    </span>
                  ) : null}
                </div>
                <p className="mt-2 text-sm leading-relaxed text-concrete">
                  {service.description}
                </p>
                <p className="mt-2 inline-flex items-center gap-1.5 text-xs text-concrete">
                  <Clock className="size-3.5" aria-hidden />
                  Sekitar {service.minutes} menit
                </p>
              </div>

              <div className="flex items-center gap-5 sm:flex-col sm:items-end sm:gap-2">
                <span className="font-display text-2xl font-extrabold whitespace-nowrap">
                  {formatPrice(service.price)}
                </span>
                <a
                  href={bookingLink(BRANCHES[0], service.name)}
                  data-booking
                  data-service={service.name}
                  className="label inline-flex items-center gap-2 rounded-md border border-white/15 px-4 py-2.5 text-bone transition-colors group-hover:border-signal/50 hover:bg-white/5"
                >
                  Booking
                  <ArrowUpRight className="size-3.5" aria-hidden />
                </a>
              </div>
            </div>
          </Reveal>
        ))}
      </ul>
    </Container>
  </section>
);
