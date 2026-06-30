import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { SiteLayout, SectionHeader } from "@/components/site-layout";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About · TEDxOrileIganmu" },
      { name: "description", content: "TEDxOrileIganmu is organised by Ekanem Michael — technology enthusiast, community builder, and founder of HENOSIS. 6 March 2027, Surulere, Lagos." },
      { property: "og:title", content: "About · TEDxOrileIganmu" },
      { property: "og:description", content: "A small room. A long echo. Curated in Lagos by Ekanem Michael." },
    ],
  }),
  component: AboutPage,
});

const ease = [0.22, 1, 0.36, 1] as const;

function AboutPage() {
  return (
    <SiteLayout>
      <SectionHeader
        kicker="About"
        title={<>What this <span className="font-serif italic font-normal">is.</span></>}
        lede="Nigerian ideas deserve a global stage. Not borrowed ones. Ours."
      />

      {/* Intro */}
      <section className="mx-auto max-w-7xl px-6 md:px-10 pb-24 md:pb-32">
        <div className="grid gap-16 md:grid-cols-2 md:gap-24">
          <motion.blockquote
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.8, ease }}
            className="font-serif italic font-light text-[clamp(1.75rem,3.5vw,2.75rem)] leading-[1.1] tracking-[-0.01em]"
          >
            "A small room.{" "}
            <span className="text-red not-italic font-normal">A long echo.</span>"
          </motion.blockquote>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.8, ease, delay: 0.1 }}
            className="md:pt-4 space-y-6 text-lg md:text-xl leading-relaxed text-ink/80 font-light"
          >
            <p>
              TEDxOrileIganmu is a gathering of thinkers, builders and storytellers from Lagos and beyond, independently organised under a TED license by{" "}
              <span className="text-ink font-normal">Ekanem Michael</span>.
            </p>
            <p>
              Coming 6 March 2027 to The Stable by Union Bank, Surulere. One day. One hundred seats. Ideas that refuse to be polite.
            </p>
          </motion.div>
        </div>

        {/* Event facts */}
        <div className="mt-20 grid gap-px grid-cols-1 sm:grid-cols-3 bg-border border border-border">
          {[
            { k: "When", t: "6 March 2027", s: "One-day programme" },
            { k: "Where", t: "The Stable by Union Bank", s: "Surulere, Lagos" },
            { k: "How", t: "TED-licensed", s: "Independently organised" },
          ].map((it, i) => (
            <motion.div
              key={it.k}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.6, ease, delay: i * 0.08 }}
              className="bg-paper p-8 md:p-10 relative"
            >
              <div className="absolute top-0 left-0 right-0 h-px bg-red" />
              <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground mb-8">{it.k}</p>
              <h3 className="font-display text-2xl md:text-3xl tracking-[-0.01em] font-medium leading-tight">{it.t}</h3>
              <p className="mt-3 text-sm text-muted-foreground">{it.s}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Organiser profile */}
      <section className="bg-ink text-white py-24 md:py-32 relative overflow-hidden">
        <div className="absolute top-0 left-0 h-px w-32 md:w-48 bg-red" />
        {/* subtle grid texture */}
        <div
          className="absolute inset-0 pointer-events-none opacity-[0.025]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />
        <div className="relative mx-auto max-w-7xl px-6 md:px-10">
          <div className="flex items-center gap-3 text-[11px] uppercase tracking-[0.2em] text-white/50 mb-12">
            <span className="h-px w-8 bg-red shrink-0" />
            <span>The Organiser</span>
          </div>

          <div className="grid gap-12 md:grid-cols-[1fr_1.5fr] md:gap-20 lg:gap-28 items-start">
            {/* Photo */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.8, ease }}
              className="relative"
            >
              <div className="aspect-[3/4] relative overflow-hidden bg-white/5">
                {/* Placeholder shown when photo is absent */}
                <div className="absolute inset-0 flex flex-col items-center justify-center"
                  style={{ backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.03) 1px, transparent 1px)", backgroundSize: "28px 28px" }}
                >
                  <span className="font-display font-semibold text-[7rem] leading-none text-white/8 select-none">EM</span>
                </div>
                <img
                  src="/ekanem.jpg"
                  alt="Ekanem Michael"
                  className="absolute inset-0 w-full h-full object-cover object-top grayscale"
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).style.display = "none";
                  }}
                />
                {/* Name overlay at bottom */}
                <div className="absolute inset-0 bg-gradient-to-t from-ink/90 via-ink/20 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <p className="font-serif italic text-2xl text-white">Ekanem Michael</p>
                  <p className="mt-1 text-[10px] uppercase tracking-[0.2em] text-white/50">Licensee · Curator</p>
                </div>
              </div>
              {/* corner accent */}
              <div className="absolute top-0 right-0 h-12 w-px bg-red" />
              <div className="absolute top-0 right-0 w-12 h-px bg-red" />
            </motion.div>

            {/* Bio */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.8, ease, delay: 0.15 }}
            >
              <h2 className="font-display text-[clamp(1.75rem,4vw,3.25rem)] leading-[1.05] tracking-[-0.02em] font-medium">
                Curated by{" "}
                <span className="font-serif italic font-normal">Ekanem Michael.</span>
              </h2>

              <div className="mt-8 space-y-5 text-base md:text-lg leading-relaxed text-white/75 font-light">
                <p>
                  Ekanem Michael is a Nigerian technology enthusiast, community builder, and social impact advocate passionate about leveraging innovation to solve real-world problems.
                </p>
                <p>
                  He is the founder of{" "}
                  <span className="text-white font-normal">HENOSIS</span>, a youth-driven nonprofit focused on education, digital inclusion, and community development. His work spans artificial intelligence, fintech innovation, STEM education, and content creation.
                </p>
                <p>
                  As organiser of TEDxOrileIganmu, his brief to every speaker is the same:{" "}
                  <span className="font-serif italic text-white">
                    say the thing you have been quietly thinking for years.
                  </span>{" "}
                  No press release voice. No borrowed frameworks. Nigerian thought, on its own terms.
                </p>
                <p>
                  He champions the belief that{" "}
                  <span className="text-white font-normal">greatness can emerge from any community</span>{" "}
                  when people are given access to opportunities, knowledge, and the right support.
                </p>
              </div>

              {/* Tags */}
              <div className="mt-10 flex flex-wrap gap-2">
                {["Technology", "Community Building", "Social Impact", "AI & Fintech", "STEM Education", "Content Creation"].map((tag) => (
                  <span
                    key={tag}
                    className="border border-white/15 px-3 py-1.5 text-[10px] uppercase tracking-[0.15em] text-white/50"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              <Link
                to="/speakers"
                className="mt-12 inline-flex items-center gap-3 text-xs uppercase tracking-[0.2em] border-b border-red pb-1 hover:text-red transition-colors"
              >
                See the speaker lineup →
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Mission statement */}
      <section className="bg-paper border-t border-border py-20 md:py-32">
        <div className="mx-auto max-w-5xl px-6 md:px-10 text-center">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.9, ease }}
            className="font-serif italic font-light text-[clamp(1.5rem,3.5vw,2.75rem)] leading-[1.15] tracking-[-0.01em] text-ink/80"
          >
            "He champions the belief that greatness can emerge from any community when people are given{" "}
            <span className="text-red not-italic font-normal">access to opportunities, knowledge, and the right support.</span>"
          </motion.p>
        </div>
      </section>

      {/* CTA row */}
      <section className="border-t border-border bg-paper">
        <div className="mx-auto max-w-7xl px-6 md:px-10 py-16 md:py-20">
          <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
            {[
              { to: "/speakers", label: "See the speakers", desc: "Who's on the stage." },
              { to: "/tickets", label: "Get a ticket", desc: "100 seats. Three tiers." },
              { to: "/volunteer", label: "Join the crew", desc: "12 roles. Apply now." },
            ].map((c) => (
              <Link
                key={c.to}
                to={c.to}
                className="group flex items-center justify-between border border-border px-6 py-5 hover:border-ink transition-colors"
              >
                <div>
                  <p className="text-[10px] uppercase tracking-[0.15em] text-muted-foreground mb-1">{c.desc}</p>
                  <p className="font-display font-medium tracking-[-0.01em] group-hover:text-red transition-colors">{c.label}</p>
                </div>
                <span className="text-muted-foreground group-hover:text-red group-hover:translate-x-1 transition-all duration-300">→</span>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}
