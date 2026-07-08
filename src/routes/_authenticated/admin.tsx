import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { sendAdminMessage } from "@/lib/paystack";

const LOGO = "/logo-black.png";
const SEAT_CAPACITY = 100;

export const Route = createFileRoute("/_authenticated/admin")({
  head: () => ({ meta: [{ title: "Admin · TEDxOrileIganmu" }] }),
  component: AdminPage,
});

type Tab = "overview" | "tickets" | "volunteers" | "partners" | "donations";

const TABS: { id: Tab; label: string; icon: string }[] = [
  { id: "overview",   label: "Overview",   icon: "◈" },
  { id: "tickets",    label: "Tickets",    icon: "◻" },
  { id: "volunteers", label: "Volunteers", icon: "◯" },
  { id: "partners",   label: "Partners",   icon: "◇" },
  { id: "donations",  label: "Donations",  icon: "◆" },
];

/* ─── Root page ─────────────────────────────────────────────────────────── */

function AdminPage() {
  const navigate = useNavigate();
  const { user, isAdmin, loading } = useAuth();
  const [tab, setTab] = useState<Tab>("overview");

  useEffect(() => {
    if (!loading && user && !isAdmin) {
      // signed in but no admin role — handled below
    }
  }, [loading, user, isAdmin]);

  const signOut = async () => {
    await supabase.auth.signOut();
    navigate({ to: "/auth" });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-paper flex items-center justify-center">
        <span className="text-[11px] uppercase tracking-[0.3em] text-muted-foreground animate-pulse">
          Loading…
        </span>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-paper flex flex-col items-center justify-center px-6 text-center">
        <div className="flex items-center gap-3 text-[11px] uppercase tracking-[0.25em] text-muted-foreground mb-6">
          <span className="h-px w-8 bg-red" />
          <span>Access denied</span>
        </div>
        <h1 className="font-display font-medium text-4xl tracking-[-0.02em] mb-3">
          Not an admin.
        </h1>
        <p className="font-serif italic text-ink/60 max-w-md mb-8">
          You're signed in as {user?.email}, but this account doesn't have
          curator access.
        </p>
        <div className="flex gap-3">
          <button
            onClick={signOut}
            className="border border-ink px-6 py-3 text-[11px] uppercase tracking-[0.3em] hover:bg-ink hover:text-white transition-colors"
          >
            Sign out
          </button>
          <Link
            to="/"
            className="bg-red text-white px-6 py-3 text-[11px] uppercase tracking-[0.3em] hover:bg-ink transition-colors"
          >
            Back to site
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-paper text-ink">
      {/* ── Top header ── */}
      <header className="sticky top-0 z-40 bg-paper/95 backdrop-blur-sm border-b border-border">
        <div className="absolute top-0 left-0 h-[2px] w-28 bg-red" />
        <div className="mx-auto max-w-[1440px] px-6 md:px-10 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-4">
            <img src={LOGO} alt="TEDxOrileIganmu" className="h-6 w-auto" />
            <span className="hidden sm:inline text-[9px] uppercase tracking-[0.35em] text-muted-foreground border-l border-border pl-4">
              Admin
            </span>
          </Link>
          <div className="flex items-center gap-5">
            <span className="hidden md:inline text-[10px] tracking-wide text-muted-foreground">
              {user?.email}
            </span>
            <button
              onClick={signOut}
              className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground hover:text-red transition-colors"
            >
              Sign out
            </button>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-[1440px] px-6 md:px-10 flex gap-10 pt-10 pb-20">
        {/* ── Sidebar (desktop) ── */}
        <aside className="hidden lg:flex flex-col w-52 shrink-0">
          <div className="sticky top-[73px]">
            <p className="text-[9px] uppercase tracking-[0.35em] text-muted-foreground mb-6 px-2">
              Navigation
            </p>
            <nav className="flex flex-col gap-1">
              {TABS.map((t) => (
                <button
                  key={t.id}
                  onClick={() => setTab(t.id)}
                  className={`relative flex items-center gap-3 px-3 py-3 rounded-sm text-left text-[11px] uppercase tracking-[0.2em] transition-all ${
                    tab === t.id
                      ? "bg-ink text-white"
                      : "text-muted-foreground hover:text-ink hover:bg-muted"
                  }`}
                >
                  {tab === t.id && (
                    <span className="absolute left-0 top-1/2 -translate-y-1/2 h-4 w-[2px] bg-red rounded-r" />
                  )}
                  <span className="text-[10px] opacity-60">{t.icon}</span>
                  {t.label}
                </button>
              ))}
            </nav>

            <div className="mt-10 px-3">
              <div className="h-px w-full bg-border mb-6" />
              <p className="text-[9px] uppercase tracking-[0.3em] text-muted-foreground mb-1">
                Event
              </p>
              <p className="font-display text-sm font-medium">TEDxOrileIganmu</p>
              <p className="text-[10px] text-muted-foreground mt-1">
                {SEAT_CAPACITY} seat capacity
              </p>
            </div>
          </div>
        </aside>

        {/* ── Main content ── */}
        <div className="flex-1 min-w-0">
          {/* Page heading */}
          <div className="mb-8">
            <div className="flex items-center gap-3 text-[10px] uppercase tracking-[0.3em] text-muted-foreground mb-4">
              <span className="h-px w-6 bg-red" />
              <span>Dashboard</span>
            </div>
            <h1 className="font-display font-medium tracking-[-0.02em] leading-none text-[clamp(2rem,4vw,3.25rem)]">
              The <span className="font-serif italic font-normal">backstage.</span>
            </h1>
          </div>

          {/* Mobile tab bar */}
          <div className="lg:hidden border-b border-border mb-8 -mx-6 px-6 flex gap-6 overflow-x-auto">
            {TABS.map((t) => (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={`relative py-4 text-[10px] uppercase tracking-[0.25em] whitespace-nowrap transition-colors ${
                  tab === t.id
                    ? "text-ink"
                    : "text-muted-foreground hover:text-ink"
                }`}
              >
                {t.label}
                {tab === t.id && (
                  <motion.span
                    layoutId="adminTabMobile"
                    className="absolute left-0 right-0 bottom-0 h-[2px] bg-red"
                  />
                )}
              </button>
            ))}
          </div>

          {/* Tab content */}
          <AnimatePresence mode="wait">
            <motion.div
              key={tab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
            >
              {tab === "overview"   && <Overview />}
              {tab === "tickets"    && <TicketsTab />}
              {tab === "volunteers" && <VolunteersTab />}
              {tab === "partners"   && <PartnersTab />}
              {tab === "donations"  && <DonationsTab />}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

/* ─── Shared helpers ────────────────────────────────────────────────────── */

function useRows<T>(table: string, deps: unknown[] = []) {
  const [rows, setRows] = useState<T[] | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    (async () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { data } = await (supabase as any)
        .from(table)
        .select("*")
        .order("created_at", { ascending: false });
      setRows((data ?? []) as T[]);
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [table, refreshKey, ...deps]);

  return { rows, refresh: () => setRefreshKey((k) => k + 1) };
}

function exportCSV(filename: string, rows: Record<string, unknown>[]) {
  if (!rows.length) return;
  const headers = Object.keys(rows[0]);
  const csvLines = [
    headers.join(","),
    ...rows.map((r) =>
      headers
        .map((h) => {
          const val = r[h] ?? "";
          const str = String(val).replace(/"/g, '""');
          return `"${str}"`;
        })
        .join(",")
    ),
  ];
  const blob = new Blob([csvLines.join("\n")], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

function EmptyState({ label }: { label: string }) {
  return (
    <div className="border border-dashed border-border rounded-sm py-24 text-center">
      <p className="font-serif italic text-xl text-muted-foreground">
        No {label} yet.
      </p>
    </div>
  );
}

function Loader() {
  return (
    <div className="py-16 text-center">
      <span className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground animate-pulse">
        Loading…
      </span>
    </div>
  );
}

function SectionHeader({
  title,
  count,
  onExport,
}: {
  title: string;
  count?: number;
  onExport?: () => void;
}) {
  return (
    <div className="flex items-end justify-between mb-6 pb-4 border-b border-border">
      <div>
        <h2 className="font-display font-medium text-2xl tracking-[-0.01em]">
          {title}
        </h2>
        {count !== undefined && (
          <p className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground mt-1">
            {count} {count === 1 ? "record" : "records"}
          </p>
        )}
      </div>
      {onExport && (
        <button
          onClick={onExport}
          className="flex items-center gap-2 border border-border px-4 py-2 text-[10px] uppercase tracking-[0.25em] text-muted-foreground hover:border-ink hover:text-ink transition-colors"
        >
          <svg width="11" height="11" viewBox="0 0 11 11" fill="none">
            <path d="M5.5 1v6M2.5 5l3 3 3-3M1 9.5h9" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          Export CSV
        </button>
      )}
    </div>
  );
}

/* Status pill — color-coded per status value */
function StatusPill({ status }: { status: string }) {
  const map: Record<string, string> = {
    // ticket / donation statuses
    pending:   "bg-amber-50 text-amber-700 border border-amber-200",
    paid:      "bg-emerald-50 text-emerald-700 border border-emerald-200",
    failed:    "bg-red-50 text-red-700 border border-red-200",
    refunded:  "bg-zinc-100 text-zinc-500 border border-zinc-200",
    // application statuses
    new:       "bg-sky-50 text-sky-700 border border-sky-200",
    reviewing: "bg-violet-50 text-violet-700 border border-violet-200",
    accepted:  "bg-emerald-50 text-emerald-700 border border-emerald-200",
    declined:  "bg-zinc-100 text-zinc-500 border border-zinc-200",
  };
  return (
    <span
      className={`inline-flex items-center px-2.5 py-1 rounded-full text-[9px] uppercase tracking-[0.18em] font-medium ${
        map[status] ?? "bg-muted text-ink border border-border"
      }`}
    >
      {status}
    </span>
  );
}

function InlineSelect({
  value,
  options,
  onChange,
}: {
  value: string;
  options: string[];
  onChange: (v: string) => void;
}) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="appearance-none text-[10px] uppercase tracking-[0.15em] bg-paper border border-border rounded-sm px-3 py-1.5 pr-6 text-ink hover:border-ink transition-colors cursor-pointer"
      style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='8' height='5' viewBox='0 0 8 5'%3E%3Cpath d='M0 0l4 5 4-5z' fill='%23111'/%3E%3C/svg%3E\")", backgroundRepeat: "no-repeat", backgroundPosition: "right 8px center" }}
    >
      {options.map((o) => (
        <option key={o} value={o}>
          {o}
        </option>
      ))}
    </select>
  );
}

/* ─── Overview ─────────────────────────────────────────────────────────── */

type OverviewStats = {
  paid: number;
  volunteers: number;
  partners: number;
  donations: number;
  ticketRevenue: number;
  donationRevenue: number;
};

function TrendBar({ value, max = SEAT_CAPACITY, label }: { value: number; max?: number; label?: string }) {
  const pct = Math.min((value / max) * 100, 100);
  return (
    <div className="mt-5">
      <div className="h-[3px] w-full bg-muted rounded-full overflow-hidden">
        <motion.div
          className="h-full bg-red rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
        />
      </div>
      <p className="text-[9px] text-muted-foreground mt-1.5 uppercase tracking-[0.2em]">
        {label ?? `${pct.toFixed(0)}% of ${max} seats`}
      </p>
    </div>
  );
}

function Overview() {
  const [stats, setStats] = useState<OverviewStats | null>(null);

  useEffect(() => {
    (async () => {
      const [ticketData, v, p, donationData] = await Promise.all([
        (supabase as any)
          .from("ticket_orders")
          .select("amount_naira, tier")
          .in("tier", ["regular", "standard", "vip"])
          .eq("payment_status", "paid"),
        supabase.from("volunteer_applications").select("id", { count: "exact", head: true }),
        supabase.from("partner_inquiries").select("id", { count: "exact", head: true }),
        supabase.from("donations").select("amount_naira").eq("payment_status", "paid"),
      ]);

      const paidTickets: { amount_naira: number }[] = ticketData.data ?? [];
      const paidDonations: { amount_naira: number }[] = donationData.data ?? [];

      const ticketRevenue = paidTickets.reduce((s, r) => s + (r.amount_naira ?? 0), 0);
      const donationRevenue = paidDonations.reduce((s, r) => s + (r.amount_naira ?? 0), 0);

      setStats({
        paid: paidTickets.length,
        volunteers: v.count ?? 0,
        partners: p.count ?? 0,
        donations: paidDonations.length,
        ticketRevenue,
        donationRevenue,
      });
    })();
  }, []);

  return (
    <div>
      <SectionHeader title="Overview" />
      {!stats ? (
        <Loader />
      ) : (
        <>
          {/* Primary confirmed-attendees banner */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35 }}
            className="relative bg-ink text-white p-7 mb-4"
          >
            <div className="absolute top-0 left-0 h-[3px] w-14 bg-red" />
            <p className="text-[10px] uppercase tracking-[0.3em] text-white/40">
              Confirmed attendees
            </p>
            <p className="mt-3 font-display font-medium text-[4rem] leading-none tracking-[-0.03em]">
              {stats.paid}
            </p>
            <p className="mt-2 text-[11px] text-white/50">
              Paid &amp; verified via Paystack · ₦{stats.ticketRevenue.toLocaleString()} from tickets
            </p>
            <TrendBar value={stats.paid} label={`${stats.paid} of ${SEAT_CAPACITY} seats filled`} />
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              {
                label: "Seats remaining",
                value: Math.max(0, SEAT_CAPACITY - stats.paid),
                sub: `${SEAT_CAPACITY} total capacity`,
                trend: SEAT_CAPACITY - stats.paid,
                max: SEAT_CAPACITY,
              },
              {
                label: "Volunteers",
                value: stats.volunteers,
                sub: "Applications received",
                trend: stats.volunteers,
                max: 50,
              },
              {
                label: "Partner inquiries",
                value: stats.partners,
                sub: "Sponsors · media · community",
                trend: stats.partners,
                max: 20,
              },
              {
                label: "Donations",
                value: stats.donations,
                sub: stats.donationRevenue > 0 ? `₦${stats.donationRevenue.toLocaleString()} received` : "None yet",
                trend: stats.donations,
                max: 50,
              },
            ].map((c, i) => (
              <motion.div
                key={c.label}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + i * 0.07, duration: 0.35 }}
                className="relative bg-paper border border-border p-7 hover:border-ink/30 transition-colors"
              >
                <div className="absolute top-0 left-0 h-[2px] w-10 bg-red" />
                <p className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
                  {c.label}
                </p>
                <p className="mt-4 font-display font-medium text-[3.25rem] leading-none tracking-[-0.03em]">
                  {c.value}
                </p>
                <p className="mt-2 text-[11px] text-muted-foreground">{c.sub}</p>
                <TrendBar value={c.trend} max={c.max} />
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-4 border border-border bg-muted px-6 py-4 flex items-center gap-4"
          >
            <span className="h-px w-6 bg-red shrink-0" />
            <p className="text-[11px] text-muted-foreground">
              <span className="font-medium text-ink">{stats.paid}</span> confirmed ·{" "}
              <span className="font-medium text-ink">{SEAT_CAPACITY - stats.paid}</span> seats left ·{" "}
              data refreshes on page load
            </p>
          </motion.div>
        </>
      )}
    </div>
  );
}

