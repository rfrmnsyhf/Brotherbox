"use client";

/* ==========================================================================
   §12 — KNOW YOUR CUT
   Four questions -> ranked style recommendations -> prefilled booking.
   Built as a real flow (not decorative): the ranking logic lives in
   lib/utils.ts and is covered by lib/selfcheck.ts.

   Accessibility: native radio groups inside <fieldset>/<legend>, a live
   region for the result, and a Reset that is a real button. Answers are held
   in one object so "back" is just an index change — no history needed.
   ========================================================================== */
import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ArrowLeft, ArrowUpRight, RotateCcw } from "lucide-react";
import { BRANCHES, CUT_STYLES } from "@/lib/data";
import { bookingLink, recommendStyles, type QuizAnswers } from "@/lib/utils";
import { Reveal } from "../reveal";
import { Container, SectionLabel, SectionTitle } from "../ui";

type Option<V extends string> = { value: V; label: string; hint: string };

const QUESTIONS = [
  {
    key: "face" as const,
    title: "Bentuk wajah kamu paling dekat ke mana?",
    help: "Lihat garis rahang di cermin, rambut disingkirkan dulu.",
    options: [
      { value: "oval", label: "Oval", hint: "Panjang dan lebar hampir seimbang, rahang membulat." },
      { value: "round", label: "Bulat", hint: "Pipi penuh, panjang dan lebar mirip." },
      { value: "square", label: "Persegi", hint: "Rahang tegas, dahi dan pipi sejajar." },
      { value: "long", label: "Panjang", hint: "Dahi ke dagu lebih panjang dari lebar." },
      { value: "heart", label: "Hati", hint: "Dahi lebar, dagu menyempit." },
    ] as Option<QuizAnswers["face"]>[],
  },
  {
    key: "hair" as const,
    title: "Rambut kamu jenisnya apa?",
    help: "Perhatikan setelah rambut kering tanpa produk.",
    options: [
      { value: "lurus", label: "Lurus", hint: "Jatuh rata, sedikit volume." },
      { value: "bergelombang", label: "Bergelombang", hint: "Ada lekukan, gampang dibentuk." },
      { value: "keriting", label: "Keriting", hint: "Volume tebal, tekstur jelas." },
      { value: "tipis", label: "Tipis / menipis", hint: "Mudah kelihatan kulit kepala." },
    ] as Option<QuizAnswers["hair"]>[],
  },
  {
    key: "lifestyle" as const,
    title: "Hari-hari kamu paling sering buat apa?",
    help: "Ini menentukan seberapa formal potongan yang pas.",
    options: [
      { value: "profesional", label: "Kerja kantor", hint: "Perlu rapi dan formal tiap hari." },
      { value: "santai", label: "Santai", hint: "Kasual, tidak banyak aturan." },
      { value: "sporty", label: "Aktif / olahraga", hint: "Sering berkeringat, butuh praktis." },
      { value: "kreatif", label: "Kreatif", hint: "Bebas ekspresi, suka tampil beda." },
    ] as Option<QuizAnswers["lifestyle"]>[],
  },
  {
    key: "effort" as const,
    title: "Seberapa rajin kamu mau styling?",
    help: "Jujur saja — potongan bagus yang tidak dirawat jadi tidak bagus.",
    options: [
      { value: "low", label: "Hampir nol", hint: "Bangun tidur langsung berangkat." },
      { value: "medium", label: "Sedikit", hint: "Mau sisir dan produk sebentar." },
      { value: "high", label: "Rutin", hint: "Siap styling tiap hari." },
    ] as Option<QuizAnswers["effort"]>[],
  },
] as const;

