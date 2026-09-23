/* ==========================================================================
   BROTHERBOX — content layer
   Everything the client needs to fill in lives here. No component edits
   required to go live.
   
   PLACEHOLDER CONVENTION
   ------------------------------------------------------------------
   Any value starting with "TODO" is an unfilled placeholder. Run
   `npm run selfcheck` to list every one that is still open before launch.
   ========================================================================== */

/** Single source of truth for canonical URLs, sitemap, OG tags.
 *  Swap this one line when the real domain is live. */
export const SITE = {
  url: "https://brotherbox.id", // TODO: confirm production domain
  name: "Brotherbox",
  legalName: "Brotherbox Barbershop",
  tagline: "COME IN. GET SHARP.",
  description:
    "Premium barbershop di Tanjungpinang & Batam. 8 cabang, satu standar potongan. Booking langsung via WhatsApp.",
  /** Central WhatsApp — the fallback for any branch whose own number is
   *  still a placeholder. International format, digits only, no "+". */
  waPusat: "6281234567890", // TODO: nomor WhatsApp pusat
  instagram: "brotherbox.id", // TODO: handle Instagram asli
  email: "hello@brotherbox.id", // TODO: email resmi
  city: ["Tanjungpinang", "Batam"],
  region: "Kepulauan Riau",
  country: "ID",
  currency: "IDR",
} as const;

export const isTodo = (v: unknown): boolean =>
  typeof v === "string" && v.trim().toUpperCase().startsWith("TODO");

/* ------------------------------------------------------------- branches -- */

export type Branch = {
  slug: string;
  name: string;
  city: "Tanjungpinang" | "Batam";
  area: string;
  /** Full street address for the location card and schema.org. */
  address: string;
  /** Branch WhatsApp (digits only). Null -> falls back to SITE.waPusat. */
  whatsapp: string | null;
  /** Google Maps link. Null -> built from `address`. */
  mapsUrl: string | null;
  /** Local WIB opening hours (24h, "HH:MM"). Null -> no open/closed badge. */
  hours: { open: string; close: string } | null;
  /** Days closed, 0 = Sunday. */
  closedDays: number[];
  /** Latitude/longitude for schema.org geo. Null -> omitted. */
  geo: { lat: number; lng: number } | null;
  /** Path under /public. Null -> renders the branded placeholder frame. */
  image: string | null;
  /** Short differentiator shown on the branch card. */
  note: string;
};

