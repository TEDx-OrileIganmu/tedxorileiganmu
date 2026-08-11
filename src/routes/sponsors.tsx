import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { SiteLayout, SectionHeader } from "@/components/site-layout";

export const Route = createFileRoute("/sponsors")({
  head: () => ({
    meta: [
      { title: "Partner With Us · TEDxOrileIganmu" },
      { name: "description", content: "Sponsor TEDxOrileIganmu 2027. Reach Lagos's most curious minds. Title, Gold, Silver, and Community partnership tiers available." },
      { property: "og:title", content: "Partner With Us · TEDxOrileIganmu" },
      { property: "og:description", content: "Put your brand in the room where ideas happen. 6 March 2027, Surulere, Lagos." },
    ],
  }),
  component: SponsorsPage,
});

const ease = [0.22, 1, 0.36, 1] as const;

const STATS = [
  { value: "100", label: "Curated attendees", note: "No walk-ins. Every seat is intentional." },
  { value: "1", label: "Day of full attention", note: "No distractions. No competing events." },
  { value: "5×", label: "Digital reach multiplier", note: "Every attendee has a social presence." },
  { value: "TED", label: "Global brand association", note: "Independently licensed by TED." },
];

type SponsorTier = {
  id: string;
  name: string;
  price: number;
  tag: string;
  featured?: boolean;
  perks: string[];
  seats: string;
};

const TIERS: SponsorTier[] = [
  {
    id: "title",
    name: "Title Partner",
    price: 1000000,
    tag: "Presenting sponsor",
    featured: true,
    seats: "4 VIP tickets",
    perks: [
      "Co-branded event name recognition",
      "Logo on stage backdrop, website hero, programme cover",
      "60-second brand moment played at the event",
      "Named acknowledgement at opening & closing",
      "10 Instagram posts + dedicated story series",
      "Post-event email blast to all 100 attendees",
      "First right of renewal for TEDxOrileIganmu 2028",
    ],
  },
  {
    id: "gold",
    name: "Gold Partner",
    price: 500000,
    tag: "Premium visibility",
    seats: "2 Standard tickets",
    perks: [
      "Logo on website sponsors section",
      "Logo in printed programme",
      "Named mention in opening remarks",
      "5 Instagram posts across event coverage",
      "Feature in post-event recap email",
    ],
  },
  {
    id: "silver",
    name: "Silver Partner",
    price: 200000,
    tag: "Brand presence",
    seats: "1 Regular ticket",
    perks: [
      "Logo in printed programme",
      "3 Instagram mentions during event week",
      "Digital mention in post-event recap",
    ],
  },
  {
    id: "community",
    name: "Community Partner",
    price: 50000,
    tag: "Community support",
    seats: "—",
    perks: [
      "Name listed in printed programme",
      "1 Instagram shoutout",
      "Community partner digital badge",
    ],
  },
];

const STEPS = [
  { n: "01", title: "Reach out", body: "Email us with your company name and the tier you're interested in. We'll respond within 48 hours." },
  { n: "02", title: "Get the deck", body: "We send you the full sponsorship deck — deliverables, timelines, design specs, and payment details." },
  { n: "03", title: "Confirm & pay", body: "Sign the agreement, complete payment via Paystack or bank transfer. You're officially a partner." },
  { n: "04", title: "We handle visibility", body: "From logo placement to social posts, our team executes every deliverable on schedule." },
];

const CONTACT_HREF =
  "mailto:tedxorileiganmu@gmail.com?subject=Sponsorship%20Enquiry%20%E2%80%94%20TEDxOrileIganmu%202027&body=Hello%2C%0A%0AI%E2%80%99m%20interested%20in%20partnering%20with%20TEDxOrileIganmu%202027.%0A%0ACompany%20name%3A%20%0ATier%20of%20interest%3A%20%0AContact%20person%3A%20%0APhone%20number%3A%20%0A%0ALooking%20forward%20to%20discussing%20this.";

