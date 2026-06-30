import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { SiteLayout, SectionHeader } from "@/components/site-layout";
import { supabase } from "@/integrations/supabase/client";
import { verifyPayment, sendTicketEmail } from "@/lib/paystack";

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

declare global {
  interface Window {
    PaystackPop: {
      setup(opts: {
        key: string;
        email: string;
        amount: number;
        ref: string;
        metadata?: object;
        callback: (response: { reference: string }) => void;
        onClose: () => void;
      }): { openIframe(): void };
    };
  }
}

function loadPaystackScript(): Promise<void> {
  return new Promise((resolve, reject) => {
    if (typeof window !== "undefined" && window.PaystackPop) {
      resolve();
      return;
    }
    const existing = document.querySelector('script[src*="paystack"]');
    if (existing) {
      existing.addEventListener("load", () => resolve());
      return;
    }
    const s = document.createElement("script");
    s.src = "https://js.paystack.co/v1/inline.js";
    s.async = true;
    s.onload = () => resolve();
    s.onerror = () => reject(new Error("Failed to load payment system"));
    document.head.appendChild(s);
  });
}

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
  const [selected, setSelected] = useState<Tier | null>(null);

  // Preload Paystack script as soon as the page renders for faster popup
  useEffect(() => {
    loadPaystackScript().catch(() => {});
  }, []);

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

      {selected && <TicketDialog tier={selected} onClose={() => setSelected(null)} />}
    </SiteLayout>
  );
}

/* ─── Types ─────────────────────────────────────────────────────────────── */

type FlowState = "idle" | "saving" | "awaiting" | "verifying" | "success" | "cancelled" | "error";

type SuccessData = {
  name: string;
  email: string;
  tier: string;
  reference: string;
  amount: number;
  quantity: number;
};

/* ─── Ticket dialog ─────────────────────────────────────────────────────── */