export const BRANCHES: Branch[] = [
  {
    slug: "batu-9",
    name: "Brotherbox Batu 9",
    city: "Tanjungpinang",
    area: "Batu 9",
    address: "TODO: alamat lengkap Batu 9",
    whatsapp: null,
    mapsUrl: null,
    hours: { open: "10:00", close: "21:00" }, // TODO: jam buka asli
    closedDays: [],
    geo: null,
    image: "/images/branches/batu-9.jpg",
    note: "Cabang pertama. Dua kursi, satu barber senior.",
  },
  {
    slug: "wiratno",
    name: "Brotherbox Wiratno",
    city: "Tanjungpinang",
    area: "Jalan Wiratno",
    address: "TODO: alamat lengkap Wiratno",
    whatsapp: null,
    mapsUrl: null,
    hours: { open: "10:00", close: "21:00" },
    closedDays: [],
    geo: null,
    image: "/images/branches/wiratno.jpg",
    note: "Dekat pusat kota, parkir paling gampang.",
  },
  {
    slug: "batu-5-bawah",
    name: "Brotherbox Batu 5 Bawah",
    city: "Tanjungpinang",
    area: "Batu 5 Bawah",
    address: "TODO: alamat lengkap Batu 5 Bawah",
    whatsapp: null,
    mapsUrl: null,
    hours: { open: "10:00", close: "21:00" },
    closedDays: [],
    geo: null,
    image: "/images/branches/batu-5-bawah.jpg",
    note: "Walk-in friendly, antrean paling cepat.",
  },
  {
    slug: "tiban-centre",
    name: "Brotherbox Tiban Centre",
    city: "Batam",
    area: "Tiban Centre",
    address: "TODO: alamat lengkap Tiban Centre",
    whatsapp: null,
    mapsUrl: null,
    hours: { open: "10:00", close: "22:00" },
    closedDays: [],
    geo: null,
    image: "/images/branches/tiban-centre.jpg",
    note: "Cabang terbesar di Batam. Empat kursi.",
  },
  {
    slug: "tiban-impian",
    name: "Brotherbox Tiban Impian",
    city: "Batam",
    area: "Tiban Impian",
    address: "TODO: alamat lengkap Tiban Impian",
    whatsapp: null,
    mapsUrl: null,
    hours: { open: "10:00", close: "21:00" },
    closedDays: [],
    geo: null,
    image: "/images/branches/tiban-impian.jpg",
    note: "Spesialis fade dan hair tattoo.",
  },
  {
    slug: "bengkong-ratu",
    name: "Brotherbox Bengkong Ratu",
    city: "Batam",
    area: "Bengkong",
    address: "TODO: alamat lengkap Bengkong Ratu",
    whatsapp: null,
    mapsUrl: null,
    hours: { open: "10:00", close: "21:00" },
    closedDays: [],
    geo: null,
    image: "/images/branches/bengkong-ratu.jpg",
    note: "Sering buka paling pagi buat yang sebelum kerja.",
  },
  {
    slug: "kepri-mall",
    name: "Brotherbox Kepri Mall",
    city: "Batam",
    area: "Kepri Mall",
    address: "TODO: alamat lengkap Kepri Mall (nomor lantai/unit)",
    whatsapp: null,
    mapsUrl: null,
    hours: { open: "10:00", close: "22:00" },
    closedDays: [],
    geo: null,
    image: "/images/branches/kepri-mall.jpg",
    note: "Ikut jam mall. Bisa ditelepon sambil belanja.",
  },
  {
    slug: "nagoya",
    name: "Brotherbox Nagoya",
    city: "Batam",
    area: "Nagoya",
    address: "TODO: alamat lengkap Nagoya",
    whatsapp: null,
    mapsUrl: null,
    hours: { open: "11:00", close: "22:00" },
    closedDays: [],
    geo: null,
    image: "/images/branches/nagoya.jpg",
    note: "Buka paling malam. Cocok buat setelah shift.",
  },
];

/** Resolve which number a booking goes to: the branch's own, else central. */
export const waForBranch = (b: Branch): string => b.whatsapp ?? SITE.waPusat;

/* ------------------------------------------------------------- services -- */

export type Service = {
  id: string;
  name: string;
  /** Indonesian one-liner — functional copy stays in Bahasa. */
  description: string;
  /** In thousand-rupiah, integer. See PRICE_PLACEHOLDER below. */
  price: number;
  minutes: number;
  /** Highlighted on the menu card. */
  featured?: boolean;
};

/** FLAG: every price below is a dummy value. Keep this true until the client
 *  signs off on the real price list, and make sure the UI surfaces the
 *  "harga konfirmasi via WhatsApp" disclaimer while it is. */
export const PRICES_ARE_PLACEHOLDER = true;

