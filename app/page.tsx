import { jsonLd } from "@/lib/schema";
import { BranchSelector } from "@/components/sections/branches";
import { Gallery } from "@/components/sections/gallery";
import { Hero, Intro, Marquee } from "@/components/sections/hero";
import { KnowYourCut } from "@/components/sections/know-your-cut";
import { Location } from "@/components/sections/location";
import { Menu } from "@/components/sections/menu";
import { Crew, Instagram, Reviews } from "@/components/sections/people";

export default function HomePage() {
  return (
    <>
      <script
        type="application/ld+json"
        // Content is built from our own typed data, never user input.
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd()) }}
      />

      <Hero />
      <Marquee />
      <Intro />
      <BranchSelector />
      <Menu />
      <Gallery />
      <KnowYourCut />
      <Crew />
      <Reviews />
      <Instagram />
      <Location />
    </>
  );
}