function TicketDialog({ tier, onClose }: { tier: Tier; onClose: () => void }) {
  const [form, setForm] = useState({ full_name: "", email: "", phone: "", quantity: 1 });
  const [flowState, setFlowState] = useState<FlowState>("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [successData, setSuccessData] = useState<SuccessData | null>(null);
  const paymentDoneRef = useRef(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!window.PaystackPop) {
      setFlowState("saving");
      try {
        await loadPaystackScript();
      } catch {
        setErrorMsg("Could not load payment system. Check your connection and try again.");
        setFlowState("error");
        return;
      }
    }

    const ref = `TXOI-${tier.id.toUpperCase()}-${Date.now().toString(36).toUpperCase()}`;
    paymentDoneRef.current = false;
    setFlowState("awaiting");

    window.PaystackPop.setup({
      key: import.meta.env.VITE_PAYSTACK_PUBLIC_KEY as string,
      email: form.email,
      amount: tier.price * form.quantity * 100,
      ref,
      metadata: {
        custom_fields: [
          { display_name: "Full Name", variable_name: "full_name", value: form.full_name },
          { display_name: "Ticket Tier", variable_name: "ticket_tier", value: tier.name },
        ],
      },
      callback: async (response: { reference: string }) => {
        paymentDoneRef.current = true;
        setFlowState("verifying");
        try {
          const result = await verifyPayment({ data: { reference: response.reference } });
          if (result.status === "success") {
            await supabase.from("ticket_orders").insert({
              full_name: form.full_name,
              email: form.email,
              phone: form.phone || null,
              tier: tier.id,
              amount_naira: tier.price * form.quantity,
              quantity: form.quantity,
              payment_reference: response.reference,
              payment_status: "paid",
            });

            const sd: SuccessData = {
              name: form.full_name,
              email: form.email,
              tier: tier.name,
              reference: response.reference,
              amount: tier.price * form.quantity,
              quantity: form.quantity,
            };
            setSuccessData(sd);
            setFlowState("success");

            sendTicketEmail({
              data: {
                to: form.email,
                name: form.full_name,
                tier: tier.name,
                reference: response.reference,
                amount: tier.price * form.quantity,
                quantity: form.quantity,
              },
            }).catch(() => {});
          } else {
            setErrorMsg("Your payment was not completed. No charge was made.");
            setFlowState("error");
          }
        } catch (err) {
          setErrorMsg(
            err instanceof Error
              ? err.message
              : "Verification failed. Email tedxorileiganmu@gmail.com with your reference.",
          );
          setFlowState("error");
        }
      },
      onClose: () => {
        if (!paymentDoneRef.current) {
          setFlowState("cancelled");
        }
      },
    }).openIframe();
  };

  const isFormScreen =
    flowState === "idle" || flowState === "saving" || flowState === "cancelled" || flowState === "error";

  const allowBackdropClose = flowState === "idle" || flowState === "cancelled" || flowState === "success";

  // While Paystack popup is open, unmount our overlay entirely so it
  // doesn't sit on top of the Paystack iframe.
  if (flowState === "awaiting") return null;

  // After Paystack closes but before verification completes, show a
  // lightweight full-screen indicator so the screen isn't blank.
  if (flowState === "verifying") {
    return (
      <div className="fixed inset-0 z-50 bg-paper flex flex-col items-center justify-center gap-5">
        <div className="h-px w-16 bg-red animate-pulse" />
        <p className="text-[11px] uppercase tracking-[0.3em] text-muted-foreground">Verifying payment…</p>
        <p className="font-serif italic text-ink/40 text-sm">Confirming with Paystack. Just a moment.</p>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 z-50 bg-ink/70 backdrop-blur-sm flex items-end md:items-center justify-center p-0 md:p-6"
      onClick={() => allowBackdropClose && onClose()}
    >
      <motion.div
        initial={{ y: 48, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.42, ease: [0.22, 1, 0.36, 1] }}
        onClick={(e) => e.stopPropagation()}
        className="bg-paper w-full max-w-lg max-h-[92vh] overflow-y-auto relative"
      >
        <div className="absolute top-0 left-0 right-0 h-[3px] bg-red" />

        <AnimatePresence mode="wait">
          {isFormScreen && (
            <motion.div
              key="form"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.18 }}
            >
              <button
                onClick={onClose}
                className="absolute top-5 right-6 text-[11px] uppercase tracking-[0.3em] text-muted-foreground hover:text-red transition-colors"
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
                    Pay securely via Paystack. The payment window opens right here.
                  </p>

                  {flowState === "cancelled" && (
                    <div className="flex items-center gap-3 bg-amber-50 border border-amber-200 px-4 py-3">
                      <span className="h-px w-5 bg-amber-400 shrink-0" />
                      <p className="text-[11px] text-amber-800">Payment window was closed. Try again whenever you're ready.</p>
                    </div>
                  )}
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
                    className="w-full bg-red text-white py-5 text-xs uppercase tracking-[0.3em] hover:bg-ink transition-colors"
                  >
                    Pay with Paystack →
                  </button>
                  <p className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground text-center">
                    Secured by Paystack · No redirect · Payment opens here
                  </p>
                </form>
              </div>
            </motion.div>
          )}

          {flowState === "success" && successData && (
            <motion.div
              key="success"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            >
              <TicketSuccess data={successData} onClose={onClose} />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
}

/* ─── Success screen ────────────────────────────────────────────────────── */

function TicketSuccess({ data, onClose }: { data: SuccessData; onClose: () => void }) {
  return (
    <div className="p-8 md:p-10">
      {/* Kicker */}
      <div className="flex items-center gap-3 text-[11px] uppercase tracking-[0.25em] text-muted-foreground mb-6">
        <span className="h-px w-8 bg-red" />
        <span>Payment confirmed</span>
      </div>

      {/* Headline */}
      <h2 className="font-display font-medium text-[clamp(2rem,6vw,3rem)] tracking-[-0.02em] leading-[0.95] mb-2">
        You're{" "}
        <span className="font-serif italic font-normal">in the room.</span>
      </h2>
      <p className="font-serif italic text-ink/60 text-base mb-8 leading-snug">
        A confirmation email is on its way to {data.email}.
      </p>

      {/* Ticket summary card */}
      <div className="border border-border mb-8 relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-red" />
        <div className="bg-ink text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-[10px] uppercase tracking-[0.25em] text-white/40">Tier</span>
            <span className="bg-red text-white text-[9px] font-bold tracking-[0.2em] uppercase px-2.5 py-1 ml-2">
              {data.tier}
            </span>
          </div>
          <code className="text-[10px] text-white/30 font-mono tracking-wider">
            {data.reference.slice(0, 16)}…
          </code>
        </div>
        <div className="divide-y divide-border">
          {[
            { label: "Attendee", value: data.name },
            { label: "Seats", value: `${data.quantity} seat${data.quantity > 1 ? "s" : ""}` },
            { label: "Paid", value: `₦${data.amount.toLocaleString()}` },
            { label: "Date", value: "Saturday, 6 March 2027" },
            { label: "Venue", value: "The Stable by Union Bank, Surulere" },
          ].map((r) => (
            <div key={r.label} className="flex items-baseline justify-between px-6 py-3.5">
              <span className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">{r.label}</span>
              <span className="text-sm font-medium text-ink">{r.value}</span>
            </div>
          ))}
        </div>
        <div className="flex items-center gap-3 px-6 py-3 bg-muted border-t border-border">
          <span className="h-px w-5 bg-red shrink-0" />
          <span className="text-[9px] uppercase tracking-[0.2em] text-red">
            Beyond Boundaries · Ideas that transcend place, perspective, and possibility.
          </span>
        </div>
      </div>

      {/* Directions link */}
      <a
        href="https://www.google.com/maps/dir/?api=1&destination=The+Stable+by+Union+Bank+Surulere+Lagos+Nigeria"
        target="_blank" rel="noreferrer"
        className="flex items-center justify-between border border-border px-5 py-4 hover:border-ink transition-colors group"
      >
        <div>
          <p className="text-[9px] uppercase tracking-[0.25em] text-muted-foreground mb-1">Venue</p>
          <p className="text-sm font-medium text-ink">The Stable by Union Bank · Surulere, Lagos</p>
        </div>
        <span className="text-muted-foreground group-hover:text-red group-hover:translate-x-1 transition-all duration-300 text-sm">→</span>
      </a>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-3">
        <button
          onClick={() => downloadTicket(data)}
          className="group relative flex-1 inline-flex items-center justify-center bg-red text-white py-4 text-[11px] uppercase tracking-[0.3em] overflow-hidden"
        >
          <span className="absolute inset-0 bg-ink translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]" />
          <span className="relative">Download Ticket →</span>
        </button>
        <button
          onClick={onClose}
          className="group relative inline-flex items-center justify-center border border-ink text-ink py-4 px-6 text-[11px] uppercase tracking-[0.3em] overflow-hidden"
        >
          <span className="absolute inset-0 bg-ink translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]" />
          <span className="relative group-hover:text-white transition-colors">Done</span>
        </button>
      </div>
      <p className="mt-4 text-[10px] uppercase tracking-[0.2em] text-muted-foreground text-center">
        Save as PDF from the print dialogue
      </p>
    </div>
  );
}

/* ─── Ticket download ───────────────────────────────────────────────────── */

function downloadTicket(data: SuccessData) {
  const origin = typeof window !== "undefined" ? window.location.origin : "";
  const html = buildTicketHTML(data, origin);
  const win = window.open("", "_blank", "width=920,height=480,scrollbars=yes,resizable=yes");
  if (!win) {
    alert("Please allow pop-ups to download your ticket.");
    return;
  }
  win.document.write(html);
  win.document.close();
}

function buildTicketHTML(data: SuccessData, origin: string): string {
  const logoSrc = `${origin}/logo-white.png`;
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8"/>
<meta name="viewport" content="width=device-width,initial-scale=1"/>
<title>TEDxOrileIganmu · ${data.name}</title>
<style>
*{margin:0;padding:0;box-sizing:border-box;}
body{
  background:#1a1a1a;
  min-height:100vh;
  display:flex;
  flex-direction:column;
  align-items:center;
  justify-content:center;
  padding:40px 20px;
  font-family:-apple-system,BlinkMacSystemFont,'Inter','Segoe UI',sans-serif;
  gap:20px;
}
.hint{color:rgba(255,255,255,.3);font-size:10px;letter-spacing:.3em;text-transform:uppercase;text-align:center;}
.ticket{
  width:min(860px,100%);
  background:#111;
  border:1px solid #252525;
  display:flex;
  position:relative;
  overflow:visible;
}
.ticket::before{
  content:'';position:absolute;top:0;left:0;right:0;height:4px;background:#E62B1E;
}
/* perforation hole top */
.ticket::after{
  content:'';
  position:absolute;
  top:-8px;right:179px;
  width:16px;height:16px;
  border-radius:50%;
  background:#1a1a1a;
  border:1px solid #252525;
}
.main{
  flex:1;
  padding:40px 48px;
  display:flex;
  flex-direction:column;
  gap:28px;
  border-right:1px dashed #2a2a2a;
  position:relative;
}
/* perforation hole bottom */
.main::after{
  content:'';
  position:absolute;
  bottom:-8px;right:-8px;
  width:16px;height:16px;
  border-radius:50%;
  background:#1a1a1a;
  border:1px solid #252525;
}
.stub{
  width:180px;
  padding:32px 20px;
  display:flex;
  flex-direction:column;
  align-items:center;
  justify-content:space-between;
  gap:16px;
  text-align:center;
}
/* ── Main sections ── */
.top{display:flex;align-items:flex-start;justify-content:space-between;}
.logo-area{display:flex;align-items:center;gap:10px;}
.logo-img{height:22px;width:auto;object-fit:contain;}
.vol{color:rgba(255,255,255,.2);font-size:9px;letter-spacing:.35em;text-transform:uppercase;}
.attendee-label{color:rgba(255,255,255,.35);font-size:8px;letter-spacing:.35em;text-transform:uppercase;margin-bottom:8px;}
.attendee-name{color:#fff;font-size:clamp(28px,4vw,52px);font-weight:700;letter-spacing:-.025em;line-height:1;}
.info-row{display:flex;gap:36px;flex-wrap:wrap;}
.info-label{color:rgba(255,255,255,.3);font-size:8px;letter-spacing:.3em;text-transform:uppercase;margin-bottom:5px;}
.info-val{color:rgba(255,255,255,.75);font-size:13px;}
.theme-val{color:#E62B1E;}
/* ── Stub ── */
.tier-badge{
  background:#E62B1E;color:#fff;
  font-size:10px;font-weight:700;
  letter-spacing:.25em;text-transform:uppercase;
  padding:7px 0;width:100%;
}
.vertical-text{
  color:rgba(255,255,255,.12);
  font-size:8px;letter-spacing:.3em;text-transform:uppercase;
  writing-mode:vertical-rl;
  transform:rotate(180deg);
  flex:1;
}
.admit{color:rgba(255,255,255,.2);font-size:8px;letter-spacing:.35em;text-transform:uppercase;}
.ref-label{color:rgba(255,255,255,.2);font-size:7px;letter-spacing:.25em;text-transform:uppercase;margin-bottom:3px;}
.ref-code{color:rgba(255,255,255,.4);font-size:9px;font-family:monospace;letter-spacing:.05em;word-break:break-all;}
.not-resale{color:rgba(255,255,255,.12);font-size:7px;letter-spacing:.2em;text-transform:uppercase;margin-top:3px;}
/* Print */
@media print{
  body{background:#111!important;padding:0;-webkit-print-color-adjust:exact;print-color-adjust:exact;display:block;}
  .hint{display:none;}
  .ticket{width:100%;page-break-inside:avoid;}
  @page{size:A4 landscape;margin:15mm;}
}
</style>
</head>
<body>
<p class="hint">Print dialogue will open · Save as PDF to keep your ticket</p>
<div class="ticket">
  <div class="main">
    <div class="top">
      <div class="logo-area">
        <img class="logo-img" src="${logoSrc}" alt="TEDxOrileIganmu" onerror="this.style.display='none';this.insertAdjacentHTML('afterend','<span style=\\'color:#E62B1E;font-size:13px;font-weight:900;letter-spacing:.05em;\\'>TED<span style=\\'opacity:.6\\'>x</span><span style=\\'color:rgba(255,255,255,.5);font-size:11px;letter-spacing:.25em;margin-left:8px;\\'>OrileIganmu</span></span>')"/>
      </div>
      <span class="vol">Vol. 01 · 2027</span>
    </div>
    <div>
      <p class="attendee-label">Attendee</p>
      <p class="attendee-name">${data.name}</p>
    </div>
    <div class="info-row">
      <div>
        <p class="info-label">Date</p>
        <p class="info-val">6 March 2027</p>
      </div>
      <div>
        <p class="info-label">Venue</p>
        <p class="info-val">The Stable by Union Bank</p>
      </div>
      <div>
        <p class="info-label">Location</p>
        <p class="info-val">Surulere, Lagos</p>
      </div>
      <div>
        <p class="info-label">Theme</p>
        <p class="info-val theme-val">Beyond Boundaries</p>
      </div>
    </div>
  </div>
  <div class="stub">
    <span class="tier-badge">${data.tier}</span>
    <span class="vertical-text">Beyond Boundaries · Ideas Worth Spreading · TEDxOrileIganmu</span>
    <p class="admit">Admit One</p>
    <div>
      <p class="ref-label">Ref</p>
      <p class="ref-code">${data.reference}</p>
      <p class="not-resale">Not for resale</p>
    </div>
  </div>
</div>
<script>setTimeout(function(){window.print();},700);</script>
</body>
</html>`;
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