export const SERVICES: Service[] = [
  {
    id: "classic-cut",
    name: "Classic Cut",
    description:
      "Potongan gunting penuh, dikonsultasikan dulu sebelum mulai. Rapi, aman buat kerja.",
    price: 45,
    minutes: 45,
    featured: true,
  },
  {
    id: "skin-fade",
    name: "Skin Fade",
    description:
      "Fade bersih sampai kulit, garis pinggir tegas. Presisi clipper dan razor.",
    price: 60,
    minutes: 50,
    featured: true,
  },
  {
    id: "cut-beard",
    name: "Cut + Beard",
    description:
      "Potongan rambut plus pembentukan jenggot dan kumis. Paket paling sering diambil.",
    price: 85,
    minutes: 75,
    featured: true,
  },
  {
    id: "beard-sculpt",
    name: "Beard Sculpt",
    description:
      "Bentuk jenggot saja: trim, garis leher, hot towel, minyak jenggot.",
    price: 40,
    minutes: 30,
  },
  {
    id: "hot-towel-shave",
    name: "Hot Towel Shave",
    description:
      "Cukur pakai pisau, handuk panas, dan balsem penenang. Pengalaman lama yang jarang ditawarkan.",
    price: 55,
    minutes: 40,
  },
  {
    id: "kids-cut",
    name: "Kids Cut",
    description:
      "Buat umur 12 tahun ke bawah. Barber yang sabar, kursinya nyaman.",
    price: 35,
    minutes: 30,
  },
  {
    id: "wash-style",
    name: "Hair Wash & Style",
    description:
      "Cuci, blow dry, dan styling pakai produk. Cocok sebelum acara.",
    price: 30,
    minutes: 25,
  },
  {
    id: "hair-tattoo",
    name: "Hair Tattoo",
    description:
      "Garis desain di sisi kepala. Bisa custom atau pilih dari katalog.",
    price: 50,
    minutes: 40,
  },
];

/* --------------------------------------------------- cut styles (§10/§12) */

export type FaceShape = "oval" | "round" | "square" | "long" | "heart";
export type HairType = "lurus" | "bergelombang" | "keriting" | "tipis";
export type Lifestyle = "profesional" | "santai" | "sporty" | "kreatif";
export type Effort = "low" | "medium" | "high";

export type CutStyle = {
  id: string;
  name: string;
  /** Filter tags for THE CUTS gallery (§10). */
  tags: string[];
  face: FaceShape[];
  hair: HairType[];
  vibe: Lifestyle[];
  effort: Effort;
  /** Why this works — shown on the recommendation card. */
  reason: string;
  image: string | null;
};

export const CUT_STYLES: CutStyle[] = [
  {
    id: "textured-crop",
    name: "Textured Crop",
    tags: ["fade", "pendek", "textured"],
    face: ["oval", "round", "heart"],
    hair: ["lurus", "bergelombang", "tipis"],
    vibe: ["profesional", "santai", "sporty"],
    effort: "low",
    reason:
      "Bagian atas dibiarkan bertekstur sementara sisi dipendekkan, jadi wajah bulat dapat kesan lebih panjang tanpa perlu styling tiap hari.",
    image: "/images/cuts/textured-crop.jpg",
  },
  {
    id: "mid-fade",
    name: "Mid Fade",
    tags: ["fade", "pendek", "klasik"],
    face: ["oval", "square", "long"],
    hair: ["lurus", "bergelombang", "keriting"],
    vibe: ["profesional", "sporty"],
    effort: "medium",
    reason:
      "Transisi fade di tengah kepala menyeimbangkan wajah persegi dan tetap terlihat rapi sampai dua minggu.",
    image: "/images/cuts/mid-fade.jpg",
  },
  {
    id: "classic-side-part",
    name: "Classic Side Part",
    tags: ["klasik", "rapi", "medium"],
    face: ["oval", "long", "square"],
    hair: ["lurus", "bergelombang"],
    vibe: ["profesional"],
    effort: "high",
    reason:
      "Belahan samping memberi struktur pada wajah panjang dan paling pas buat yang kerja formal.",
    image: "/images/cuts/classic-side-part.jpg",
  },
  {
    id: "buzz-cut",
    name: "Buzz Cut",
    tags: ["pendek", "minimalis"],
    face: ["oval", "square"],
    hair: ["lurus", "tipis"],
    vibe: ["sporty", "santai"],
    effort: "low",
    reason:
      "Hampir tanpa perawatan. Wajah oval dan persegi jadi paling tegas tanpa perlu apa-apa lagi.",
    image: "/images/cuts/buzz-cut.jpg",
  },
  {
    id: "curly-taper",
    name: "Curly Taper",
    tags: ["keriting", "textured", "pendek"],
    face: ["oval", "round", "heart"],
    hair: ["keriting", "bergelombang"],
    vibe: ["santai", "kreatif"],
    effort: "medium",
    reason:
      "Volume keriting dipertahankan di atas, sisi dirapikan bertingkat. Bentuk rambut jadi aset, bukan masalah.",
    image: "/images/cuts/curly-taper.jpg",
  },
  {
    id: "slick-back",
    name: "Slick Back",
    tags: ["medium", "klasik", "rapi"],
    face: ["oval", "square", "long"],
    hair: ["lurus", "bergelombang"],
    vibe: ["profesional", "kreatif"],
    effort: "high",
    reason:
      "Membuka seluruh garis dahi sehingga wajah terlihat penuh dan berwibawa. Butuh disisir tiap hari.",
    image: "/images/cuts/slick-back.jpg",
  },
  {
    id: "french-crop",
    name: "French Crop",
    tags: ["fade", "pendek", "textured"],
    face: ["oval", "round", "long", "heart"],
    hair: ["lurus", "tipis", "bergelombang"],
    vibe: ["santai", "profesional", "sporty"],
    effort: "low",
    reason:
      "Fringe pendek di depan menutup dahi tinggi dan memberi ilusi wajah lebih pendek. Paling gampang dirawat.",
    image: "/images/cuts/french-crop.jpg",
  },
  {
    id: "long-flow",
    name: "Long Flow",
    tags: ["panjang", "medium"],
    face: ["oval", "heart", "square"],
    hair: ["bergelombang", "keriting"],
    vibe: ["kreatif", "santai"],
    effort: "high",
    reason:
      "Rambut dibiarkan panjang dengan layer supaya jatuh alami. Perlu trim rutin tiap 6–8 minggu.",
    image: "/images/cuts/long-flow.jpg",
  },
];

