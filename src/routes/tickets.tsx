import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { SiteLayout, SectionHeader } from "@/components/site-layout";
import { supabase } from "@/integrations/supabase/client";
import { initializePayment, verifyPayment } from "@/lib/paystack";

export const Route = createFileRoute("/tickets")({
  validateSearch: (search) => ({
    reference: typeof search.reference === "string" ? search.reference : undefined,
    trxref: typeof search.trxref === "string" ? search.trxref : undefined,
  }),
  head: () => ({
    meta: [
      { title: "Tickets · TEDxOrileIganmu" },
      { name: "description", content: "Regular ₦3,500, Standard ₦5,000, VIP ₦25,000. One day, 100 seats, Surulere, Lagos." },
      { property: "og:title", content: "Tickets · TEDxOrileIganmu" },
      { property: "og:description", content: "Three tiers. One day. One hundred seats." },
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
      { label: "Light refreshments", included: false },
      { label: "Speaker reception", included: false },
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
    id: "vip", name: "VIP", price: 25000, tag: "Front Row & Reception",
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
  const { reference } = Route.useSearch();
  const [selected, setSelected] = useState<Tier | null>(null);

  if (reference) {
    return (
      <SiteLayout>
        <PaymentCallback reference={reference} />
      </SiteLayout>
    );
  }

  return (
    <SiteLayout>
      <SectionHeader
        kicker="Tickets"
        title={<>A seat, <span className="font-serif italic font-normal">a price,</span> a promise.</>}
        lede="All tickets are in Nigerian Naira (₦). Limited to 100 seats. Sales open with the speaker reveal."
      />

      <section className="mx-auto max-w-7xl px-6 md:px-10 pb-24 md:pb-32">
        <div className="grid gap-6 md:gap-8 md:grid-cols-3">
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

        <p className="mt-12 text-xs uppercase tracking-[0.25em] text-muted-foreground text-center">
          Limited to 100 seats · One day only · No re-entry without badge
        </p>
      </section>

      {selected && <TicketDialog tier={selected} onClose={() => setSelected(null)} />}
    </SiteLayout>
  );
}

/* ---- Payment callback (Paystack redirect return) ---- */
function PaymentCallback({ reference }: { reference: string }) {
  const navigate = useNavigate();
  const [status, setStatus] = useState<"verifying" | "success" | "failed" | "error">("verifying");
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const result = await verifyPayment({ data: { reference } });
        if (result.status === "success") {
          await supabase.from("ticket_orders").update({ payment_status: "paid" }).eq("payment_reference", reference);
          setStatus("success");
        } else {
          setStatus("failed");
        }
      } catch (err) {
        setErrorMsg(err instanceof Error ? err.message : "Verification failed");
        setStatus("error");
      }
    })();
  }, [reference]);

  if (status === "verifying") {
    return (
      <div className="mx-auto max-w-7xl px-6 md:px-10 pt-32 pb-40 flex items-center gap-3 text-[11px] uppercase tracking-[0.25em] text-muted-foreground">
        <span className="h-px w-8 bg-red animate-pulse" />
        <span>Verifying payment…</span>
      </div>
    );
  }

  if (status === "success") {
    return (
      <div className="mx-auto max-w-7xl px-6 md:px-10 pt-20 md:pt-32 pb-24 md:pb-40">
        <div className="flex items-center gap-3 text-[11px] uppercase tracking-[0.25em] text-muted-foreground mb-10">
          <span className="h-px w-8 bg-red" /><span>Payment confirmed</span>
        </div>
        <motion.h1
          initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease }}
          className="font-display font-medium tracking-[-0.03em] leading-[0.92] text-[clamp(3rem,9vw,7rem)]"
        >
          You're{" "}
          <span className="font-serif italic font-normal">in the room.</span>
        </motion.h1>
        <p className="mt-8 font-serif italic text-xl md:text-2xl text-ink/70 max-w-xl leading-snug">
          Your ticket is confirmed. Check your email for details and entry instructions. We'll see you on 6 March 2027.
        </p>
        <div className="mt-10 border border-border p-4 bg-muted inline-block">
          <p className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground mb-1">Reference</p>
          <p className="font-display tracking-tight">{reference}</p>
        </div>
        <div className="mt-10">
          <button
            onClick={() => navigate({ to: "/" })}
            className="group relative inline-flex items-center justify-center bg-red text-white px-8 py-4 text-xs uppercase tracking-[0.25em] overflow-hidden"
          >
            <span className="absolute inset-0 bg-ink translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]" />
            <span className="relative">Back home →</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-6 md:px-10 pt-20 md:pt-32 pb-24 md:pb-40">
      <div className="flex items-center gap-3 text-[11px] uppercase tracking-[0.25em] text-muted-foreground mb-10">
        <span className="h-px w-8 bg-red" />
        <span>{status === "failed" ? "Payment not completed" : "Payment error"}</span>
      </div>
      <h1 className="font-display font-medium tracking-[-0.03em] leading-[0.92] text-[clamp(2.5rem,7vw,5rem)]">
        {status === "failed" ? "Payment cancelled." : <>Something went <span className="font-serif italic font-normal">sideways.</span></>}
      </h1>
      <p className="mt-6 font-serif italic text-lg text-ink/70 max-w-xl">
        {status === "failed"
          ? "Your payment was not completed. No charge was made."
          : (errorMsg || "We couldn't verify your payment. Email us and we'll sort it out.")}
      </p>
      <div className="mt-10 flex flex-wrap gap-3">
        <button
          onClick={() => navigate({ to: "/tickets" })}
          className="group relative inline-flex items-center justify-center bg-red text-white px-8 py-4 text-xs uppercase tracking-[0.25em] overflow-hidden"
        >
          <span className="absolute inset-0 bg-ink translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]" />
          <span className="relative">Try again →</span>
        </button>
        <a
          href="mailto:tedxorileiganmu@gmail.com"
          className="group relative inline-flex items-center justify-center border border-ink text-ink px-8 py-4 text-xs uppercase tracking-[0.25em] overflow-hidden"
        >
          <span className="absolute inset-0 bg-ink translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]" />
          <span className="relative group-hover:text-white transition-colors">Email us</span>
        </a>
      </div>
    </div>
  );
}

