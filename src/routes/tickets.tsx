import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { motion } from "framer-motion";
import { SiteLayout, SectionHeader } from "@/components/site-layout";
import { initializePayment } from "@/lib/paystack";

export const Route = createFileRoute("/tickets")({
  head: () => ({
    meta: [
      { title: "Tickets · TEDxOrileIganmu" },
      { name: "description", content: "Regular ₦3,500, Standard ₦5,000, VIP ₦25,000. One day, 100 seats, Surulere, Lagos. 6 March 2027." },
      { property: "og:title", content: "Tickets · TEDxOrileIganmu" },
      { property: "og:description", content: "Three tiers. One day. One hundred seats. Beyond Boundaries." },
    ],
  }),
  component: TicketsPage,
});

type Tier = {
  id: "regular" | "standard" | "vip";
  name: string;
  price: number;
  tag: string;
  perks: { label: string; included: boolean }[];
  featured?: boolean;
};

const TIERS: Tier[] = [
  {
    id: "regular", name: "Regular", price: 3500, tag: "General Admission",
    perks: [
      { label: "Full-day access", included: true },
      { label: "All talks & sessions", included: true },
      { label: "Open-floor seating", included: true },
      { label: "Printed programme", included: true },
      { label: "Speaker reception", included: false },
      { label: "Reserved seating", included: false },
    ],
  },
  {
    id: "standard", name: "Standard", price: 5000, tag: "Reserved Seating", featured: true,
    perks: [
      { label: "Everything in Regular", included: true },
      { label: "Reserved mid-room seat", included: true },
      { label: "Light refreshments", included: true },
      { label: "Printed programme", included: true },
      { label: "Speaker reception", included: false },
    ],
  },
  {
    id: "vip", name: "VIP", price: 25000, tag: "Front Row & Reception", featured: false,
    perks: [
      { label: "Everything in Standard", included: true },
      { label: "Front-row reserved seat", included: true },
      { label: "Full lunch & dinner", included: true },
      { label: "Speaker & curator reception", included: true },
      { label: "Signed programme · priority entry", included: true },
    ],
  },
];

const ease = [0.22, 1, 0.36, 1] as const;

