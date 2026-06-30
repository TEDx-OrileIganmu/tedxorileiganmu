import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteLayout, SectionHeader } from "@/components/site-layout";

export const Route = createFileRoute("/speakers")({
  head: () => ({
    meta: [
      { title: "Speakers · TEDxOrileIganmu" },
      { name: "description", content: "A small, deliberate cast of Nigerian thinkers, builders and storytellers. Names announced as the room is set." },
      { property: "og:title", content: "Speakers · TEDxOrileIganmu" },
      { property: "og:description", content: "The lineup, unfolding." },
    ],
  }),
  component: SpeakersPage,
});

function SpeakersPage() {
  const slots = [
    { n: "01", role: "Mental Health · Psychiatry", note: "A clinician who has spent ten years inside Lagos hospitals." },
    { n: "02", role: "Language · Pidgin & Identity", note: "A linguist arguing for Pidgin as a first-class national tongue." },
    { n: "03", role: "Finance · Inclusion", note: "A builder working on credit for the informal economy." },
    { n: "04", role: "Art · Storytelling", note: "A filmmaker reframing what Lagos sounds like on screen." },
    { n: "05", role: "Civic · Public Systems", note: "A policy thinker on what the state owes its citizens." },
  ];
  return (
    <SiteLayout>
      <SectionHeader
        kicker="Speakers"
        title={<>The lineup, <span className="font-serif italic font-normal">unfolding.</span></>}
        lede="We are curating a small, deliberate cast: psychiatrists, linguists, builders, dissenters. Names announced as the room is set."
      />

      <section className="mx-auto max-w-7xl px-6 md:px-10 pb-24 md:pb-32">
        <ol className="divide-y divide-border border-y border-border">
          {slots.map((s) => (
            <li key={s.n} className="grid grid-cols-[auto_1fr_auto] gap-6 md:gap-10 py-6 md:py-8 items-baseline">
              <span className="font-serif italic text-muted-foreground text-lg md:text-xl">{s.n}</span>
              <div className="min-w-0">
                <p className="font-display text-xl md:text-2xl tracking-[-0.01em] font-medium">To be announced</p>
                <p className="mt-1 text-sm text-muted-foreground">{s.note}</p>
              </div>
              <span className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground text-right hidden sm:block">{s.role}</span>
            </li>
          ))}
        </ol>

        <div className="mt-16 flex flex-wrap gap-4">
          <Link to="/support" className="inline-flex items-center justify-center border border-ink text-ink px-8 py-4 text-xs uppercase tracking-[0.25em] hover:bg-ink hover:text-white transition-colors">
            Nominate a speaker →
          </Link>
          <Link to="/tickets" className="inline-flex items-center justify-center bg-red text-white px-8 py-4 text-xs uppercase tracking-[0.25em] hover:bg-ink transition-colors">
            Get a Ticket →
          </Link>
        </div>
      </section>

      <section className="bg-muted py-24 md:py-32 border-t border-border">
        <div className="mx-auto max-w-7xl px-6 md:px-10">
          <p className="text-[11px] uppercase tracking-[0.25em] text-muted-foreground mb-10">Themes in the room</p>
          <div className="grid gap-px md:grid-cols-3 bg-border">
            {[
              { n: "01", title: "Mental health and the silence Nigeria cannot afford.", desc: "On the cost of carrying what we were taught not to name." },
              { n: "02", title: "The language we left behind.", desc: "Nigerian Pidgin as national identity, not a downgrade of English." },
              { n: "03", title: "What financial inclusion really means.", desc: "For the people the system was never designed to see." },
            ].map((t) => (
              <article key={t.n} className="bg-paper p-8 md:p-10 relative">
                <div className="absolute top-0 left-0 h-[2px] w-12 bg-red" />
                <p className="font-serif italic text-muted-foreground text-lg mb-8">{t.n}</p>
                <h3 className="font-display text-xl md:text-2xl tracking-[-0.01em] leading-tight font-medium">{t.title}</h3>
                <p className="mt-4 text-sm text-muted-foreground leading-relaxed">{t.desc}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}