/* ---- Ticket dialog ---- */
function TicketDialog({ tier, onClose }: { tier: Tier; onClose: () => void }) {
  const [form, setForm] = useState({ full_name: "", email: "", phone: "", quantity: 1 });
  const [state, setState] = useState<"idle" | "submitting" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setState("submitting");
    const ref = `TXOI-${tier.id.toUpperCase()}-${Date.now().toString(36).toUpperCase()}`;

    const { error } = await supabase.from("ticket_orders").insert({
      full_name: form.full_name,
      email: form.email,
      phone: form.phone || null,
      tier: tier.id,
      amount_naira: tier.price * form.quantity,
      quantity: form.quantity,
      payment_reference: ref,
      payment_status: "pending",
    });
    if (error) { setErrorMsg(error.message); setState("error"); return; }

    try {
      const { authorization_url, access_code } = await initializePayment({
        data: {
          email: form.email,
          amount: tier.price * form.quantity,
          reference: ref,
          tier: tier.name,
          name: form.full_name,
          callbackUrl: `${window.location.origin}/tickets`,
        },
      });
      await supabase.from("ticket_orders").update({ paystack_access_code: access_code }).eq("payment_reference", ref);
      window.location.href = authorization_url;
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : "Payment setup failed. Please try again.");
      setState("error");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }}
      className="fixed inset-0 z-50 bg-ink/60 backdrop-blur-sm flex items-end md:items-center justify-center p-0 md:p-6"
      onClick={onClose}
    >
      <motion.div
        initial={{ y: 40, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        onClick={(e) => e.stopPropagation()}
        className="bg-paper w-full max-w-lg max-h-[90vh] overflow-y-auto relative"
      >
        <div className="absolute top-0 left-0 right-0 h-[3px] bg-red" />
        <button onClick={onClose} className="absolute top-5 right-6 text-[11px] uppercase tracking-[0.3em] text-muted-foreground hover:text-red">Close</button>

        <div className="p-8 md:p-10">
          <form onSubmit={submit} className="space-y-5">
            <div className="flex items-center gap-3 text-[11px] uppercase tracking-[0.25em] text-muted-foreground mb-2">
              <span className="h-px w-8 bg-red" /><span>{tier.name} · ₦{tier.price.toLocaleString()}</span>
            </div>
            <h2 className="font-display text-3xl tracking-[-0.02em]">Reserve your <span className="font-serif italic">seat.</span></h2>
            <p className="text-sm text-muted-foreground">Pay securely via Paystack. You'll be redirected to complete payment.</p>

            <Field label="Full Name">
              <input required value={form.full_name} onChange={(e) => setForm({ ...form, full_name: e.target.value })}
                className="w-full bg-transparent border-b border-ink/25 py-3 focus:outline-none focus:border-red text-lg" />
            </Field>
            <Field label="Email">
              <input required type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full bg-transparent border-b border-ink/25 py-3 focus:outline-none focus:border-red text-lg" />
            </Field>
            <Field label="Phone">
              <input required value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })}
                className="w-full bg-transparent border-b border-ink/25 py-3 focus:outline-none focus:border-red text-lg" placeholder="+234 ..." />
            </Field>
            <Field label="Quantity">
              <input type="number" min={1} max={5} value={form.quantity}
                onChange={(e) => setForm({ ...form, quantity: Math.max(1, Math.min(5, Number(e.target.value) || 1)) })}
                className="w-full bg-transparent border-b border-ink/25 py-3 focus:outline-none focus:border-red text-lg" />
            </Field>

            <div className="flex items-baseline justify-between py-4 border-t border-border">
              <span className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground">Total</span>
              <span className="font-display text-3xl tracking-[-0.02em]">₦{(tier.price * form.quantity).toLocaleString()}</span>
            </div>

            {state === "error" && <p className="text-sm text-red">{errorMsg}</p>}
            <button disabled={state === "submitting"} className="w-full bg-red text-white py-5 text-xs uppercase tracking-[0.3em] hover:bg-ink transition-colors disabled:opacity-50">
              {state === "submitting" ? "Opening Paystack…" : "Pay with Paystack →"}
            </button>
            <p className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground text-center">
              Secured by Paystack · ₦{(tier.price * form.quantity).toLocaleString()} charged now
            </p>
          </form>
        </div>
      </motion.div>
    </motion.div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="block text-[10px] uppercase tracking-[0.3em] text-muted-foreground mb-2">{label}</span>
      {children}
    </label>
  );
}
