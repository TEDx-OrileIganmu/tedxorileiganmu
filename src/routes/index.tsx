import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useEffect, useRef } from "react";
import { motion, useScroll, useSpring, useInView } from "framer-motion";
import { SiteLayout } from "@/components/site-layout";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "TEDxOrileIganmu · Beyond Boundaries" },
      { name: "description", content: "Beyond Boundaries · An independently TED-licensed event. 6 March 2027, The Stable by Union Bank, Surulere, Lagos. One hundred seats." },
      { property: "og:title", content: "TEDxOrileIganmu · Beyond Boundaries" },
      { property: "og:description", content: "6 March 2027 · Surulere, Lagos. Ideas that transcend place, perspective, and possibility." },
    ],
  }),
  component: HomePage,
});

const ease = [0.22, 1, 0.36, 1] as const;

/* ─── Animated counter ──────────────────────────────────────────────────── */
function AnimatedCounter({ end, label }: { end: number; label: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  useEffect(() => {
    if (!inView) return;
    let startTime: number;
    let rafId: number;
    const duration = 1200;
    const step = (ts: number) => {
      if (!startTime) startTime = ts;
      const progress = Math.min((ts - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.round(eased * end));
      if (progress < 1) rafId = requestAnimationFrame(step);
    };
    rafId = requestAnimationFrame(step);
    return () => cancelAnimationFrame(rafId);
  }, [inView, end]);

  return (
    <div ref={ref}>
      <p className="font-display font-medium text-3xl md:text-5xl tracking-[-0.03em] text-white tabular-nums">{count}</p>
      <p className="mt-1 text-[10px] uppercase tracking-[0.3em] text-white/40">{label}</p>
    </div>
  );
}

/* ─── Scroll progress ───────────────────────────────────────────────────── */
function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 200, damping: 30 });
  return (
    <motion.div
      className="fixed top-0 left-0 right-0 z-[60] h-[2px] bg-red origin-left pointer-events-none"
      style={{ scaleX }}
    />
  );
}

const STATS = [
  { value: "100", label: "Seats", animate: true, num: 100 },
  { value: "1", label: "Day", animate: false },
  { value: "Mar", label: "2027", animate: false },
  { value: "LOS", label: "Lagos", animate: false },
];

