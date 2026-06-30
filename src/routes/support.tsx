import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, type ReactNode } from "react";
import { motion } from "framer-motion";
import { SiteLayout, SectionHeader } from "@/components/site-layout";
import { supabase } from "@/integrations/supabase/client";
import { initializePayment } from "@/lib/paystack";

export const Route = createFileRoute("/support")({
  head: () => ({
    meta: [
      { title: "Support · TEDxOrileIganmu" },
      { name: "description", content: "Volunteer, partner, or donate to TEDxOrileIganmu. Help us bring Nigerian ideas to the world." },
      { property: "og:title", content: "Support · TEDxOrileIganmu" },
      { property: "og:description", content: "Volunteer, partner, or donate. Be part of the room." },
    ],
  }),
  component: SupportPage,
});

const ease = [0.22, 1, 0.36, 1] as const;

function SupportPage() {
  return (
    <SiteLayout>
      <SectionHeader
        kicker="Support"
        title={<>Be part of the <span className="font-serif italic font-normal text-red">room.</span></>}
        lede="TEDxOrileIganmu runs on intention, generosity, and hands. Whether you give time, money, or reach, you make the room possible."
      />

      {/* Volunteer */}
      <section id="volunteer" className="border-t border-border">
        <div className="mx-auto max-w-7xl px-6 md:px-10 py-24 md:py-32">
          <motion.div
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, ease }}
            className="grid gap-12 md:grid-cols-2 md:gap-16 items-center"
          >
            <div>
              <div className="flex items-center gap-3 text-[11px] uppercase tracking-[0.25em] text-muted-foreground mb-6">
                <span className="h-px w-6 bg-red" /><span>Volunteer</span>
              </div>
              <h2 className="font-display font-medium text-3xl md:text-5xl tracking-[-0.02em] leading-[1.02] mb-6">
                Give us your <span className="font-serif italic">hands.</span>
              </h2>
              <p className="font-serif italic text-lg md:text-xl text-ink/70 leading-relaxed max-w-md mb-8">
                We are assembling a small crew. No experience required, just presence, care, and showing up. Pick where you fit.
              </p>
            </div>
            <div>
              <Link
                to="/volunteer"
                className="group relative inline-flex items-center justify-center bg-red text-white px-10 py-5 text-xs uppercase tracking-[0.25em] overflow-hidden w-full md:w-auto"
              >
                <span className="absolute inset-0 bg-ink translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]" />
                <span className="relative">Apply to Volunteer →</span>
              </Link>
              <p className="mt-4 text-sm text-muted-foreground">12 roles · one day · 6 March 2027</p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Partner */}
      <Section id="partner" kicker="Partner" heading="Amplify the idea." dark={false} reverse
        lede="Brand partners, media houses, and community organisations. Align your name with one of the most intimate idea stages in Lagos."
        sideContent={
          <ul className="space-y-3 text-sm text-ink/70">
            {[
              "Dedicated partner seat allocation (VIP + Standard)",
              "Post-event footage and photography credit",
              "Curator-led partnership report and reach metrics",
            ].map((b) => (
              <li key={b} className="flex gap-3"><span className="text-red">◆</span><span>{b}</span></li>
            ))}
          </ul>
        }
      >
        <PartnerForm />
      </Section>

      {/* Donate */}
      <section id="donate" className="border-t border-border bg-ink text-white">
        <div className="mx-auto max-w-7xl px-6 md:px-10 py-24 md:py-32">
          <div className="grid gap-12 md:grid-cols-2 md:gap-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
              transition={{ duration: 0.6, ease }}
            >
              <div className="flex items-center gap-3 text-[11px] uppercase tracking-[0.25em] text-white/40 mb-6">
                <span className="h-px w-6 bg-red" /><span>Donate</span>
              </div>
              <h2 className="font-display font-medium text-3xl md:text-5xl tracking-[-0.02em] leading-[1.02] mb-6">
                Keep the lights <span className="font-serif italic">on.</span>
              </h2>
              <p className="font-serif italic text-lg md:text-xl text-white/60 leading-relaxed max-w-md mb-8">
                Every naira goes toward venue, production, speaker travel, and subsidised seats for attendees who need them.
              </p>
              <div className="space-y-3 text-sm text-white/80">
                <p className="text-[10px] uppercase tracking-[0.3em] text-white/40 mb-3">How to give</p>
                <p className="text-white/60 leading-relaxed">Fill out the form and pay securely via Paystack. You will be redirected to Paystack and returned here automatically.</p>
              </div>
            </motion.div>
            <DonateForm />
          </div>
        </div>
      </section>

      {/* Contact */}
      <section className="border-t border-border">
        <div className="mx-auto max-w-7xl px-6 md:px-10 py-16 md:py-24">
          <p className="text-[11px] uppercase tracking-[0.25em] text-muted-foreground mb-8">Reach us directly</p>
          <div className="grid gap-8 sm:grid-cols-3">
            <ContactCard label="Email" href="mailto:tedxorileiganmu@gmail.com" value="tedxorileiganmu@gmail.com" />
            <ContactCard label="Phone" href="tel:+2348172386902" value="+234 817 238 6902" />
            <ContactCard label="Instagram" href="https://instagram.com/tedxorileiganmu" value="@tedxorileiganmu" />
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}

