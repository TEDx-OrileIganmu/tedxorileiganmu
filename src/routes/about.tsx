import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteLayout, SectionHeader } from "@/components/site-layout";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About · TEDxOrileIganmu" },
      { name: "description", content: "A gathering of thinkers, builders and storytellers from Lagos and beyond, curated by Ekanem Michael under a TED license." },
      { property: "og:title", content: "About · TEDxOrileIganmu" },
      { property: "og:description", content: "A small room. A long echo. Curated in Lagos by Ekanem Michael." },
    ],
  }),
  component: AboutPage,
});

function AboutPage() {
  return (
    <SiteLayout>
      <SectionHeader
        kicker="About"
        title={<>What this <span className="font-serif italic font-normal">is.</span></>}
        lede="Nigerian ideas deserve a global stage. Not borrowed ones. Ours."
      />

      <section className="mx-auto max-w-7xl px-6 md:px-10 pb-24 md:pb-32">
        <div className="grid gap-16 md:grid-cols-2 md:gap-24">
          <blockquote className="font-serif italic font-light text-[clamp(1.75rem,3.5vw,2.75rem)] leading-[1.1] tracking-[-0.01em]">
            "A small room. <span className="text-red not-italic font-normal">A long echo.</span>"
          </blockquote>
          <div className="md:pt-4 space-y-6 text-lg md:text-xl leading-relaxed text-ink/80 font-light">
            <p>
              TEDxOrileIganmu is a gathering of thinkers, builders and storytellers from Lagos and beyond, independently organised under a TED license by <span className="text-ink font-normal">Ekanem Michael</span>.
            </p>
            <p>
              Coming October 2026 to The Stable by Union Bank, Surulere. One day. One hundred seats. Ideas that refuse to be polite.
            </p>
          </div>
        </div>

        <div className="mt-20 grid gap-px md:grid-cols-3 bg-border border border-border">
          {[
            { k: "When", t: "October 2026", s: "One-day programme" },
            { k: "Where", t: "The Stable by Union Bank", s: "Surulere, Lagos" },
            { k: "How", t: "TED-licensed", s: "Independently organised" },
          ].map((it) => (
            <div key={it.k} className="bg-paper p-8 md:p-10 relative">
              <div className="absolute top-0 left-0 right-0 h-px bg-red" />
              <p className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground mb-8">{it.k}</p>
              <h3 className="font-display text-2xl md:text-3xl tracking-[-0.01em] font-medium leading-tight">{it.t}</h3>
              <p className="mt-3 text-sm text-muted-foreground">{it.s}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-ink text-white py-24 md:py-32 relative">
        <div className="absolute top-0 left-0 h-px w-32 md:w-48 bg-red" />
        <div className="mx-auto max-w-7xl px-6 md:px-10">
          <div className="flex items-center gap-3 text-[11px] uppercase tracking-[0.25em] text-white/50 mb-12">
            <span className="h-px w-8 bg-red" />
            <span>The Organizer</span>
          </div>
          <div className="grid gap-16 md:grid-cols-[1fr_1.4fr] md:gap-24 items-start">
            <div className="aspect-[4/5] bg-white/5 border border-white/10 relative">
              <div className="absolute inset-0 flex items-end p-6">
                <div>
                  <p className="font-serif italic text-2xl md:text-3xl text-white/90">Ekanem Michael</p>
                  <p className="mt-1 text-[10px] uppercase tracking-[0.3em] text-white/40">Licensee & Curator</p>
                </div>
              </div>
              <div className="absolute top-0 right-0 h-12 w-px bg-red" />
              <div className="absolute top-0 right-0 w-12 h-px bg-red" />
            </div>
            <div>
              <h2 className="font-display text-[clamp(1.75rem,4vw,3rem)] leading-[1.05] tracking-[-0.02em] font-medium">
                Curated by <span className="font-serif italic font-normal">Ekanem Michael.</span>
              </h2>
              <div className="mt-8 space-y-6 text-lg leading-relaxed text-white/75 font-light">
                <p>
                  Ekanem is a writer and producer based in Lagos. He holds the TED license for TEDxOrileIganmu and is assembling the room himself, speaker by speaker, idea by idea.
                </p>
                <p>
                  His brief to every speaker is the same: <span className="font-serif italic text-white">say the thing you have been quietly thinking for years.</span> No press release voice. No borrowed frameworks. Nigerian thought, on its own terms.
                </p>
              </div>
              <Link
                to="/speakers"
                className="mt-10 inline-flex items-center gap-3 text-xs uppercase tracking-[0.25em] border-b border-red pb-1 hover:text-red transition-colors"
              >
                See the lineup →
              </Link>
            </div>
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}
