/* Structured data. Branch hours are emitted as OpeningHoursSpecification so
 *  Google can show "Open now" instead of guessing from prose.
 *  ponytail: geo/sameAs are omitted while the underlying values are
 *  placeholders — invalid structured data is worse than none. */
import { BRANCHES, SITE, type Branch } from "@/lib/data";
import { toMinutes } from "@/lib/utils";

/** Schema.org wants days as two-letter codes, Monday-first. */
const DAY_CODES = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

const openingHours = (branch: Branch) => {
  if (!branch.hours) return undefined;
  const open = toMinutes(branch.hours.open);
  const close = toMinutes(branch.hours.close);
  if (open === null || close === null) return undefined;

  const days = [0, 1, 2, 3, 4, 5, 6].filter(
    (d) => !branch.closedDays.includes(d),
  );
  if (!days.length) return undefined;

  return [
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: days.map((d) => DAY_CODES[d]),
      opens: branch.hours.open,
      closes: branch.hours.close,
    },
  ];
};

const branchSchema = (branch: Branch) => ({
  "@type": "HairSalon",
  "@id": `${SITE.url}/branches/${branch.slug}/#business`,
  name: branch.name,
  url: `${SITE.url}/branches/${branch.slug}/`,
  telephone: branch.whatsapp ? `+${branch.whatsapp}` : undefined,
  address: {
    "@type": "PostalAddress",
    streetAddress: branch.address,
    addressLocality: branch.city,
    addressRegion: SITE.region,
    addressCountry: SITE.country,
  },
  geo: branch.geo
    ? {
        "@type": "GeoCoordinates",
        latitude: branch.geo.lat,
        longitude: branch.geo.lng,
      }
    : undefined,
  openingHoursSpecification: openingHours(branch),
  parentOrganization: { "@id": `${SITE.url}/#organization` },
});

export const jsonLd = () => ({
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": `${SITE.url}/#organization`,
      name: SITE.legalName,
      url: SITE.url,
      description: SITE.description,
      areaServed: SITE.city.map((c) => ({
        "@type": "City",
        name: c,
      })),
      sameAs: [`https://instagram.com/${SITE.instagram}`],
    },
    {
      "@type": "WebSite",
      "@id": `${SITE.url}/#website`,
      url: SITE.url,
      name: SITE.name,
      inLanguage: "id-ID",
      publisher: { "@id": `${SITE.url}/#organization` },
    },
    ...BRANCHES.map(branchSchema),
  ],
});