function Section({
  id, kicker, heading, lede, children, sideContent, reverse,
}: { id: string; kicker: string; heading: string; lede: string; children: ReactNode; sideContent?: ReactNode; reverse?: boolean; dark?: boolean }) {
  return (
    <section id={id} className="border-t border-border">
      <div className="mx-auto max-w-7xl px-6 md:px-10 py-24 md:py-32">
        <div className={`grid gap-12 md:grid-cols-2 md:gap-16 ${reverse ? "md:[&>*:first-child]:order-2" : ""}`}>
          <motion.div
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, ease }}
          >
            <div className="flex items-center gap-3 text-[11px] uppercase tracking-[0.25em] text-muted-foreground mb-6">
              <span className="h-px w-6 bg-red" /><span>{kicker}</span>
            </div>
            <h2 className="font-display font-medium text-3xl md:text-5xl tracking-[-0.02em] leading-[1.02] mb-6">
              {heading.split(" ").slice(0, -1).join(" ")} <span className="font-serif italic">{heading.split(" ").slice(-1)}</span>
            </h2>
            <p className="font-serif italic text-lg md:text-xl text-ink/70 leading-relaxed max-w-md mb-8">{lede}</p>
            {sideContent}
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, ease, delay: 0.1 }}
          >
            {children}
          </motion.div>
        </div>
      </div>
    </section>
  );
}

/* ---- Partner ---- */
function PartnerForm() {
  const [state, setState] = useState<"idle" | "submitting" | "done" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [form, setForm] = useState({ organisation: "", contact_name: "", email: "", phone: "", tier: "", note: "" });
  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setState("submitting");
    const { error } = await supabase.from("partner_inquiries").insert({
      organisation: form.organisation, contact_name: form.contact_name, email: form.email,
      phone: form.phone || null, tier: form.tier, note: form.note || null,
    });
    if (error) { setErrorMsg(error.message); setState("error"); return; }
    setState("done");
  };
  if (state === "done") return <Success name={form.contact_name} text="Our partnerships lead will reply within 48 hours with a proposal deck." />;
  return (
    <form onSubmit={submit} className="space-y-5">
      <Field label="Organisation Name"><Input value={form.organisation} onChange={(v) => setForm({ ...form, organisation: v })} required /></Field>
      <Field label="Contact Name"><Input value={form.contact_name} onChange={(v) => setForm({ ...form, contact_name: v })} required /></Field>
      <Field label="Email"><Input type="email" value={form.email} onChange={(v) => setForm({ ...form, email: v })} required /></Field>
      <Field label="Phone (optional)"><Input value={form.phone} onChange={(v) => setForm({ ...form, phone: v })} /></Field>
      <Field label="Partnership Interest">
        <select required value={form.tier} onChange={(e) => setForm({ ...form, tier: e.target.value })}
          className="w-full bg-paper border-b border-ink/25 py-3 focus:outline-none focus:border-red text-lg text-ink appearance-none">
          <option value="">Choose a tier</option>
          <option>Title Sponsor</option><option>Co-Sponsor</option><option>In-Kind Partner</option>
          <option>Media Partner</option><option>Community Partner</option>
        </select>
      </Field>
      <Field label="Note (optional)"><Textarea value={form.note} onChange={(v) => setForm({ ...form, note: v })} placeholder="What does your organisation hope to gain from this?" /></Field>
      {state === "error" && <p className="text-sm text-red">{errorMsg}</p>}
      <Submit busy={state === "submitting"} label="Partner With Us →" busyLabel="Sending…" />
    </form>
  );
}

/* ---- Donate ---- */
type DonateFlow = "idle" | "saving" | "error";