/* ─── Tickets ───────────────────────────────────────────────────────────── */

type TicketRow = {
  id: string;
  full_name: string;
  email: string;
  phone: string | null;
  tier: string;
  amount_naira: number;
  quantity: number;
  payment_status: string;
  payment_reference: string | null;
  created_at: string;
};

const TICKET_STATUSES = ["pending", "paid", "failed", "refunded"];

const TIER_NAMES: Record<string, string> = { regular: "Regular", standard: "Standard", vip: "VIP" };

function viewTicketAdmin(r: TicketRow) {
  const origin = typeof window !== "undefined" ? window.location.origin : "";
  const logoSrc = `${origin}/logo-white.png`;
  const tierName = TIER_NAMES[r.tier] ?? r.tier;
  const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8"/>
<title>TEDxOrileIganmu · ${r.full_name}</title>
<style>
*{margin:0;padding:0;box-sizing:border-box;}
body{background:#1a1a1a;min-height:100vh;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:40px 20px;font-family:-apple-system,BlinkMacSystemFont,'Inter','Segoe UI',sans-serif;gap:20px;}
.hint{color:rgba(255,255,255,.3);font-size:10px;letter-spacing:.3em;text-transform:uppercase;text-align:center;}
.ticket{width:min(860px,100%);background:#111;border:1px solid #252525;display:flex;position:relative;overflow:visible;}
.ticket::before{content:'';position:absolute;top:0;left:0;right:0;height:4px;background:#E62B1E;}
.ticket::after{content:'';position:absolute;top:-8px;right:179px;width:16px;height:16px;border-radius:50%;background:#1a1a1a;border:1px solid #252525;}
.main{flex:1;padding:40px 48px;display:flex;flex-direction:column;gap:28px;border-right:1px dashed #2a2a2a;position:relative;}
.main::after{content:'';position:absolute;bottom:-8px;right:-8px;width:16px;height:16px;border-radius:50%;background:#1a1a1a;border:1px solid #252525;}
.stub{width:180px;padding:32px 20px;display:flex;flex-direction:column;align-items:center;justify-content:space-between;gap:16px;text-align:center;}
.top{display:flex;align-items:flex-start;justify-content:space-between;}
.logo-img{height:22px;width:auto;object-fit:contain;}
.vol{color:rgba(255,255,255,.2);font-size:9px;letter-spacing:.35em;text-transform:uppercase;}
.attendee-label{color:rgba(255,255,255,.35);font-size:8px;letter-spacing:.35em;text-transform:uppercase;margin-bottom:8px;}
.attendee-name{color:#fff;font-size:clamp(28px,4vw,52px);font-weight:700;letter-spacing:-.025em;line-height:1;}
.info-row{display:flex;gap:36px;flex-wrap:wrap;}
.info-label{color:rgba(255,255,255,.3);font-size:8px;letter-spacing:.3em;text-transform:uppercase;margin-bottom:5px;}
.info-val{color:rgba(255,255,255,.75);font-size:13px;}
.theme-val{color:#E62B1E;}
.tier-badge{background:#E62B1E;color:#fff;font-size:10px;font-weight:700;letter-spacing:.25em;text-transform:uppercase;padding:7px 0;width:100%;}
.vertical-text{color:rgba(255,255,255,.12);font-size:8px;letter-spacing:.3em;text-transform:uppercase;writing-mode:vertical-rl;transform:rotate(180deg);flex:1;}
.admit{color:rgba(255,255,255,.2);font-size:8px;letter-spacing:.35em;text-transform:uppercase;}
.ref-label{color:rgba(255,255,255,.2);font-size:7px;letter-spacing:.25em;text-transform:uppercase;margin-bottom:3px;}
.ref-code{color:rgba(255,255,255,.4);font-size:9px;font-family:monospace;letter-spacing:.05em;word-break:break-all;}
.not-resale{color:rgba(255,255,255,.12);font-size:7px;letter-spacing:.2em;text-transform:uppercase;margin-top:3px;}
@media print{body{background:#111!important;padding:0;-webkit-print-color-adjust:exact;print-color-adjust:exact;display:block;}.hint{display:none;}.ticket{width:100%;page-break-inside:avoid;}@page{size:A4 landscape;margin:15mm;}}
</style>
</head>
<body>
<p class="hint">Print dialogue will open · Save as PDF to keep your ticket</p>
<div class="ticket">
  <div class="main">
    <div class="top">
      <img class="logo-img" src="${logoSrc}" alt="TEDxOrileIganmu" onerror="this.style.display='none'"/>
      <span class="vol">Vol. 01 · 2027</span>
    </div>
    <div><p class="attendee-label">Attendee</p><p class="attendee-name">${r.full_name}</p></div>
    <div class="info-row">
      <div><p class="info-label">Date</p><p class="info-val">6 March 2027</p></div>
      <div><p class="info-label">Venue</p><p class="info-val">The Stable by Union Bank</p></div>
      <div><p class="info-label">Location</p><p class="info-val">Surulere, Lagos</p></div>
      <div><p class="info-label">Theme</p><p class="info-val theme-val">Beyond Boundaries</p></div>
    </div>
  </div>
  <div class="stub">
    <span class="tier-badge">${tierName}</span>
    <span class="vertical-text">Beyond Boundaries · Ideas Worth Spreading · TEDxOrileIganmu</span>
    <p class="admit">Admit One</p>
    <div><p class="ref-label">Ref</p><p class="ref-code">${r.payment_reference ?? "—"}</p><p class="not-resale">Not for resale</p></div>
  </div>
</div>
<script>setTimeout(function(){window.print();},700);</script>
</body>
</html>`;
  const win = window.open("", "_blank", "width=920,height=480,scrollbars=yes,resizable=yes");
  if (!win) { alert("Allow pop-ups to view the ticket."); return; }
  win.document.write(html);
  win.document.close();
}

type MessageTarget = { full_name: string; email: string };

function MessageModal({ target, kind = "Attendee", onClose }: { target: MessageTarget; kind?: string; onClose: () => void }) {
  const [subject, setSubject] = useState(`TEDxOrileIganmu · 6 March 2027`);
  const [body, setBody] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const send = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("sending");
    try {
      const result = await sendAdminMessage({ data: { to: target.email, name: target.full_name, subject, body } });
      if (result.sent) { setStatus("sent"); }
      else { setErrorMsg(result.reason ?? "Failed to send."); setStatus("error"); }
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : "Failed to send.");
      setStatus("error");
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-ink/70 backdrop-blur-sm flex items-end md:items-center justify-center p-0 md:p-6" onClick={onClose}>
      <motion.div
        initial={{ y: 40, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
        onClick={(e) => e.stopPropagation()}
        className="bg-paper w-full max-w-lg max-h-[92vh] overflow-y-auto relative"
      >
        <div className="absolute top-0 left-0 right-0 h-[3px] bg-red" />
        <div className="p-8">
          {status === "sent" ? (
            <div>
              <div className="flex items-center gap-3 text-[11px] uppercase tracking-[0.25em] text-muted-foreground mb-6">
                <span className="h-px w-8 bg-red" /><span>Sent</span>
              </div>
              <p className="font-display text-2xl tracking-[-0.01em] mb-2">Message delivered.</p>
              <p className="text-sm text-muted-foreground mb-6">Your message was sent to {target.email}.</p>
              <button onClick={onClose} className="border border-ink px-5 py-2.5 text-[10px] uppercase tracking-[0.25em] hover:bg-ink hover:text-white transition-colors">Close</button>
            </div>
          ) : (
            <form onSubmit={send} className="space-y-5">
              <div>
                <div className="flex items-center gap-3 text-[11px] uppercase tracking-[0.25em] text-muted-foreground mb-4">
                  <span className="h-px w-8 bg-red" /><span>Message {kind}</span>
                </div>
                <button type="button" onClick={onClose} className="absolute top-5 right-6 text-[11px] uppercase tracking-[0.3em] text-muted-foreground hover:text-red transition-colors">Close</button>
                <p className="font-display text-xl tracking-[-0.01em]">{target.full_name}</p>
                <p className="text-[11px] text-muted-foreground mt-0.5">{target.email}</p>
              </div>
              <label className="block">
                <span className="block text-[10px] uppercase tracking-[0.3em] text-muted-foreground mb-2">Subject</span>
                <input required value={subject} onChange={(e) => setSubject(e.target.value)}
                  className="w-full bg-transparent border-b border-ink/25 py-2.5 focus:outline-none focus:border-red text-sm" />
              </label>
              <label className="block">
                <span className="block text-[10px] uppercase tracking-[0.3em] text-muted-foreground mb-2">Message</span>
                <textarea required rows={7} value={body} onChange={(e) => setBody(e.target.value)}
                  placeholder="Type your message here…"
                  className="w-full bg-transparent border border-ink/15 p-3 focus:outline-none focus:border-red text-sm resize-none leading-relaxed" />
              </label>
              <p className="text-[10px] text-muted-foreground">The recipient will receive a beautifully formatted email from TEDxOrileIganmu.</p>
              {status === "error" && <p className="text-[11px] text-red">{errorMsg}</p>}
              <div className="flex gap-3">
                <button type="submit" disabled={status === "sending"}
                  className="flex-1 bg-red text-white py-3 text-[10px] uppercase tracking-[0.3em] hover:bg-ink transition-colors disabled:opacity-60">
                  {status === "sending" ? "Sending…" : "Send Message →"}
                </button>
                <button type="button" onClick={onClose}
                  className="border border-ink px-5 text-[10px] uppercase tracking-[0.3em] hover:bg-ink hover:text-white transition-colors">
                  Cancel
                </button>
              </div>
            </form>
          )}
        </div>
      </motion.div>
    </div>
  );
}

function TicketsTab() {
  const { rows: allRows, refresh } = useRows<TicketRow>("ticket_orders");
  const rows = allRows ? allRows.filter((r) => r.tier === "regular" || r.tier === "standard" || r.tier === "vip") : null;
  const [search, setSearch] = useState("");
  const [msgTarget, setMsgTarget] = useState<MessageTarget | null>(null);

  const filtered = rows
    ? rows.filter((r) => {
        const q = search.toLowerCase();
        return !q || r.full_name.toLowerCase().includes(q) || r.email.toLowerCase().includes(q);
      })
    : null;

  const updateStatus = async (id: string, payment_status: string) => {
    await supabase
      .from("ticket_orders")
      .update({ payment_status: payment_status as "pending" | "paid" | "failed" | "refunded" })
      .eq("id", id);
    refresh();
  };

  const handleExport = useCallback(() => {
    if (!rows) return;
    exportCSV(
      "tickets.csv",
      rows.map((r) => ({
        reference: r.payment_reference ?? "",
        name: r.full_name,
        email: r.email,
        phone: r.phone ?? "",
        tier: r.tier,
        quantity: r.quantity,
        amount_naira: r.amount_naira,
        status: r.payment_status,
        date: r.created_at,
      }))
    );
  }, [rows]);

  if (!filtered) return <Loader />;

  return (
    <div>
      <SectionHeader
        title="Tickets"
        count={filtered.length}
        onExport={rows && rows.length > 0 ? handleExport : undefined}
      />

      {/* Search */}
      <div className="mb-5 relative">
        <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" width="13" height="13" viewBox="0 0 13 13" fill="none">
          <circle cx="5.5" cy="5.5" r="4.5" stroke="currentColor" strokeWidth="1.2"/>
          <path d="M9 9l2.5 2.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
        </svg>
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by name or email…"
          className="w-full border border-border pl-9 pr-4 py-2.5 text-sm focus:outline-none focus:border-ink bg-paper placeholder:text-muted-foreground"
        />
        {search && (
          <button onClick={() => setSearch("")} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-ink text-lg leading-none">×</button>
        )}
      </div>

      {filtered.length === 0 ? (
        <EmptyState label={search ? `results for "${search}"` : "ticket orders"} />
      ) : (
        <div className="border border-border overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-muted">
                <Th>Attendee</Th>
                <Th>Reference</Th>
                <Th>Tier</Th>
                <Th>Amount</Th>
                <Th>Status</Th>
                <Th>Date</Th>
                <Th>Actions</Th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((r, i) => (
                <motion.tr
                  key={r.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.025 }}
                  className="border-b border-border last:border-b-0 align-middle hover:bg-muted/40 transition-colors"
                >
                  <Td>
                    <div className="font-medium text-sm">{r.full_name}</div>
                    <div className="text-[11px] text-muted-foreground mt-0.5">
                      {r.email}
                      {r.phone ? ` · ${r.phone}` : ""}
                    </div>
                  </Td>
                  <Td>
                    {r.payment_reference ? (
                      <code className="text-[10px] bg-muted px-2 py-1 rounded font-mono text-ink/70">
                        {r.payment_reference.slice(0, 14)}…
                      </code>
                    ) : (
                      <span className="text-muted-foreground text-[10px]">—</span>
                    )}
                  </Td>
                  <Td>
                    <span className="text-[10px] uppercase tracking-[0.2em] font-medium">{r.tier}</span>
                    {r.quantity > 1 && (
                      <span className="ml-1.5 text-[10px] text-muted-foreground">× {r.quantity}</span>
                    )}
                  </Td>
                  <Td>
                    <span className="font-display text-sm">₦{(r.amount_naira * r.quantity).toLocaleString()}</span>
                  </Td>
                  <Td>
                    <StatusPill status={r.payment_status} />
                  </Td>
                  <Td className="text-[11px] text-muted-foreground whitespace-nowrap">
                    {new Date(r.created_at).toLocaleDateString("en-NG", { day: "numeric", month: "short", year: "numeric" })}
                  </Td>
                  <Td>
                    <div className="flex flex-col gap-2">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => viewTicketAdmin(r)}
                          className="flex items-center gap-1.5 border border-border px-2.5 py-1.5 text-[9px] uppercase tracking-[0.2em] hover:border-ink hover:text-ink transition-colors whitespace-nowrap"
                        >
                          <svg width="10" height="10" viewBox="0 0 10 10" fill="none"><rect x="1" y="1" width="8" height="8" rx="0.5" stroke="currentColor" strokeWidth="1.1"/><path d="M3 3.5h4M3 5h4M3 6.5h2.5" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round"/></svg>
                          View Ticket
                        </button>
                        <button
                          onClick={() => setMsgTarget({ full_name: r.full_name, email: r.email })}
                          className="flex items-center gap-1.5 border border-border px-2.5 py-1.5 text-[9px] uppercase tracking-[0.2em] hover:border-red hover:text-red transition-colors whitespace-nowrap"
                        >
                          <svg width="10" height="10" viewBox="0 0 10 10" fill="none"><rect x="1" y="2" width="8" height="6" rx="0.5" stroke="currentColor" strokeWidth="1.1"/><path d="M1.5 2.5l3.5 3 3.5-3" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" strokeLinejoin="round"/></svg>
                          Message
                        </button>
                      </div>
                      {r.payment_status !== "paid" && (
                        <InlineSelect
                          value={r.payment_status}
                          options={["failed", "refunded"]}
                          onChange={(v) => updateStatus(r.id, v)}
                        />
                      )}
                    </div>
                  </Td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {msgTarget && <MessageModal target={msgTarget} kind="Attendee" onClose={() => setMsgTarget(null)} />}
    </div>
  );
}

/* ─── Volunteers ────────────────────────────────────────────────────────── */

type VolunteerRow = {
  id: string;
  full_name: string;
  email: string;
  phone: string;
  role: string;
  experience: string | null;
  availability: string | null;
  note: string | null;
  status: string;
  created_at: string;
};

const APP_STATUSES = ["new", "reviewing", "accepted", "declined"];

function VolunteersTab() {
  const { rows, refresh } = useRows<VolunteerRow>("volunteer_applications");
  const [msgTarget, setMsgTarget] = useState<MessageTarget | null>(null);

  const updateStatus = async (id: string, status: string) => {
    await supabase
      .from("volunteer_applications")
      .update({ status: status as "new" | "reviewing" | "accepted" | "declined" })
      .eq("id", id);
    refresh();
  };

  const handleExport = useCallback(() => {
    if (!rows) return;
    exportCSV(
      "volunteers.csv",
      rows.map((r) => ({
        name: r.full_name,
        email: r.email,
        phone: r.phone ?? "",
        role: r.role,
        availability: r.availability ?? "",
        experience: r.experience ?? "",
        note: r.note ?? "",
        status: r.status,
        date: r.created_at,
      }))
    );
  }, [rows]);

  if (!rows) return <Loader />;

  return (
    <div>
      <SectionHeader title="Volunteers" count={rows.length} onExport={rows.length > 0 ? handleExport : undefined} />
      {rows.length === 0 ? (
        <EmptyState label="volunteer applications" />
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {rows.map((r, i) => (
            <motion.article
              key={r.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04 }}
              className="relative border border-border bg-paper p-6 flex flex-col gap-5 hover:border-ink/30 transition-colors group"
            >
              {/* Top accent */}
              <div className="absolute top-0 left-0 h-[2px] w-8 bg-red" />

              {/* Header row */}
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="font-display font-medium text-base leading-tight truncate">
                    {r.full_name}
                  </p>
                  <p className="text-[11px] text-muted-foreground mt-0.5 truncate">
                    {r.email}
                  </p>
                  {r.phone && (
                    <p className="text-[11px] text-muted-foreground">{r.phone}</p>
                  )}
                </div>
                <StatusPill status={r.status} />
              </div>

              {/* Role chip */}
              <div className="flex items-center gap-2">
                <span className="h-px w-4 bg-red" />
                <span className="text-[10px] uppercase tracking-[0.25em] text-red font-medium">
                  {r.role}
                </span>
              </div>

              {/* Details */}
              <div className="space-y-2 text-[12px] text-ink/70 flex-1">
                {r.availability && (
                  <div className="flex gap-2">
                    <span className="text-muted-foreground shrink-0 w-20 text-[10px] uppercase tracking-[0.15em] pt-px">
                      Avail.
                    </span>
                    <span>{r.availability}</span>
                  </div>
                )}
                {r.experience && (
                  <div className="flex gap-2">
                    <span className="text-muted-foreground shrink-0 w-20 text-[10px] uppercase tracking-[0.15em] pt-px">
                      Exp.
                    </span>
                    <span className="line-clamp-2">{r.experience}</span>
                  </div>
                )}
                {r.note && (
                  <p className="font-serif italic text-ink/50 text-[13px] line-clamp-2 pt-1">
                    "{r.note}"
                  </p>
                )}
              </div>

              {/* Footer */}
              <div className="pt-3 border-t border-border space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-muted-foreground">
                    {new Date(r.created_at).toLocaleDateString("en-NG", { day: "numeric", month: "short" })}
                  </span>
                  <InlineSelect value={r.status} options={APP_STATUSES} onChange={(v) => updateStatus(r.id, v)} />
                </div>
                <button
                  onClick={() => setMsgTarget({ full_name: r.full_name, email: r.email })}
                  className="w-full flex items-center justify-center gap-2 border border-border py-2 text-[9px] uppercase tracking-[0.2em] hover:border-red hover:text-red transition-colors"
                >
                  <svg width="10" height="10" viewBox="0 0 10 10" fill="none"><rect x="1" y="2" width="8" height="6" rx="0.5" stroke="currentColor" strokeWidth="1.1"/><path d="M1.5 2.5l3.5 3 3.5-3" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  Send Message
                </button>
              </div>
            </motion.article>
          ))}
        </div>
      )}
      {msgTarget && <MessageModal target={msgTarget} kind="Volunteer" onClose={() => setMsgTarget(null)} />}
    </div>
  );
}

/* ─── Partners ──────────────────────────────────────────────────────────── */

type PartnerRow = {
  id: string;
  organisation: string;
  contact_name: string;
  email: string;
  phone: string | null;
  tier: string;
  note: string | null;
  status: string;
  created_at: string;
};

function PartnersTab() {
  const { rows, refresh } = useRows<PartnerRow>("partner_inquiries");

  const updateStatus = async (id: string, status: string) => {
    await supabase
      .from("partner_inquiries")
      .update({ status: status as "new" | "reviewing" | "accepted" | "declined" })
      .eq("id", id);
    refresh();
  };

  if (!rows) return <Loader />;

  return (
    <div>
      <SectionHeader title="Partners" count={rows.length} />
      {rows.length === 0 ? (
        <EmptyState label="partner inquiries" />
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {rows.map((r, i) => (
            <motion.article
              key={r.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04 }}
              className="relative border border-border bg-paper p-6 flex flex-col gap-5 hover:border-ink/30 transition-colors"
            >
              <div className="absolute top-0 left-0 h-[2px] w-8 bg-red" />

              {/* Header */}
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="font-display font-medium text-base leading-tight">
                    {r.organisation}
                  </p>
                  <p className="text-[12px] text-ink/70 mt-0.5">{r.contact_name}</p>
                  <p className="text-[11px] text-muted-foreground mt-0.5 truncate">
                    {r.email}
                    {r.phone ? ` · ${r.phone}` : ""}
                  </p>
                </div>
                <StatusPill status={r.status} />
              </div>

              {/* Tier */}
              <div className="flex items-center gap-2">
                <span className="h-px w-4 bg-red" />
                <span className="text-[10px] uppercase tracking-[0.25em] text-red font-medium">
                  {r.tier}
                </span>
              </div>

              {/* Note */}
              {r.note && (
                <p className="font-serif italic text-ink/50 text-[13px] line-clamp-3 flex-1">
                  "{r.note}"
                </p>
              )}

              {/* Footer */}
              <div className="flex items-center justify-between pt-3 border-t border-border">
                <span className="text-[10px] text-muted-foreground">
                  {new Date(r.created_at).toLocaleDateString("en-NG", {
                    day: "numeric",
                    month: "short",
                  })}
                </span>
                <InlineSelect
                  value={r.status}
                  options={APP_STATUSES}
                  onChange={(v) => updateStatus(r.id, v)}
                />
              </div>
            </motion.article>
          ))}
        </div>
      )}
    </div>
  );
}

/* ─── Donations ─────────────────────────────────────────────────────────── */

type DonationRow = {
  id: string;
  donor_name: string;
  email: string;
  phone: string | null;
  amount_naira: number;
  tier: string | null;
  message: string | null;
  payment_status: string;
  created_at: string;
};

const DONATION_STATUSES = ["pending", "paid", "failed", "refunded"];

function DonationsTab() {
  const { rows, refresh } = useRows<DonationRow>("donations");

  const updateStatus = async (id: string, payment_status: string) => {
    await supabase
      .from("donations")
      .update({ payment_status: payment_status as "pending" | "paid" | "failed" | "refunded" })
      .eq("id", id);
    refresh();
  };

  const handleExport = useCallback(() => {
    if (!rows) return;
    exportCSV(
      "donations.csv",
      rows.map((r) => ({
        name: r.donor_name,
        email: r.email,
        phone: r.phone ?? "",
        amount_naira: r.amount_naira,
        tier: r.tier ?? "",
        message: r.message ?? "",
        status: r.payment_status,
        date: r.created_at,
      }))
    );
  }, [rows]);

  if (!rows) return <Loader />;

  const totalPaid = rows
    .filter((r) => r.payment_status === "paid")
    .reduce((s, r) => s + r.amount_naira, 0);

  return (
    <div>
      <SectionHeader
        title="Donations"
        count={rows.length}
        onExport={rows.length > 0 ? handleExport : undefined}
      />

      {rows.length > 0 && (
        <div className="mb-6 flex items-center gap-3 px-5 py-4 bg-emerald-50 border border-emerald-200 text-emerald-800">
          <span className="h-[2px] w-6 bg-emerald-500 shrink-0" />
          <p className="text-[11px]">
            <span className="font-medium">₦{totalPaid.toLocaleString()}</span> confirmed ·{" "}
            {rows.filter((r) => r.payment_status === "paid").length} paid donations
          </p>
        </div>
      )}

      {rows.length === 0 ? (
        <EmptyState label="donations" />
      ) : (
        <div className="border border-border overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-muted">
                <Th>Donor</Th>
                <Th>Amount</Th>
                <Th>Tier</Th>
                <Th>Message</Th>
                <Th>Status</Th>
                <Th>Date</Th>
                <Th>Action</Th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r, i) => (
                <motion.tr
                  key={r.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.025 }}
                  className="border-b border-border last:border-b-0 align-middle hover:bg-muted/40 transition-colors"
                >
                  <Td>
                    <div className="font-medium text-sm">{r.donor_name}</div>
                    <div className="text-[11px] text-muted-foreground mt-0.5">
                      {r.email}
                      {r.phone ? ` · ${r.phone}` : ""}
                    </div>
                  </Td>
                  <Td>
                    <span className="font-display font-medium text-sm">
                      ₦{r.amount_naira.toLocaleString()}
                    </span>
                  </Td>
                  <Td>
                    <span className="text-[10px] uppercase tracking-[0.15em] text-muted-foreground">
                      {r.tier ?? "—"}
                    </span>
                  </Td>
                  <Td className="max-w-[200px]">
                    {r.message ? (
                      <p className="font-serif italic text-[12px] text-ink/60 line-clamp-2">
                        "{r.message}"
                      </p>
                    ) : (
                      <span className="text-muted-foreground text-[10px]">—</span>
                    )}
                  </Td>
                  <Td>
                    <StatusPill status={r.payment_status} />
                  </Td>
                  <Td className="text-[11px] text-muted-foreground whitespace-nowrap">
                    {new Date(r.created_at).toLocaleDateString("en-NG", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </Td>
                  <Td>
                    <InlineSelect
                      value={r.payment_status}
                      options={DONATION_STATUSES}
                      onChange={(v) => updateStatus(r.id, v)}
                    />
                  </Td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

/* ─── Table primitives ───────────────────────────────────────────────────── */

function Th({ children }: { children: React.ReactNode }) {
  return (
    <th className="px-5 py-3 text-left text-[9px] uppercase tracking-[0.28em] text-muted-foreground font-medium">
      {children}
    </th>
  );
}

function Td({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <td className={`px-5 py-4 ${className}`}>{children}</td>;
}
