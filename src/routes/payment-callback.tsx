import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { SiteLayout } from "@/components/site-layout";
import { verifyPayment, sendTicketEmail } from "@/lib/paystack";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/payment-callback")({
  validateSearch: (search) => ({
    reference: String(search.reference ?? ""),
    trxref: String(search.trxref ?? ""),
  }),
  head: () => ({
    meta: [{ title: "Payment · TEDxOrileIganmu" }],
  }),
  component: PaymentCallbackPage,
});

type Status = "verifying" | "success-ticket" | "success-donation" | "success-unknown" | "error";

type TicketData = {
  type: "ticket";
  full_name: string;
  email: string;
  phone: string;
  tier: "regular" | "standard" | "vip";
  tierName: string;
  price: number;
  quantity: number;
  amount: number;
  reference: string;
};

type DonationData = {
  type: "donation";
  donor_name: string;
  email: string;
  phone: string;
  amount: number;
  tier: string;
  message: string;
  reference: string;
};

type PendingData = TicketData | DonationData;

function PaymentCallbackPage() {
  const { reference, trxref } = Route.useSearch();
  const ref = reference || trxref;

  const [status, setStatus] = useState<Status>("verifying");
  const [ticketData, setTicketData] = useState<TicketData | null>(null);
  const [donorName, setDonorName] = useState("");
  const [donationAmount, setDonationAmount] = useState(0);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    if (!ref) {
      setErrorMsg("No payment reference found. If you completed a payment, email us at tedxorileiganmu@gmail.com with your bank statement.");
      setStatus("error");
      return;
    }

    const raw = sessionStorage.getItem(ref);
    const pending: PendingData | null = raw ? (JSON.parse(raw) as PendingData) : null;

    (async () => {
      try {
        const result = await verifyPayment({ data: { reference: ref } });

        if (result.status !== "success") {
          setErrorMsg("Payment was not completed successfully. No charge was made. Please try again.");
          setStatus("error");
          return;
        }

        if (pending?.type === "ticket") {
          await supabase.from("ticket_orders").insert({
            full_name: pending.full_name,
            email: pending.email,
            phone: pending.phone || null,
            tier: pending.tier,
            amount_naira: pending.amount,
            quantity: pending.quantity,
            payment_reference: ref,
            payment_status: "paid",
          });
          sendTicketEmail({
            data: {
              to: pending.email,
              name: pending.full_name,
              tier: pending.tierName,
              reference: ref,
              amount: pending.amount,
              quantity: pending.quantity,
            },
          }).catch(() => {});
          sessionStorage.removeItem(ref);
          setTicketData(pending);
          setStatus("success-ticket");
        } else if (pending?.type === "donation") {
          await supabase.from("donations").insert({
            donor_name: pending.donor_name,
            email: pending.email,
            phone: pending.phone || null,
            amount_naira: pending.amount,
            tier: pending.tier,
            message: pending.message || null,
            payment_reference: ref,
            payment_status: "paid",
          });
          sessionStorage.removeItem(ref);
          setDonorName(pending.donor_name);
          setDonationAmount(pending.amount);
          setStatus("success-donation");
        } else {
          // Payment verified but no session data (cleared storage / different device)
          setStatus("success-unknown");
        }
      } catch (err) {
        setErrorMsg(
          err instanceof Error
            ? err.message
            : `Verification failed. Save reference ${ref} and email tedxorileiganmu@gmail.com`,
        );
        setStatus("error");
      }
    })();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ref]);

  /* ── Verifying overlay ── */
  if (status === "verifying") {
    return (
      <div className="fixed inset-0 bg-paper flex flex-col items-center justify-center gap-5">
        <div className="h-px w-16 bg-red animate-pulse" />
        <p className="text-[11px] uppercase tracking-[0.3em] text-muted-foreground">Verifying payment…</p>
        <p className="font-serif italic text-ink/40 text-sm">Confirming with Paystack. Just a moment.</p>
      </div>
    );
  }

  /* ── Error ── */
  if (status === "error") {
    return (
      <SiteLayout>
        <div className="mx-auto max-w-lg px-6 py-24">
          <div className="flex items-center gap-3 text-[11px] uppercase tracking-[0.25em] text-muted-foreground mb-8">
            <span className="h-px w-8 bg-red" />
            <span>Payment issue</span>
          </div>
          <h1 className="font-display text-3xl tracking-[-0.02em] mb-4">Something went wrong.</h1>
          <p className="text-muted-foreground text-sm leading-relaxed mb-8">{errorMsg}</p>
          <Link
            to="/tickets"
            className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.25em] border-b border-red pb-1 hover:text-red transition-colors"
          >
            Back to Tickets →
          </Link>
        </div>
      </SiteLayout>
    );
  }

  /* ── Donation success ── */
  if (status === "success-donation") {
    return (
      <SiteLayout>
        <div className="mx-auto max-w-lg px-6 py-24 md:py-32">
          <div className="flex items-center gap-3 text-[11px] uppercase tracking-[0.25em] text-muted-foreground mb-8">
            <span className="h-px w-8 bg-red" />
            <span>Donation confirmed</span>
          </div>
          <h1 className="font-display text-[clamp(2rem,6vw,3rem)] tracking-[-0.02em] leading-[0.95] mb-3">
            Thank you, <span className="font-serif italic font-normal">{donorName}.</span>
          </h1>
          <p className="font-serif italic text-ink/60 text-base mb-8 leading-snug">
            Your donation of ₦{donationAmount.toLocaleString()} has been received. Every gift keeps the room alive.
          </p>
          <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground font-mono mb-10">{ref}</p>
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.25em] border-b border-red pb-1 hover:text-red transition-colors"
          >
            Back to Home →
          </Link>
        </div>
      </SiteLayout>
    );
  }

  /* ── Unknown (payment verified, no session data) ── */
  if (status === "success-unknown") {
    return (
      <SiteLayout>
        <div className="mx-auto max-w-lg px-6 py-24 text-center">
          <div className="flex items-center gap-3 text-[11px] uppercase tracking-[0.25em] text-muted-foreground mb-8 justify-center">
            <span className="h-px w-8 bg-red" />
            <span>Payment confirmed</span>
          </div>
          <h1 className="font-display text-4xl tracking-[-0.02em] mb-4">Payment received.</h1>
          <p className="text-muted-foreground text-sm leading-relaxed mb-4">
            Your payment has been confirmed. A confirmation email will follow if your details were recorded. Save this reference for your records.
          </p>
          <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground font-mono mb-8">{ref}</p>
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.25em] border-b border-red pb-1 hover:text-red transition-colors"
          >
            Back to Home →
          </Link>
        </div>
      </SiteLayout>
    );
  }

  /* ── Ticket success ── */
  if (!ticketData) return null;
  return <TicketSuccessPage data={ticketData} ref={ref} />;
}

