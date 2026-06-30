import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { SiteLayout } from "@/components/site-layout";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "TEDxOrileIganmu · From Orile, to the World." },
      { name: "description", content: "An independently TED-licensed event. 6 March 2027, The Stable by Union Bank, Surulere, Lagos. One hundred seats." },
      { property: "og:title", content: "TEDxOrileIganmu · From Orile, to the World." },
      { property: "og:description", content: "6 March 2027 · Surulere, Lagos. One day. One hundred seats. Nigerian ideas, on their own terms." },
    ],
  }),
  component: HomePage,
});

const ease = [0.22, 1, 0.36, 1] as const;

const STATS = [
  { value: "100", label: "Seats" },
  { value: "1", label: "Day" },
  { value: "Mar", label: "2027" },
  { value: "LOS", label: "Lagos" },
];

function HomePage() {
  return (
    <SiteLayout>
      {/* HERO */}
      <section className="relative bg-paper overflow-hidden">
        <div className="mx-auto max-w-7xl px-6 md:px-10 pt-16 md:pt-28 pb-0">
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease }}
            className="flex items-center gap-3 text-[10px] uppercase tracking-[0.15em] md:tracking-[0.3em] text-red mb-10"
          >
            <span className="h-px w-8 bg-red shrink-0" />
            <span>Independently organised · TED licensed</span>
          </motion.div>

          <h1 className="font-display font-medium tracking-[-0.04em] leading-[0.88] text-[clamp(3rem,10.5vw,9.5rem)] max-w-[16ch]">
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
            <motion.span
              initial={{ opacity: 0, y: 32 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease, delay: 0.38 }}
              className="block mt-2"
            >
              <span className="font-serif italic font-normal text-ink/70">From Orile,</span>{" "}
              <span className="text-red">to the World.</span>
            </motion.span>
          </h1>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease, delay: 0.55 }}
            className="mt-14 md:mt-20 grid gap-10 md:grid-cols-[1.5fr_1fr] md:gap-20 items-end pb-20 md:pb-32"
          >
            <p className="font-serif text-xl md:text-2xl text-ink/60 max-w-xl leading-snug">
              6 March 2027 · The Stable by Union Bank, Surulere, Lagos. One day. A small room. Ideas that refuse to be polite.
            </p>
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
                  <p className="font-display font-medium text-3xl md:text-5xl tracking-[-0.03em] text-white">{s.value}</p>
                  <p className="mt-1 text-[10px] uppercase tracking-[0.3em] text-white/40">{s.label}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* Marquee */}
        <div className="border-b border-border bg-paper overflow-hidden">
          <motion.div
            animate={{ x: ["0%", "-50%"] }}
            transition={{ duration: 38, repeat: Infinity, ease: "linear" }}
            className="flex whitespace-nowrap py-4 text-[10px] uppercase tracking-[0.3em] text-muted-foreground"
          >
            {Array.from({ length: 2 }).map((_, k) => (
              <div key={k} className="flex shrink-0 gap-12 pr-12">
                {["Vol. 01 · 2027", "Surulere, Lagos", "100 Seats Only", "6 March 2027", "TED Licensed", "From Orile, to the World"].map((s, i) => (
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
              { to: "/tickets", n: "03", t: "Three tiers. One day.", d: "Regular, Standard and VIP. Limited to one hundred seats." },
            ].map((c, i) => (
              <motion.div
                key={c.to}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.6, ease, delay: i * 0.1 }}
              >
                <Link to={c.to} className="group block bg-ink p-6 sm:p-8 md:p-10 lg:p-12 h-full">
                  <p className="text-[10px] uppercase tracking-[0.3em] text-white/30 mb-8">{c.n}</p>
                  <h2 className="font-display text-2xl md:text-3xl tracking-[-0.02em] font-medium group-hover:text-red transition-colors duration-300">{c.t}</h2>
                  <p className="mt-4 text-sm text-white/50 leading-relaxed">{c.d}</p>
                  <span className="mt-10 inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.3em] text-white/40 group-hover:text-red transition-colors duration-300">
                    Explore <span className="transition-transform group-hover:translate-x-1 duration-300">→</span>
                  </span>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pull quote */}
      <section className="bg-paper border-t border-border py-24 md:py-40">
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

      {/* Volunteer CTA */}
      <section className="bg-red text-white">
        <div className="mx-auto max-w-7xl px-6 md:px-10 py-20 md:py-28">
          <div className="grid gap-8 md:gap-10 grid-cols-1 md:grid-cols-[1fr_auto] items-center">
            <div>
              <p className="text-[10px] uppercase tracking-[0.2em] md:tracking-[0.3em] text-white/60 mb-4">Join the crew</p>
              <h2 className="font-display font-medium text-[clamp(2rem,5vw,4rem)] tracking-[-0.02em] leading-[1.05]">
                Help us build the room.
              </h2>
              <p className="mt-4 font-serif italic text-lg text-white/75 max-w-lg">
                Twelve roles. One day. A chance to be on the inside of something Lagos will remember.
              </p>
            </div>
            <Link
              to="/volunteer"
              className="group relative inline-flex items-center justify-center bg-white text-red px-10 py-5 text-xs uppercase tracking-[0.2em] md:tracking-[0.25em] overflow-hidden w-full md:w-auto shrink-0"
            >
              <span className="absolute inset-0 bg-ink translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]" />
              <span className="relative group-hover:text-white transition-colors duration-300">Apply to Volunteer →</span>
            </Link>
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}