function TicketsPage() {
  const [selected, setSelected] = useState<Tier | null>(null);

  return (
    <SiteLayout>
      <SectionHeader
        kicker="Tickets"
        title={<>A seat, <span className="font-serif italic font-normal">a price,</span> a promise.</>}
        lede="All tickets are in Nigerian Naira (₦). Limited to 100 seats. Payment is processed securely via Paystack."
      />

      <section className="mx-auto max-w-7xl px-6 md:px-10 pb-24 md:pb-32">
        <div className="grid gap-6 md:gap-8 md:grid-cols-3 max-w-5xl mx-auto">
          {TIERS.map((t, i) => (
            <motion.article
              key={t.id}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.6, ease, delay: i * 0.08 }}
              className={`relative flex flex-col border ${t.featured ? "border-ink bg-ink text-white md:-mt-4 md:mb-4" : "border-border bg-paper text-ink"}`}
            >
              <div className="absolute top-0 left-0 right-0 h-[3px] bg-red" />
              {t.featured && (
                <span className="absolute top-4 right-4 text-[9px] uppercase tracking-[0.3em] text-red">Most Chosen</span>
              )}
              <div className={`p-8 md:p-10 border-b ${t.featured ? "border-white/15" : "border-border"}`}>
                <p className={`text-[10px] uppercase tracking-[0.3em] ${t.featured ? "text-white/50" : "text-muted-foreground"}`}>{t.tag}</p>
                <h3 className="font-display text-3xl md:text-4xl tracking-[-0.01em] font-medium mt-5">{t.name}</h3>
                <div className="mt-6 flex items-baseline gap-2">
                  <span className={`font-serif text-xl ${t.featured ? "text-white/60" : "text-muted-foreground"}`}>₦</span>
                  <span className="font-display text-5xl md:text-6xl tracking-[-0.03em] font-medium">{t.price.toLocaleString()}</span>
                </div>
                <p className={`mt-3 text-[10px] uppercase tracking-[0.3em] ${t.featured ? "text-white/40" : "text-muted-foreground"}`}>Per person · One-day pass</p>
              </div>
              <ul className={`p-8 md:p-10 space-y-4 text-sm flex-1 ${t.featured ? "text-white/85" : "text-ink/85"}`}>
                {t.perks.map((p) => (
                  <li key={p.label} className="flex gap-3 items-start">
                    <span className={`mt-[2px] inline-block w-4 shrink-0 text-center font-display ${p.included ? "text-red" : t.featured ? "text-white/25" : "text-muted-foreground/50"}`}>
                      {p.included ? "✓" : "—"}
                    </span>
                    <span className={!p.included ? (t.featured ? "text-white/35 line-through" : "text-muted-foreground line-through") : ""}>{p.label}</span>
                  </li>
                ))}
              </ul>
              <div className={`p-6 md:p-8 border-t ${t.featured ? "border-white/15" : "border-border"}`}>
                <button
                  onClick={() => setSelected(t)}
                  className={`block w-full text-center py-4 text-[11px] uppercase tracking-[0.3em] transition-colors ${t.featured ? "bg-red text-white hover:bg-white hover:text-ink" : "border border-ink text-ink hover:bg-ink hover:text-white"}`}
                >
                  Reserve Seat →
                </button>
              </div>
            </motion.article>
          ))}
        </div>

        <p className="mt-10 text-xs uppercase tracking-[0.25em] text-muted-foreground text-center">
          Limited to 100 seats · One day only · No re-entry without badge
        </p>
      </section>

      {/* Merch teaser */}
      <section className="bg-ink text-white border-t border-white/8">
        <div className="mx-auto max-w-7xl px-6 md:px-10 py-14 md:py-18 flex flex-col md:flex-row md:items-center justify-between gap-8">
          <div>
            <p className="text-[9px] uppercase tracking-[0.3em] text-red mb-3">Coming Soon</p>
            <h3 className="font-display text-2xl md:text-3xl tracking-[-0.02em] font-medium text-white">
              Official <span className="font-serif italic font-normal">event merch.</span>
            </h3>
            <p className="mt-3 text-[12px] text-white/40 leading-relaxed max-w-sm">
              Limited-run tees, tote bags, and lanyards. Available at the venue and online before the event. Follow us so you don't miss the drop.
            </p>
          </div>
          <a
            href="https://instagram.com/tedxorileiganmu"
            target="_blank"
            rel="noreferrer"
            className="shrink-0 inline-flex items-center gap-2 border border-white/20 text-white px-8 py-4 text-[9px] uppercase tracking-[0.25em] hover:border-white/60 transition-colors"
          >
            Follow @tedxorileiganmu →
          </a>
        </div>
      </section>

      {selected && <TicketDialog tier={selected} onClose={() => setSelected(null)} />}
    </SiteLayout>
  );
}

/* ─── Ticket dialog ─────────────────────────────────────────────────────── */

type FlowState = "idle" | "saving" | "error";