function SponsorsPage() {
  return (
    <SiteLayout>
      <SectionHeader
        kicker="Partnership"
        title={<>Put your brand in the <span className="font-serif italic font-normal text-red">room.</span></>}
        lede="One day. One hundred of Lagos's most curious minds. Your brand, in the conversation."
      />

      {/* Stats */}
      <section className="bg-paper border-b border-border">
        <div className="mx-auto max-w-7xl px-6 md:px-10 py-14 md:py-20">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-border">
            {STATS.map(({ value, label, note }, i) => (
              <motion.div
                key={label}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, ease, delay: i * 0.07 }}
                className="bg-paper px-6 md:px-10 py-10 md:py-12"
              >
                <p className="font-display text-4xl md:text-5xl tracking-[-0.04em] font-medium text-ink">{value}</p>
                <p className="mt-2 text-[11px] uppercase tracking-[0.2em] text-ink/70 font-medium">{label}</p>
                <p className="mt-3 text-[11px] text-muted-foreground leading-relaxed">{note}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Tiers */}
      <section className="bg-ink text-white">
        <div className="mx-auto max-w-7xl px-6 md:px-10 py-16 md:py-24">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, ease }}
            className="flex items-center gap-3 text-[10px] uppercase tracking-[0.3em] text-red mb-12"
          >
            <span className="h-px w-8 bg-red" />
            <span>Partnership tiers</span>
          </motion.div>

          <div className="grid gap-6 md:gap-8 md:grid-cols-2 xl:grid-cols-4">
            {TIERS.map((t, i) => (
              <motion.div
                key={t.id}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.6, ease, delay: i * 0.08 }}
                className={`relative flex flex-col border ${t.featured ? "border-red bg-paper text-ink" : "border-white/12 bg-white/4"}`}
              >
                <div className={`absolute top-0 left-0 right-0 h-[3px] ${t.featured ? "bg-red" : "bg-white/20"}`} />
                {t.featured && (
                  <span className="absolute top-4 right-4 text-[8px] uppercase tracking-[0.3em] text-red">Top Tier</span>
                )}
                <div className={`p-7 md:p-8 border-b ${t.featured ? "border-border" : "border-white/10"}`}>
                  <p className={`text-[9px] uppercase tracking-[0.3em] mb-5 ${t.featured ? "text-muted-foreground" : "text-white/40"}`}>{t.tag}</p>
                  <h3 className={`font-display text-2xl tracking-[-0.01em] font-medium mb-6 ${t.featured ? "text-ink" : "text-white"}`}>{t.name}</h3>
                  <div className="flex items-baseline gap-1.5">
                    <span className={`font-serif text-base ${t.featured ? "text-muted-foreground" : "text-white/50"}`}>₦</span>
                    <span className={`font-display text-4xl tracking-[-0.03em] font-medium ${t.featured ? "text-ink" : "text-white"}`}>
                      {(t.price / 1000).toFixed(0)}k
                    </span>
                    {t.price === 1000000 && <span className={`font-serif text-base ${t.featured ? "text-muted-foreground" : "text-white/50"}`}> (₦1M)</span>}
                  </div>
                  <p className={`mt-2 text-[9px] uppercase tracking-[0.2em] ${t.featured ? "text-muted-foreground" : "text-white/35"}`}>
                    {t.seats} included
                  </p>
                </div>
                <ul className={`p-7 md:p-8 flex-1 space-y-3 text-[12px] leading-relaxed ${t.featured ? "text-ink/80" : "text-white/65"}`}>
                  {t.perks.map((p) => (
                    <li key={p} className="flex gap-2.5 items-start">
                      <span className="text-red shrink-0 mt-[1px]">✓</span>
                      <span>{p}</span>
                    </li>
                  ))}
                </ul>
                <div className={`p-6 md:p-7 border-t ${t.featured ? "border-border" : "border-white/10"}`}>
                  <a
                    href={CONTACT_HREF}
                    className={`block w-full text-center py-3.5 text-[9px] uppercase tracking-[0.3em] transition-colors ${
                      t.featured
                        ? "bg-red text-white hover:bg-ink"
                        : "border border-white/25 text-white hover:border-white hover:bg-white/8"
                    }`}
                  >
                    Enquire →
                  </a>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="bg-paper border-b border-border">
        <div className="mx-auto max-w-7xl px-6 md:px-10 py-16 md:py-24">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, ease }}
            className="flex items-center gap-3 text-[10px] uppercase tracking-[0.3em] text-red mb-12"
          >
            <span className="h-px w-8 bg-red" />
            <span>How it works</span>
          </motion.div>
          <div className="grid gap-8 md:grid-cols-4">
            {STEPS.map(({ n, title, body }, i) => (
              <motion.div
                key={n}
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, ease, delay: i * 0.09 }}
              >
                <p className="text-red text-[10px] tracking-[0.15em] font-semibold mb-3">{n}</p>
                <p className="text-[14px] font-semibold mb-2 leading-snug">{title}</p>
                <p className="text-[12px] text-muted-foreground leading-relaxed">{body}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-ink text-white">
        <div className="mx-auto max-w-7xl px-6 md:px-10 py-20 md:py-28 flex flex-col md:flex-row md:items-end justify-between gap-10">
          <div>
            <p className="text-[10px] uppercase tracking-[0.3em] text-white/30 mb-6">Ready to partner?</p>
            <h2 className="font-display font-medium tracking-[-0.04em] leading-[0.9] text-[clamp(2rem,5vw,4rem)] text-white max-w-lg">
              Let's put your brand<br />
              <span className="font-serif italic font-normal text-red">in the conversation.</span>
            </h2>
            <p className="mt-6 text-[13px] text-white/45 leading-relaxed max-w-md">
              Sponsorships are limited. We work with partners whose values align with ideas, curiosity, and community. Email us and we'll respond within 48 hours.
            </p>
          </div>
          <div className="flex flex-col gap-4 shrink-0">
            <a
              href={CONTACT_HREF}
              className="group relative inline-flex items-center justify-center bg-red text-white px-10 py-5 text-[10px] uppercase tracking-[0.25em] overflow-hidden"
            >
              <span className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]" />
              <span className="relative">Email Us to Partner →</span>
            </a>
            <p className="text-[10px] text-white/25 text-center tracking-[0.1em]">
              tedxorileiganmu@gmail.com
            </p>
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}
