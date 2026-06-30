import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { SiteLayout } from "@/components/site-layout";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "TEDxOrileIganmu — From Orile, to the World." },
      { name: "description", content: "An independently TED-licensed event. October 2026, The Stable by Union Bank, Surulere, Lagos. One hundred seats." },
      { property: "og:title", content: "TEDxOrileIganmu — From Orile, to the World." },
      { property: "og:description", content: "October 2026 · Surulere, Lagos. One day. One hundred seats. Nigerian ideas, on their own terms." },
    ],
  }),
  component: HomePage,
});

const ease = [0.22, 1, 0.36, 1] as const;

function HomePage() {
  return (
    <SiteLayout>
      {/* HERO */}
      <section className="relative bg-paper overflow-hidden">
        <div className="mx-auto max-w-7xl px-6 md:px-10 pt-16 md:pt-28 pb-24 md:pb-40">
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease }}
            className="flex items-center gap-3 text-[11px] uppercase tracking-[0.25em] text-muted-foreground mb-10"
          >
            <span className="h-px w-8 bg-red" />
            <span>x · independently organised TED event</span>
          </motion.div>

          <h1 className="font-display font-medium tracking-[-0.03em] leading-[0.92] text-[clamp(2.75rem,9.5vw,8.25rem)] max-w-[14ch]">
            {["Ideas", "Worth", "Spreading."].map((w, i) => (
              <motion.span
                key={w}
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, ease, delay: 0.15 + i * 0.08 }}
                className="block"
              >
                {w}
              </motion.span>
            ))}
            <motion.span
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease, delay: 0.45 }}
              className="block mt-2"
            >
              <span className="font-serif italic font-normal text-ink/80">From Orile,</span>{" "}
              <span className="text-red">to the World.</span>
            </motion.span>
          </h1>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease, delay: 0.7 }}
            className="mt-14 md:mt-20 grid gap-10 md:grid-cols-[1.4fr_1fr] md:gap-16 items-end"
          >
            <p className="font-serif text-xl md:text-2xl text-ink/70 max-w-xl leading-snug">
              October 2026 · The Stable by Union Bank, Surulere, Lagos. One day. A small room. Ideas that refuse to be polite.
            </p>
            <div className="flex flex-col sm:flex-row md:flex-col gap-3">
              <Link to="/tickets" className="group relative inline-flex items-center justify-center bg-red text-white px-8 py-4 text-xs uppercase tracking-[0.25em] overflow-hidden">
                <span className="absolute inset-0 bg-ink translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]" />
                <span className="relative">Reserve a Seat →</span>
              </Link>
              <Link to="/support" className="group relative inline-flex items-center justify-center border border-ink text-ink px-8 py-4 text-xs uppercase tracking-[0.25em] overflow-hidden">
                <span className="absolute inset-0 bg-ink translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]" />
                <span className="relative group-hover:text-white transition-colors">Volunteer · Partner</span>
              </Link>
            </div>
          </motion.div>
        </div>

        {/* Marquee strip */}
        <div className="border-y border-border bg-paper overflow-hidden">
          <motion.div
            animate={{ x: ["0%", "-50%"] }}
            transition={{ duration: 38, repeat: Infinity, ease: "linear" }}
            className="flex whitespace-nowrap py-5 text-[11px] uppercase tracking-[0.3em] text-muted-foreground"
          >
            {Array.from({ length: 2 }).map((_, k) => (
              <div key={k} className="flex shrink-0 gap-12 pr-12">
                {["Vol. 01 · 2026", "Surulere, Lagos", "100 Seats Only", "October 2026", "Independently TED-Licensed", "From Orile, to the World"].map((s, i) => (
                  <span key={`${k}-${i}`} className="flex items-center gap-12"><span className="text-red">◇</span>{s}</span>
                ))}
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Section cards */}
      <section className="bg-ink text-white">
        <div className="mx-auto max-w-7xl px-6 md:px-10 py-20 md:py-32 grid gap-10 md:gap-px md:grid-cols-3 md:bg-white/10">
          {[
            { to: "/about", k: "01 · About", t: "Why this exists.", d: "A Lagos stage for Nigerian ideas told on their own terms." },
            { to: "/speakers", k: "02 · Speakers", t: "Who's in the room.", d: "A small, deliberate cast. Lineup unfolding through the year." },
            { to: "/tickets", k: "03 · Tickets", t: "Three tiers. One day.", d: "Regular, Standard and VIP — limited to one hundred seats." },
          ].map((c, i) => (
            <motion.div
              key={c.to}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.6, ease, delay: i * 0.1 }}
              className="bg-ink md:p-10"
            >
              <Link to={c.to} className="group block md:border-t-0 border-t border-white/15 pt-8 md:pt-0">
                <p className="text-[10px] uppercase tracking-[0.3em] text-white/40 mb-6">{c.k}</p>
                <h2 className="font-display text-2xl md:text-3xl tracking-[-0.01em] font-medium group-hover:text-red transition-colors">{c.t}</h2>
                <p className="mt-4 text-sm text-white/60 leading-relaxed">{c.d}</p>
                <span className="mt-8 inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.3em] text-white/60 group-hover:text-red transition-colors">
                  Read <span className="transition-transform group-hover:translate-x-1">→</span>
                </span>
              </Link>
            </motion.div>
          ))}
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
            className="font-serif italic font-light text-[clamp(2rem,5vw,4rem)] leading-[1.05] tracking-[-0.01em]"
          >
            "Orile Iganmu is small on the map. <span className="text-red not-italic font-normal">The ideas are not.</span>"
          </motion.blockquote>
          <p className="mt-10 text-[11px] uppercase tracking-[0.3em] text-muted-foreground">— Ekanem Michael, Curator</p>
        </div>
      </section>
    </SiteLayout>
  );
}
