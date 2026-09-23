# Brotherbox

Digital storefront untuk Brotherbox Barbershop — 8 cabang di Tanjungpinang & Batam.

Next.js 16 (static export) + React 19 + Tailwind 4. Tanpa backend: booking diteruskan
ke WhatsApp dengan pesan yang sudah terisi.

## Jalankan

```bash
npm install
npm run dev          # http://localhost:3000
npm run build        # hasil statis di out/
npm run selfcheck    # cek logika + daftar placeholder yang belum diisi
```

## Deploy (Cloudflare Pages)

| Setting | Nilai |
|---|---|
| Build command | `npm run build` |
| Output directory | `out` |
| Node version | 20 atau lebih baru |

Repo: `github.com/rfrmnsyhf/Brotherbox`

---

## ⚠️ SEBELUM PUBLISH

Jalankan `npm run selfcheck`. Skrip itu mencetak **semua** placeholder yang masih
terbuka. Yang paling penting:

| # | Yang harus diisi | Kenapa krusial |
|---|---|---|
| 1 | `SITE.waPusat` di `lib/data.ts` | Masih nomor contoh `6281234567890`. Kalau tidak diganti, **semua pesanan masuk ke orang lain.** Nomor cabang yang masih `null` ikut jatuh ke sini. |
| 2 | `SITE.url` | Masih `https://brotherbox.id`. Dipakai untuk canonical, sitemap, dan Open Graph. |
| 3 | Alamat 8 cabang | Masih `TODO`. Kartu lokasi dan tombol "Rute" belum bisa dipakai. |
| 4 | Harga layanan | Semua harga masih **dummy**. Banner peringatan di section The Menu otomatis hilang begitu `PRICES_ARE_PLACEHOLDER` di-set `false`. |
| 5 | Jam buka per cabang | Masih asumsi. Badge buka/tutup dihitung dari nilai ini. |
| 6 | Ulasan pelanggan | Masih sampel. **Jangan** scrape Google — minta izin pelanggan dulu. |
| 7 | Foto asli | Belum ada. Komponen menampilkan frame "Foto belum tersedia", bukan stok foto yang dipalsukan jadi cabang. Isi `image` per item dengan path di `public/`. |

## Di mana mengubah konten

Hampir semua isi ada di **`lib/data.ts`** — satu file, tanpa perlu menyentuh komponen:

- `SITE` — nama, domain, WhatsApp pusat, Instagram, email
- `BRANCHES` — 8 cabang: alamat, WA sendiri, jam, hari tutup, koordinat, foto
- `SERVICES` — 8 layanan: harga (ribuan rupiah), durasi, deskripsi
- `CUT_STYLES` — 8 gaya potongan + tag filter + pemetaan kuis
- `CREW`, `REVIEWS`, `INSTAGRAM_POSTS`

Nilai yang diawali `TODO` dianggap placeholder dan dilaporkan oleh `selfcheck`.

## Struktur

```
app/
  layout.tsx              root layout, metadata, font
  page.tsx                halaman utama (menyusun semua section)
  globals.css             design token + keyframes
  sitemap.ts, robots.ts   SEO statis
  branches/[slug]/page.tsx  halaman per cabang (generateStaticParams)
components/
  ui.tsx                  primitives: Container, Section, Pill, PlaceholderFrame
  reveal.tsx              scroll reveal (IntersectionObserver, tanpa library)
  open-badge.tsx          badge buka/tutup, dihitung real-time pakai WIB
  booking-dialog.tsx      <dialog> native + delegated trigger
  chrome.tsx              header + footer
  mobile-cta.tsx          floating CTA mobile
  sections/               hero, branches, menu, gallery, know-your-cut, people, location
lib/
  data.ts                 SEMUA konten
  utils.ts                logika murni: WA link, jam WIB, ranking kuis, kontras WCAG
  schema.ts               JSON-LD (Organization, WebSite, HairSalon per cabang)
  selfcheck.ts            `npm run selfcheck`
```

## Keputusan desain

**Bahasa.** Headline dan judul section pakai Inggris (`COME IN. GET SHARP.`,
`THE MENU`). Semua yang fungsional — deskripsi layanan, pesan WhatsApp, status
buka/tutup, teks tombol — pakai Indonesia. Audiens lokal paham, brand tetap
terasa premium.

**Palet.** Carbon / Bone / Concrete / Signal Orange.

`signal` (`#FF4D24`) **gagal** kontras AA di atas Bone (2.86:1), jadi teks di
latar terang memakai `signal-deep` (`#C4341A`, 4.71:1). Aturan ini ditegakkan
otomatis: `.on-bone .text-signal` di-arahkan ulang ke varian deep, dan
`lib/selfcheck.ts` memverifikasi semua pasangan warna. Jangan ubah hex di
`globals.css` tanpa menjalankan `npm run selfcheck`.

**Tanpa library animasi.** Scroll reveal pakai `IntersectionObserver` + CSS
transition. `motion`/Framer Motion tidak dipakai karena satu efek itu bisa
dicapai tanpa menambah dependensi. Kalau nanti butuh spring physics atau
scroll-linked progress, baru pertimbangkan.

**Tanpa shadcn/Radix.** Booking modal pakai `<dialog>` native (focus trap, Esc,
backdrop inert sudah bawaan browser). Menu mobile pakai `<details>`.

**Progressive enhancement.** Semua tombol booking adalah `<a href="https://wa.me/...">`
yang di-render server. Tanpa JavaScript, situs tetap berfungsi penuh dan
deep-link ke WhatsApp. Dialog hanya peningkatan saat JS aktif.

**Jam operasional.** Badge buka/tutup **wajib** dihitung di client. Static export
akan membekukan status di waktu build dan terus bilang "Buka" setelah tutup.
Karena itu `OpenBadge` adalah client component yang me-render `—` netral dulu,
baru mengisi setelah mount.

**Tanpa backend.** Tidak ada database, tidak ada admin panel. Perubahan konten =
edit `lib/data.ts` lalu push; Cloudflare Pages build ulang otomatis.

## Yang sengaja belum dikerjakan

- **Galeri foto asli** — menunggu upload dari klien.
- **Halaman per-barber** — belum ada data barber yang cukup.
- **Multi-bahasa (i18n)** — belum perlu; pembagian EN/ID sudah cukup.
- **Google Reviews live** — berisiko ToS dan datanya cepat basi. Ulasan statis
  di `REVIEWS` lebih aman.
- **Analytics** — tambahkan kalau klien minta; satu skrip saja cukup.