function HomePage() {
  return (
    <SiteLayout>
      <ScrollProgress />

      {/* HERO */}
      <section className="relative bg-paper overflow-hidden">

        {/* Vertical theme text — right edge */}
        <div className="absolute right-4 md:right-8 top-0 bottom-0 hidden lg:flex items-center pointer-events-none select-none z-10">
          <motion.span
            initial={{ opacity: 0, x: 8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1.2, ease, delay: 1.2 }}
            className="text-[9px] uppercase text-ink/15 whitespace-nowrap"
            style={{ writingMode: "vertical-rl", letterSpacing: "0.5em" }}
          >
            Beyond Boundaries · Ideas Worth Spreading · TEDxOrileIganmu
          </motion.span>
        </div>

        <div className="mx-auto max-w-7xl px-6 md:px-10 pt-16 md:pt-28 pb-0">
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease }}
            className="flex flex-col gap-1.5 mb-10"
          >
            <div className="flex items-center gap-3 text-[10px] uppercase tracking-[0.15em] md:tracking-[0.3em] text-red">
              <span className="h-px w-8 bg-red shrink-0" />
              <span>Independently organised · TED licensed</span>
            </div>
            <div className="flex items-center gap-3 text-[10px] uppercase tracking-[0.12em] md:tracking-[0.22em] text-ink/35">
              <span className="h-px w-8 bg-ink/15 shrink-0" />
              <span>Theme · Beyond Boundaries</span>
            </div>
          </motion.div>

          <h1 className="font-display font-medium tracking-[-0.04em] leading-[0.88] text-[clamp(3rem,10.5vw,9.5rem)] max-w-[14ch]">
            {["Ideas", "Worth", "Spreading."].map((w, i) => (
              <motion.span
                key={w}
                initial={{ opacity: 0, y: 32 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, ease, delay: 0.1 + i * 0.07 }}
                className="block"
              >
                {w}
              </motion.span>
            ))}
          </h1>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease, delay: 0.48 }}
            className="mt-14 md:mt-20 grid gap-10 md:grid-cols-[1.5fr_1fr] md:gap-20 items-end pb-20 md:pb-32"
          >
            <div className="space-y-5">
              <p className="font-serif text-xl md:text-2xl text-ink/60 max-w-xl leading-snug">
                6 March 2027 · The Stable by Union Bank, Surulere, Lagos. One day. A small room. Ideas that refuse to be polite.
              </p>
              <p className="text-[11px] uppercase tracking-[0.2em] text-ink/40 font-light italic font-serif">
                Ideas that transcend place, perspective, and possibility.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row md:flex-col gap-3">
              <Link to="/tickets" className="group relative inline-flex items-center justify-center bg-red text-white px-8 py-4 text-xs uppercase tracking-[0.25em] overflow-hidden">
                <span className="absolute inset-0 bg-ink translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]" />
                <span className="relative">Reserve a Seat →</span>
              </Link>
              <Link to="/volunteer" className="group relative inline-flex items-center justify-center border border-ink text-ink px-8 py-4 text-xs uppercase tracking-[0.25em] overflow-hidden">
                <span className="absolute inset-0 bg-ink translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]" />
                <span className="relative group-hover:text-white transition-colors">Volunteer · Partner</span>
              </Link>
            </div>
          </motion.div>
        </div>

        {/* Stats strip */}
        <div className="border-y border-border bg-ink text-white">
          <div className="mx-auto max-w-7xl px-6 md:px-10">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-white/10">
              {STATS.map((s, i) => (
                <motion.div
                  key={s.label}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, ease, delay: 0.7 + i * 0.06 }}
                  className="bg-ink px-5 md:px-10 py-7 md:py-10"
                >
                  {s.animate && s.num ? (
                    <AnimatedCounter end={s.num} label={s.label} />
                  ) : (
                    <>
                      <p className="font-display font-medium text-3xl md:text-5xl tracking-[-0.03em] text-white">{s.value}</p>
                      <p className="mt-1 text-[10px] uppercase tracking-[0.3em] text-white/40">{s.label}</p>
                    </>
                  )}
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* Marquee */}
        <div className="border-b border-border bg-paper overflow-hidden">
          <motion.div
            animate={{ x: ["0%", "-50%"] }}
            transition={{ duration: 42, repeat: Infinity, ease: "linear" }}
            className="flex whitespace-nowrap py-4 text-[10px] uppercase tracking-[0.3em] text-muted-foreground"
          >
            {Array.from({ length: 2 }).map((_, k) => (
              <div key={k} className="flex shrink-0 gap-12 pr-12">
                {["Vol. 01 · 2027", "Surulere, Lagos", "100 Seats Only", "6 March 2027", "Beyond Boundaries", "Ideas Worth Spreading", "From Orile, to the World"].map((s, i) => (
                  <span key={`${k}-${i}`} className="flex items-center gap-12">
                    <span className="text-red">◆</span>{s}
                  </span>
                ))}
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Section cards */}
      <section className="bg-ink text-white">
        <div className="mx-auto max-w-7xl px-6 md:px-10 py-20 md:py-32">
          <div className="grid gap-px md:grid-cols-3 bg-white/10 border border-white/10">
            {[
              { to: "/about", n: "01", t: "Why this exists.", d: "A Lagos stage for Nigerian ideas told on their own terms." },
              { to: "/speakers", n: "02", t: "Who's in the room.", d: "A small, deliberate cast. Lineup unfolding through the year." },
              { to: "/tickets", n: "03", t: "One day. One seat.", d: "₦3,500. Limited to one hundred people. No exceptions." },
            ].map((c, i) => (
              <motion.div
                key={c.to}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.6, ease, delay: i * 0.1 }}
              >
                <Link to={c.to} className="group block bg-ink p-6 sm:p-8 md:p-10 lg:p-12 h-full relative overflow-hidden">
                  <span className="absolute inset-0 bg-white/5 translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]" />
                  <p className="relative text-[10px] uppercase tracking-[0.3em] text-white/30 mb-8">{c.n}</p>
                  <h2 className="relative font-display text-2xl md:text-3xl tracking-[-0.02em] font-medium group-hover:text-red transition-colors duration-300">{c.t}</h2>
                  <p className="relative mt-4 text-sm text-white/50 leading-relaxed">{c.d}</p>
                  <span className="relative mt-10 inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.3em] text-white/40 group-hover:text-red transition-colors duration-300">
                    Explore <span className="transition-transform group-hover:translate-x-1 duration-300">→</span>
                  </span>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pull quote */}
      <section className="bg-paper border-t border-border py-24 md:py-40 relative overflow-hidden">
        {/* Vertical "Beyond Boundaries" decoration */}
        <div className="absolute left-6 md:left-10 top-0 bottom-0 hidden md:flex items-center pointer-events-none select-none">
          <span
            className="text-[9px] uppercase text-ink/8 whitespace-nowrap"
            style={{ writingMode: "vertical-rl", transform: "rotate(180deg)", letterSpacing: "0.5em" }}
          >
            Beyond Boundaries · 6 March 2027 · Surulere, Lagos
          </span>
        </div>

        <div className="mx-auto max-w-5xl px-6 md:px-10 text-center">
          <motion.blockquote
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-120px" }}
            transition={{ duration: 0.9, ease }}
            className="font-serif italic font-light text-[clamp(1.8rem,4.5vw,3.75rem)] leading-[1.08] tracking-[-0.01em]"
          >
            "Orile Iganmu is small on the map.{" "}
            <span className="text-red not-italic font-normal">The ideas are not.</span>"
          </motion.blockquote>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease, delay: 0.3 }}
            className="mt-10 text-[10px] uppercase tracking-[0.3em] text-muted-foreground"
          >
            Ekanem Michael · Curator
          </motion.p>
        </div>
      </section>

      {/* Theme reveal strip */}
      <section className="bg-ink text-white border-t border-white/10 py-16 md:py-20 overflow-hidden">
        <div className="mx-auto max-w-7xl px-6 md:px-10">
          <div className="grid gap-8 md:grid-cols-[1fr_auto] items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.7, ease }}
            >
              <p className="text-[10px] uppercase tracking-[0.3em] text-white/30 mb-4">Theme · 2027</p>
              <h2 className="font-display font-medium text-[clamp(2.5rem,7vw,5.5rem)] tracking-[-0.03em] leading-[0.9]">
                Beyond{" "}
                <span className="font-serif italic font-normal text-red">Boundaries.</span>
              </h2>
              <p className="mt-6 font-serif italic text-lg text-white/50 max-w-lg leading-relaxed">
                Ideas that transcend place, perspective, and possibility.
              </p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.7, ease, delay: 0.15 }}
              className="hidden md:flex items-center"
            >
              <span
                className="text-[10px] uppercase text-white/10 whitespace-nowrap"
                style={{ writingMode: "vertical-rl", letterSpacing: "0.6em" }}
              >
                TEDxOrileIganmu · Vol. 01 · 6 March 2027
              </span>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Volunteer CTA */}
      <section className="bg-red text-white">
        <div className="mx-auto max-w-7xl px-6 md:px-10 py-20 md:py-28">
          <div className="grid gap-8 md:gap-10 grid-cols-1 md:grid-cols-[1fr_auto] items-center">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.6, ease }}
            >
              <p className="text-[10px] uppercase tracking-[0.2em] md:tracking-[0.3em] text-white/60 mb-4">Join the crew</p>
              <h2 className="font-display font-medium text-[clamp(2rem,5vw,4rem)] tracking-[-0.02em] leading-[1.05]">
                Help us build the room.
              </h2>
              <p className="mt-4 font-serif italic text-lg text-white/75 max-w-lg">
                Twelve roles. One day. A chance to be on the inside of something Lagos will remember.
              </p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.6, ease, delay: 0.1 }}
            >
              <Link
                to="/volunteer"
                className="group relative inline-flex items-center justify-center bg-white text-red px-10 py-5 text-xs uppercase tracking-[0.2em] md:tracking-[0.25em] overflow-hidden w-full md:w-auto shrink-0"
              >
                <span className="absolute inset-0 bg-ink translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]" />
                <span className="relative group-hover:text-white transition-colors duration-300">Apply to Volunteer →</span>
              </Link>
            </motion.div>
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}
