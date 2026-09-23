import type { Metadata } from "next";
import { Archivo, Inter } from "next/font/google";
import { SITE } from "@/lib/data";
import { BookingDialog } from "@/components/booking-dialog";
import { Footer, Header } from "@/components/chrome";
import { MobileCta } from "@/components/mobile-cta";
import "./globals.css";

const archivo = Archivo({
  subsets: ["latin"],
  weight: ["700", "800", "900"],
  variable: "--font-archivo",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: `${SITE.name} — Barbershop Tanjungpinang & Batam`,
    template: `%s · ${SITE.name}`,
  },
  description: SITE.description,
  applicationName: SITE.name,
  keywords: [
    "barbershop Tanjungpinang",
    "barbershop Batam",
    "fade Batam",
    "cukur rambut Tanjungpinang",
    "Brotherbox",
  ],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "id_ID",
    siteName: SITE.name,
    title: `${SITE.name} — ${SITE.tagline}`,
    description: SITE.description,
    url: SITE.url,
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE.name} — ${SITE.tagline}`,
    description: SITE.description,
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id" className={`${archivo.variable} ${inter.variable}`}>
      <body className="min-h-dvh bg-carbon text-bone antialiased">
        {/* First tab stop: jump straight to content. */}
        <a
          href="#main"
          className="label sr-only focus:not-sr-only focus:absolute focus:top-3 focus:left-3 focus:z-50 focus:rounded-md focus:bg-signal focus:px-4 focus:py-2.5 focus:text-carbon"
        >
          Lompat ke konten
        </a>

        <Header />
        <main id="main" className="pb-24 lg:pb-0">
          {children}
        </main>
        <Footer />

        {/* One dialog for the whole page; triggers are plain links. */}
        <BookingDialog />
        <MobileCta />
      </body>
    </html>
  );
}