/* ─── Ticket success screen ─────────────────────────────────────────────── */

function TicketSuccessPage({ data, ref }: { data: TicketData; ref: string }) {
  return (
    <SiteLayout>
      <div className="mx-auto max-w-lg px-6 py-16 md:py-24">
        {/* Kicker */}
        <div className="flex items-center gap-3 text-[11px] uppercase tracking-[0.25em] text-muted-foreground mb-8">
          <span className="h-px w-8 bg-red" />
          <span>Payment confirmed</span>
        </div>

        {/* Headline */}
        <h1 className="font-display font-medium text-[clamp(2rem,6vw,3rem)] tracking-[-0.02em] leading-[0.95] mb-3">
          You're{" "}
          <span className="font-serif italic font-normal">in the room.</span>
        </h1>
        <p className="font-serif italic text-ink/60 text-base mb-10 leading-snug">
          A confirmation email is on its way to {data.email}.
        </p>

        {/* Ticket summary card */}
        <div className="border border-border mb-8 relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-red" />
          <div className="bg-ink text-white px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-[10px] uppercase tracking-[0.25em] text-white/40">Tier</span>
              <span className="bg-red text-white text-[9px] font-bold tracking-[0.2em] uppercase px-2.5 py-1 ml-2">
                {data.tierName}
              </span>
            </div>
            <code className="text-[10px] text-white/30 font-mono tracking-wider">
              {ref.slice(0, 16)}…
            </code>
          </div>
          <div className="divide-y divide-border">
            {[
              { label: "Attendee", value: data.full_name },
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
          target="_blank"
          rel="noreferrer"
          className="flex items-center justify-between border border-border px-5 py-4 hover:border-ink transition-colors group mb-8"
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
            onClick={() => downloadTicket(data, ref)}
            className="group relative flex-1 inline-flex items-center justify-center bg-red text-white py-4 text-[11px] uppercase tracking-[0.3em] overflow-hidden"
          >
            <span className="absolute inset-0 bg-ink translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]" />
            <span className="relative">Download Ticket →</span>
          </button>
          <Link
            to="/"
            className="group relative inline-flex items-center justify-center border border-ink text-ink py-4 px-6 text-[11px] uppercase tracking-[0.3em] overflow-hidden"
          >
            <span className="absolute inset-0 bg-ink translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]" />
            <span className="relative group-hover:text-white transition-colors">Done</span>
          </Link>
        </div>
        <p className="mt-4 text-[10px] uppercase tracking-[0.2em] text-muted-foreground text-center">
          Save as PDF from the print dialogue
        </p>
      </div>
    </SiteLayout>
  );
}

/* ─── Ticket download ───────────────────────────────────────────────────── */

function downloadTicket(data: TicketData, reference: string) {
  const origin = typeof window !== "undefined" ? window.location.origin : "";
  const logoSrc = `${origin}/logo-white.png`;
  const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8"/>
<meta name="viewport" content="width=device-width,initial-scale=1"/>
<title>TEDxOrileIganmu · ${data.full_name}</title>
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
      <p class="attendee-name">${data.full_name}</p>
    </div>
    <div class="info-row">
      <div><p class="info-label">Date</p><p class="info-val">6 March 2027</p></div>
      <div><p class="info-label">Venue</p><p class="info-val">The Stable by Union Bank</p></div>
      <div><p class="info-label">Location</p><p class="info-val">Surulere, Lagos</p></div>
      <div><p class="info-label">Theme</p><p class="info-val theme-val">Beyond Boundaries</p></div>
    </div>
  </div>
  <div class="stub">
    <span class="tier-badge">${data.tierName}</span>
    <span class="vertical-text">Beyond Boundaries · Ideas Worth Spreading · TEDxOrileIganmu</span>
    <p class="admit">Admit One</p>
    <div>
      <p class="ref-label">Ref</p>
      <p class="ref-code">${reference}</p>
      <p class="not-resale">Not for resale</p>
    </div>
  </div>
</div>
<script>setTimeout(function(){window.print();},700);</script>
</body>
</html>`;

  const win = window.open("", "_blank", "width=920,height=480,scrollbars=yes,resizable=yes");
  if (!win) {
    alert("Please allow pop-ups to download your ticket.");
    return;
  }
  win.document.write(html);
  win.document.close();
}