/** Gallery filter chips (§10). "all" is handled by the component. */
export const CUT_TAGS = Array.from(
  new Set(CUT_STYLES.flatMap((s) => s.tags)),
).sort();

/* ------------------------------------------------------------------ crew -- */

export type Crew = {
  id: string;
  name: string;
  role: string;
  branchSlug: string;
  specialties: string[];
  image: string | null;
};

export const CREW: Crew[] = [
  {
    id: "crew-1",
    name: "Barber 01",
    role: "Head Barber",
    branchSlug: "batu-9",
    specialties: ["Classic Cut", "Hot Towel Shave"],
    image: "/images/crew/barber-01.jpg",
  },
  {
    id: "crew-2",
    name: "Barber 02",
    role: "Senior Barber",
    branchSlug: "tiban-centre",
    specialties: ["Skin Fade", "Hair Tattoo"],
    image: "/images/crew/barber-02.jpg",
  },
  {
    id: "crew-3",
    name: "Barber 03",
    role: "Barber",
    branchSlug: "nagoya",
    specialties: ["Beard Sculpt", "Cut + Beard"],
    image: "/images/crew/barber-03.jpg",
  },
  {
    id: "crew-4",
    name: "Barber 04",
    role: "Barber",
    branchSlug: "kepri-mall",
    specialties: ["Kids Cut", "Curly Taper"],
    image: "/images/crew/barber-04.jpg",
  },
];

/* --------------------------------------------------------------- reviews -- */

export type Review = {
  id: string;
  name: string;
  text: string;
  rating: number;
};

/** FLAG: these are sample copy, not real customer reviews. Replace with
 *  real, attributable reviews before launch — do not scrape Google. */
export const REVIEWS_ARE_PLACEHOLDER = true;

export const REVIEWS: Review[] = [
  {
    id: "r1",
    name: "TODO: nama pelanggan",
    text: "TODO: tulis ulasan asli di sini.",
    rating: 5,
  },
];

/* ------------------------------------------------------------- instagram -- */

