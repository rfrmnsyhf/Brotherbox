import Link from "next/link";
import { ArrowUpRight, Menu } from "lucide-react";
import { BRANCHES, SITE } from "@/lib/data";
import { bookingLink } from "@/lib/utils";
import { Container } from "./ui";

const NAV = [
  { href: "/#cabang", label: "Cabang" },
  { href: "/#menu", label: "Layanan" },
  { href: "/#cuts", label: "The Cuts" },
  { href: "/#know-your-cut", label: "Know Your Cut" },
  { href: "/#crew", label: "Barber" },
  { href: "/#lokasi", label: "Lokasi" },
];

export const Header = () => (
  <header className="sticky top-0 z-40 border-b border-white/10 bg-carbon/85 backdrop-blur-md">
    <Container>
      <div className="flex h-16 items-center justify-between gap-4">
        <Link
          href="/"
          className="font-display text-lg font-extrabold tracking-tight uppercase"
        >
          Brother<span className="text-signal">box</span>
        </Link>

        <nav aria-label="Navigasi utama" className="hidden lg:block">
          <ul className="flex items-center gap-7">
            {NAV.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="label text-concrete transition-colors hover:text-bone"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-2">
          <a
            href={bookingLink(BRANCHES[0])}
            data-booking
            className="label hidden items-center gap-2 rounded-md bg-signal px-4 py-2.5 text-carbon transition-transform hover:-translate-y-0.5 sm:inline-flex"
          >
            Booking
            <ArrowUpRight className="size-3.5" aria-hidden />
          </a>

          {/* Native disclosure — no JS, no state, keyboard accessible. */}
          <details className="group relative lg:hidden">
            <summary className="flex cursor-pointer list-none items-center gap-2 rounded-md border border-white/15 px-3 py-2.5 text-concrete transition-colors hover:text-bone">
              <Menu className="size-4" aria-hidden />
              <span className="label">Menu</span>
            </summary>
            <div className="absolute right-0 mt-2 w-56 rounded-lg border border-white/10 bg-carbon-soft p-2 shadow-2xl">
              <ul>
                {NAV.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className="label block rounded-md px-3 py-2.5 text-concrete hover:bg-white/5 hover:text-bone"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
              <a
                href={bookingLink(BRANCHES[0])}
                data-booking
                className="label mt-1 block rounded-md bg-signal px-3 py-2.5 text-center text-carbon sm:hidden"
              >
                Booking via WhatsApp
              </a>
            </div>
          </details>
        </div>
      </div>
    </Container>
  </header>
);

export const Footer = () => (
  <footer className="border-t border-white/10 bg-carbon py-14">
    <Container>
      <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
        <div className="lg:col-span-2">
          <p className="font-display text-2xl font-extrabold tracking-tight uppercase">
            Brother<span className="text-signal">box</span>
          </p>
          <p className="mt-3 max-w-sm text-sm leading-relaxed text-concrete">
            {SITE.description}
          </p>
        </div>

        <div>
          <p className="label mb-3 text-signal">Kunjungi</p>
          <ul className="space-y-2">
            {NAV.slice(0, 4).map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="text-sm text-concrete transition-colors hover:text-bone"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="label mb-3 text-signal">Kontak</p>
          <ul className="space-y-2 text-sm text-concrete">
            <li>
              <a
                href={`https://instagram.com/${SITE.instagram}`}
                target="_blank"
                rel="noopener noreferrer"
                className="transition-colors hover:text-bone"
              >
                Instagram @{SITE.instagram}
              </a>
            </li>
            <li>
              <a
                href={`mailto:${SITE.email}`}
                className="transition-colors hover:text-bone"
              >
                {SITE.email}
              </a>
            </li>
            <li>{SITE.city.join(" · ")}</li>
          </ul>
        </div>
      </div>

      <div className="mt-12 flex flex-col gap-3 border-t border-white/10 pt-6 text-xs text-concrete sm:flex-row sm:items-center sm:justify-between">
        <p>
          © {new Date().getFullYear()} {SITE.legalName}. Semua hak dilindungi.
        </p>
        <p>
          Jam operasional mengikuti WIB (Asia/Jakarta) · {SITE.region}
        </p>
      </div>
    </Container>
  </footer>
);