export const KnowYourCut = () => {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Partial<QuizAnswers>>({});
  const [done, setDone] = useState(false);

  const results = useMemo(() => {
    if (!done) return [];
    if (!answers.face || !answers.hair || !answers.lifestyle || !answers.effort) {
      return [];
    }
    return recommendStyles(CUT_STYLES, answers as QuizAnswers, 3);
  }, [done, answers]);

  const question = QUESTIONS[step];
  const total = QUESTIONS.length;
  const progress = done ? total : step;
  const canAdvance = answers[question.key] !== undefined;

  const choose = (value: string) => {
    setAnswers((prev) => ({ ...prev, [question.key]: value }));
  };

  const next = () => {
    if (step + 1 >= total) setDone(true);
    else setStep((s) => s + 1);
  };

  const reset = () => {
    setAnswers({});
    setStep(0);
    setDone(false);
  };

  const note = results.length
    ? `saya dapat rekomendasi ${results[0].style.name}`
    : undefined;

  return (
    <section
      id="know-your-cut"
      className="on-bone scroll-mt-24 py-20 sm:py-28"
    >
      <Container>
        <Reveal>
          <SectionLabel>Know Your Cut</SectionLabel>
          <SectionTitle className="text-carbon">
            Empat pertanyaan, satu potongan yang pas
          </SectionTitle>
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-concrete-deep">
            Jawab empat hal di bawah dan kami urutkan gaya yang paling cocok
            untuk bentuk wajah, jenis rambut, kebiasaan, dan seberapa rajin kamu
            mau merawatnya.
          </p>
        </Reveal>

        <Reveal delay={80}>
          <div className="mt-10 overflow-hidden rounded-xl border border-carbon/10 bg-white/60">
            {/* Progress is text, not just a bar, so it is announced. */}
            <div className="flex items-center justify-between gap-4 border-b border-carbon/10 px-6 py-4">
              <p className="label text-carbon" aria-live="polite">
                {done ? "Hasil" : `Pertanyaan ${step + 1} dari ${total}`}
              </p>
              <div
                className="flex-1 max-w-[10rem] overflow-hidden rounded-full bg-carbon/10"
                role="progressbar"
                aria-valuemin={0}
                aria-valuemax={total}
                aria-valuenow={progress}
                aria-label="Progres kuis"
              >
                <div
                  className="h-1.5 bg-signal transition-[width] duration-500"
                  style={{ width: `${(progress / total) * 100}%` }}
                />
              </div>
            </div>

            <AnimatePresence mode="wait" initial={false}>
              {!done ? (
                <motion.div
                  key={`q-${step}`}
                  initial={{ opacity: 0, x: 32 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -32 }}
                  transition={{ type: "spring", stiffness: 260, damping: 28 }}
                  className="px-6 py-8"
                >
                <fieldset>
                  <legend className="font-display text-xl leading-tight font-extrabold text-carbon uppercase sm:text-2xl">
                    {question.title}
                  </legend>
                  <p className="mt-2 text-sm text-concrete-deep">{question.help}</p>

                  <div className="mt-6 grid gap-3 sm:grid-cols-2">
                    {question.options.map((opt) => {
                      const checked = answers[question.key] === opt.value;
                      return (
                        <label
                          key={opt.value}
                          className={`flex cursor-pointer gap-3 rounded-lg border p-4 transition-colors ${
                            checked
                              ? "border-signal-deep bg-signal/10"
                              : "border-carbon/15 hover:border-carbon/30"
                          }`}
                        >
                          <input
                            type="radio"
                            name={question.key}
                            value={opt.value}
                            checked={checked}
                            onChange={() => choose(opt.value)}
                            className="mt-0.5 size-4 shrink-0 accent-[#c4341a]"
                          />
                          <span>
                            <span className="block text-sm font-semibold text-carbon">
                              {opt.label}
                            </span>
                            <span className="mt-0.5 block text-xs leading-relaxed text-concrete-deep">
                              {opt.hint}
                            </span>
                          </span>
                        </label>
                      );
                    })}
                  </div>
                </fieldset>

                <div className="mt-8 flex items-center justify-between gap-3">
                  <button
                    type="button"
                    onClick={() => setStep((s) => Math.max(0, s - 1))}
                    disabled={step === 0}
                    className="label inline-flex items-center gap-2 rounded-md px-4 py-3 text-carbon transition-colors hover:bg-carbon/5 disabled:opacity-40"
                  >
                    <ArrowLeft className="size-4" aria-hidden />
                    Kembali
                  </button>
                  <button
                    type="button"
                    onClick={next}
                    disabled={!canAdvance}
                    className="label inline-flex items-center gap-2 rounded-md bg-carbon px-6 py-3 text-bone transition-transform hover:-translate-y-0.5 disabled:translate-y-0 disabled:opacity-40"
                  >
                    {step + 1 >= total ? "Lihat hasil" : "Lanjut"}
                    <ArrowUpRight className="size-4" aria-hidden />
                  </button>
                </div>
                </motion.div>
              ) : (
                <motion.div
                  key="results"
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ type: "spring", stiffness: 200, damping: 26 }}
                  className="px-6 py-8"
                  aria-live="polite"
                >
                  <h3 className="font-display text-xl font-extrabold text-carbon uppercase">
                    Rekomendasi kamu
                  </h3>
                  <p className="mt-2 text-sm text-concrete-deep">
                    Diurutkan dari yang paling cocok. Tunjukkan ini ke barber
                    kamu.
                  </p>

                  <ol className="mt-6 space-y-4">
                    {results.map(({ style }, i) => (
                      <motion.li
                        key={style.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{
                          type: "spring",
                          stiffness: 260,
                          damping: 24,
                          delay: i * 0.12,
                        }}
                        className="flex flex-col gap-3 rounded-lg border border-carbon/15 p-5 sm:flex-row sm:items-center sm:justify-between"
                      >
                        <div className="max-w-xl">
                          <p className="label text-signal-deep">
                            {i === 0 ? "Paling cocok" : `Pilihan ${i + 1}`}
                          </p>
                          <h4 className="font-display mt-1 text-lg font-extrabold text-carbon uppercase">
                            {style.name}
                          </h4>
                          <p className="mt-1.5 text-sm leading-relaxed text-concrete-deep">
                            {style.reason}
                          </p>
                        </div>
                        <a
                          href={bookingLink(BRANCHES[0], style.name)}
                          data-booking
                          data-service={style.name}
                          data-note={`dari Know Your Cut: ${note}`}
                          className="label inline-flex shrink-0 items-center justify-center gap-2 rounded-md bg-carbon px-5 py-3 text-bone"
                        >
                          Booking gaya ini
                          <ArrowUpRight className="size-3.5" aria-hidden />
                        </a>
                      </motion.li>
                    ))}
                  </ol>

                  {results.length === 0 ? (
                    <p className="mt-6 text-sm text-concrete-deep">
                      Jawaban belum lengkap. Ulangi kuis untuk melihat hasil.
                    </p>
                  ) : null}

                  <button
                    type="button"
                    onClick={reset}
                    className="label mt-8 inline-flex items-center gap-2 rounded-md border border-carbon/20 px-5 py-3 text-carbon transition-colors hover:bg-carbon/5"
                  >
                    <RotateCcw className="size-4" aria-hidden />
                    Ulangi kuis
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </Reveal>
      </Container>
    </section>
  );
};