/** FLAG: post URLs and captions are placeholders. */
export const INSTAGRAM_POSTS: {
  id: string;
  url: string;
  caption: string;
  /** Path under /public. Null -> branded placeholder frame. */
  image: string | null;
}[] = [
  {
    id: "ig1",
    url: "https://instagram.com/brotherbox.id", // TODO: link post asli
    caption: "Skin fade dengan transisi tiga tingkat",
    image: "/images/instagram/ig-01.jpg",
  },
  {
    id: "ig2",
    url: "https://instagram.com/brotherbox.id", // TODO: link post asli
    caption: "Classic side part, rapi sampai minggu ketiga",
    image: "/images/instagram/ig-02.jpg",
  },
  {
    id: "ig3",
    url: "https://instagram.com/brotherbox.id", // TODO: link post asli
    caption: "Beard sculpt + hot towel shave",
    image: "/images/instagram/ig-03.jpg",
  },
  {
    id: "ig4",
    url: "https://instagram.com/brotherbox.id", // TODO: link post asli
    caption: "Textured crop untuk rambut bergelombang",
    image: "/images/instagram/ig-04.jpg",
  },
];

/* ---------------------------------------------------------------- pricing -- */

/** Format an integer thousand-rupiah value: 45 -> "Rp45.000". */
export const formatPrice = (thousands: number): string =>
  `Rp${(thousands * 1000).toLocaleString("id-ID")}`;

/** Non-string placeholders the TODO scan cannot see, because their values
 *  must stay valid (a phone number, a price). Surfaced by `npm run selfcheck`.
 *  Remove an entry only when the real value is in. */
export const OPEN_FLAGS = [
  "SITE.waPusat — nomor WhatsApp pusat masih contoh (6281234567890). WAJIB diganti sebelum publish, kalau tidak pesanan masuk ke orang lain.",
  "SITE.url — canonical/OG masih pakai brotherbox.id, belum dikonfirmasi.",
  "BRANCHES[*].whatsapp — semua null, jadi booking jatuh ke nomor pusat. Isi per cabang kalau mau tiap cabang punya antrean sendiri.",
  "BRANCHES[*].hours — jam buka masih asumsi (10:00–21:00 / 10:00–22:00). Belum ada konfirmasi per cabang.",
  "BRANCHES[*].address — alamat lengkap belum ada, jadi kartu lokasi dan peta masih belum final.",
  "BRANCHES[*].geo — lat/lng kosong; structured data geo akan dihilangkan sampai diisi.",
  "BRANCHES[*].image — belum ada foto cabang asli. Komponen menampilkan frame placeholder, bukan stok foto.",
  "SERVICES[*].price — semua harga masih dummy (PRICES_ARE_PLACEHOLDER = true).",
  "CUT_STYLES[*].image — belum ada foto potongan asli.",
  "CREW[*].name & image — nama dan foto barber belum ada.",
  "REVIEWS — masih sampel, bukan ulasan pelanggan asli. Jangan scrape Google.",
  "INSTAGRAM_POSTS — link dan caption masih placeholder.",
];

/** All placeholder strings still open, for the pre-launch check. */
export const openPlaceholders = (): string[] => {
  const found: string[] = [...OPEN_FLAGS];
  const walk = (value: unknown, path: string) => {
    if (typeof value === "string") {
      if (isTodo(value)) found.push(`${path}: ${value}`);
      return;
    }
    if (Array.isArray(value)) {
      value.forEach((v, i) => walk(v, `${path}[${i}]`));
      return;
    }
    if (value && typeof value === "object") {
      for (const [k, v] of Object.entries(value)) walk(v, `${path}.${k}`);
    }
  };
  walk(SITE, "SITE");
  walk(BRANCHES, "BRANCHES");
  walk(CREW, "CREW");
  walk(REVIEWS, "REVIEWS");
  walk(INSTAGRAM_POSTS, "INSTAGRAM_POSTS");
  return found;
};