function DonateForm() {
  const DONATION_TIERS = [
    { amount: 5000, label: "Supporter", desc: "One subsidised attendee seat" },
    { amount: 15000, label: "Contributor", desc: "A speaker's local travel" },
    { amount: 50000, label: "Patron", desc: "Stage design for a session" },
  ];
  const [flow, setFlow] = useState<DonateFlow>("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [form, setForm] = useState({ donor_name: "", email: "", phone: "", amount: 5000, tier: "Supporter", message: "" });

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFlow("saving");
    const reference = `TXOI-DON-${Date.now().toString(36).toUpperCase()}`;
    try {
      const callbackUrl = `${window.location.origin}/payment-callback`;
      const { authorization_url } = await initializePayment({
        data: { email: form.email, amount: form.amount, reference, tier: form.tier, name: form.donor_name, callbackUrl },
      });
      sessionStorage.setItem(reference, JSON.stringify({
        type: "donation",
        donor_name: form.donor_name,
        email: form.email,
        phone: form.phone,
        amount: form.amount,
        tier: form.tier,
        message: form.message,
        reference,
      }));
      window.location.href = authorization_url;
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : "Could not start payment. Please try again.");
      setFlow("error");
    }
  };

  return (
    <form onSubmit={submit} className="space-y-5">
      <div className="grid grid-cols-3 gap-2">
        {DONATION_TIERS.map((t) => (
          <button type="button" key={t.amount}
            onClick={() => setForm({ ...form, amount: t.amount, tier: t.label })}
            className={`p-4 text-left border transition-colors ${form.amount === t.amount ? "border-red bg-white/10" : "border-white/15 hover:border-white/40"}`}>
            <p className="font-display text-xl text-white">₦{t.amount.toLocaleString()}</p>
            <p className="text-[9px] uppercase tracking-[0.25em] text-white/40 mt-1">{t.label}</p>
            <p className="text-xs text-white/60 mt-2 leading-snug hidden md:block">{t.desc}</p>
          </button>
        ))}
      </div>
      <DarkField label="Or enter a custom amount (₦)">
        <input type="number" min={500} value={form.amount}
          onChange={(e) => setForm({ ...form, amount: Math.max(500, Number(e.target.value) || 500), tier: "Custom" })}
          className="w-full bg-transparent border-b border-white/25 py-3 focus:outline-none focus:border-red text-lg text-white" />
      </DarkField>
      <DarkField label="Your Name"><input required value={form.donor_name} onChange={(e) => setForm({ ...form, donor_name: e.target.value })}
        className="w-full bg-transparent border-b border-white/25 py-3 focus:outline-none focus:border-red text-lg text-white" /></DarkField>
      <DarkField label="Email"><input required type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })}
        className="w-full bg-transparent border-b border-white/25 py-3 focus:outline-none focus:border-red text-lg text-white" /></DarkField>
      <DarkField label="Phone (optional)"><input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })}
        className="w-full bg-transparent border-b border-white/25 py-3 focus:outline-none focus:border-red text-lg text-white" /></DarkField>
      <DarkField label="Message (optional)"><textarea rows={2} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })}
        className="w-full bg-transparent border-b border-white/25 py-3 focus:outline-none focus:border-red text-base text-white resize-none" /></DarkField>
      {flow === "error" && <p className="text-sm text-red">{errorMsg}</p>}
      <button type="submit" disabled={flow === "saving"}
        className="w-full bg-red text-white py-5 text-xs uppercase tracking-[0.3em] hover:bg-white hover:text-ink transition-colors disabled:opacity-50">
        {flow === "saving" ? "Redirecting to Paystack…" : `Donate ₦${form.amount.toLocaleString()} →`}
      </button>
    </form>
  );
}

/* ---- Atoms ---- */
function Field({ label, children }: { label: string; children: ReactNode }) {
  return <label className="block"><span className="block text-[10px] uppercase tracking-[0.3em] text-muted-foreground mb-2">{label}</span>{children}</label>;
}
function DarkField({ label, children }: { label: string; children: ReactNode }) {
  return <label className="block"><span className="block text-[10px] uppercase tracking-[0.3em] text-white/40 mb-2">{label}</span>{children}</label>;
}
function Input({ value, onChange, type = "text", required, placeholder }: { value: string; onChange: (v: string) => void; type?: string; required?: boolean; placeholder?: string }) {
  return <input type={type} required={required} value={value} placeholder={placeholder} onChange={(e) => onChange(e.target.value)}
    className="w-full bg-transparent border-b border-ink/25 py-3 focus:outline-none focus:border-red text-lg text-ink" />;
}
function Textarea({ value, onChange, placeholder }: { value: string; onChange: (v: string) => void; placeholder?: string }) {
  return <textarea rows={3} value={value} placeholder={placeholder} onChange={(e) => onChange(e.target.value)}
    className="w-full bg-transparent border-b border-ink/25 py-3 focus:outline-none focus:border-red text-base text-ink resize-none" />;
}
function Submit({ busy, label, busyLabel }: { busy: boolean; label: string; busyLabel: string }) {
  return <button type="submit" disabled={busy} className="w-full bg-red text-white py-5 text-xs uppercase tracking-[0.3em] hover:bg-ink transition-colors disabled:opacity-50">{busy ? busyLabel : label}</button>;
}
function Success({ name, text }: { name: string; text: string }) {
  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="border border-border p-10 bg-muted">
      <p className="font-serif italic text-2xl text-ink">Thank you, {name}.</p>
      <p className="mt-3 text-muted-foreground text-sm">{text}</p>
    </motion.div>
  );
}
function ContactCard({ label, href, value }: { label: string; href: string; value: string }) {
  return (
    <a href={href} className="block group">
      <p className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground mb-2">{label}</p>
      <p className="font-display text-lg md:text-xl tracking-[-0.01em] group-hover:text-red transition-colors">{value}</p>
    </a>
  );
}