function TicketDialog({ tier, onClose }: { tier: Tier; onClose: () => void }) {
  const [form, setForm] = useState({ full_name: "", email: "", phone: "", quantity: 1 });
  const [flowState, setFlowState] = useState<FlowState>("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFlowState("saving");
    const reference = `TXOI-${tier.id.toUpperCase()}-${Date.now().toString(36).toUpperCase()}`;
    const amount = tier.price * form.quantity;
    try {
      const callbackUrl = `${window.location.origin}/payment-callback`;
      const { authorization_url } = await initializePayment({
        data: { email: form.email, amount, reference, tier: tier.id, name: form.full_name, callbackUrl },
      });
      sessionStorage.setItem(reference, JSON.stringify({
        type: "ticket",
        full_name: form.full_name,
        email: form.email,
        phone: form.phone,
        tier: tier.id,
        tierName: tier.name,
        price: tier.price,
        quantity: form.quantity,
        amount,
        reference,
      }));
      window.location.href = authorization_url;
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : "Could not start payment. Please try again.");
      setFlowState("error");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 z-50 bg-ink/70 backdrop-blur-sm flex items-end md:items-center justify-center p-0 md:p-6"
      onClick={flowState !== "saving" ? onClose : undefined}
    >
      <motion.div
        initial={{ y: 48, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.42, ease: [0.22, 1, 0.36, 1] }}
        onClick={(e) => e.stopPropagation()}
        className="bg-paper w-full max-w-lg max-h-[92vh] overflow-y-auto relative"
      >
        <div className="absolute top-0 left-0 right-0 h-[3px] bg-red" />
        <button
          onClick={onClose}
          disabled={flowState === "saving"}
          className="absolute top-5 right-6 text-[11px] uppercase tracking-[0.3em] text-muted-foreground hover:text-red transition-colors disabled:opacity-40"
        >
          Close
        </button>
        <div className="p-8 md:p-10">
          <form onSubmit={submit} className="space-y-5">
            <div className="flex items-center gap-3 text-[11px] uppercase tracking-[0.25em] text-muted-foreground mb-2">
              <span className="h-px w-8 bg-red" />
              <span>{tier.name} · ₦{tier.price.toLocaleString()}</span>
            </div>
            <h2 className="font-display text-3xl tracking-[-0.02em]">
              Reserve your <span className="font-serif italic font-normal">seat.</span>
            </h2>
            <p className="text-sm text-muted-foreground">
              You will be redirected to Paystack to complete your payment securely.
            </p>

            {flowState === "error" && (
              <div className="flex items-center gap-3 bg-red-50 border border-red-200 px-4 py-3">
                <span className="h-px w-5 bg-red shrink-0" />
                <p className="text-[11px] text-red">{errorMsg}</p>
              </div>
            )}

            <Field label="Full Name">
              <input
                required
                value={form.full_name}
                onChange={(e) => setForm({ ...form, full_name: e.target.value })}
                className="w-full bg-transparent border-b border-ink/25 py-3 focus:outline-none focus:border-red text-lg"
              />
            </Field>
            <Field label="Email">
              <input
                required
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full bg-transparent border-b border-ink/25 py-3 focus:outline-none focus:border-red text-lg"
              />
            </Field>
            <Field label="Phone">
              <input
                required
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                placeholder="+234 …"
                className="w-full bg-transparent border-b border-ink/25 py-3 focus:outline-none focus:border-red text-lg"
              />
            </Field>
            <Field label="Quantity">
              <input
                type="number"
                min={1}
                max={5}
                value={form.quantity}
                onChange={(e) =>
                  setForm({ ...form, quantity: Math.max(1, Math.min(5, Number(e.target.value) || 1)) })
                }
                className="w-full bg-transparent border-b border-ink/25 py-3 focus:outline-none focus:border-red text-lg"
              />
            </Field>

            <div className="flex items-baseline justify-between py-4 border-t border-border">
              <span className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground">Total</span>
              <span className="font-display text-3xl tracking-[-0.02em]">
                ₦{(tier.price * form.quantity).toLocaleString()}
              </span>
            </div>

            <button
              disabled={flowState === "saving"}
              className="w-full bg-red text-white py-5 text-xs uppercase tracking-[0.3em] hover:bg-ink transition-colors disabled:opacity-60"
            >
              {flowState === "saving" ? "Redirecting to Paystack…" : "Pay with Paystack →"}
            </button>
            <p className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground text-center">
              Secured by Paystack · You will be redirected to complete payment
            </p>
          </form>
        </div>
      </motion.div>
    </motion.div>
  );
}

/* ─── Field ─────────────────────────────────────────────────────────────── */

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="block text-[10px] uppercase tracking-[0.3em] text-muted-foreground mb-2">{label}</span>
      {children}
    </label>
  );
}
