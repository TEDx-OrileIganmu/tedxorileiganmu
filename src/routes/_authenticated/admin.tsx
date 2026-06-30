import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";

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
  tickets: number;
  paid: number;
  volunteers: number;
  partners: number;
  donations: number;
  raised: number;
};

function TrendBar({ value, max = SEAT_CAPACITY }: { value: number; max?: number }) {
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
        {pct.toFixed(0)}% of {max} capacity
      </p>
    </div>
  );
}

function Overview() {
  const [stats, setStats] = useState<OverviewStats | null>(null);

  useEffect(() => {
    (async () => {
      const [t, tp, v, p, d] = await Promise.all([
        supabase.from("ticket_orders").select("id", { count: "exact", head: true }),
        supabase.from("ticket_orders").select("amount_naira").eq("payment_status", "paid"),
        supabase.from("volunteer_applications").select("id", { count: "exact", head: true }),
        supabase.from("partner_inquiries").select("id", { count: "exact", head: true }),
        supabase.from("donations").select("amount_naira").eq("payment_status", "paid"),
      ]);
      const ticketRevenue = (tp.data ?? []).reduce((s, r) => s + (r.amount_naira ?? 0), 0);
      const donationRevenue = (d.data ?? []).reduce((s, r) => s + (r.amount_naira ?? 0), 0);
      setStats({
        tickets: t.count ?? 0,
        paid: tp.data?.length ?? 0,
        volunteers: v.count ?? 0,
        partners: p.count ?? 0,
        donations: d.data?.length ?? 0,
        raised: ticketRevenue + donationRevenue,
      });
    })();
  }, []);

  const cards = stats
    ? [
        {
          label: "Ticket orders",
          value: stats.tickets,
          sub: `${stats.paid} paid · ${stats.tickets - stats.paid} pending`,
          trend: stats.paid,
          trendLabel: true,
        },
        {
          label: "Volunteers",
          value: stats.volunteers,
          sub: "Applications received",
          trend: stats.volunteers,
          trendLabel: true,
        },
        {
          label: "Partner inquiries",
          value: stats.partners,
          sub: "Sponsors · media · community",
          trend: stats.partners,
          trendLabel: true,
        },
        {
          label: "Revenue raised",
          value: `₦${(stats.raised / 1000).toFixed(0)}k`,
          sub: `${stats.donations} donation${stats.donations !== 1 ? "s" : ""} · tickets + gifts`,
          trend: Math.round((stats.raised / 5_000_000) * SEAT_CAPACITY),
          trendLabel: false,
        },
      ]
    : [];

  return (
    <div>
      <SectionHeader title="Overview" />
      {!stats ? (
        <Loader />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {cards.map((c, i) => (
            <motion.div
              key={c.label}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.07, duration: 0.35 }}
              className="relative bg-paper border border-border p-7 group hover:border-ink/30 transition-colors"
            >
              <div className="absolute top-0 left-0 h-[2px] w-10 bg-red" />
              <p className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
                {c.label}
              </p>
              <p className="mt-4 font-display font-medium text-[3.25rem] leading-none tracking-[-0.03em]">
                {c.value}
              </p>
              <p className="mt-2 text-[11px] text-muted-foreground">{c.sub}</p>
              <TrendBar value={c.trend} />
            </motion.div>
          ))}
        </div>
      )}

      {/* Quick activity note */}
      {stats && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.45 }}
          className="mt-6 border border-border bg-muted px-6 py-4 flex items-center gap-4"
        >
          <span className="h-px w-6 bg-red shrink-0" />
          <p className="text-[11px] text-muted-foreground">
            <span className="font-medium text-ink">{stats.paid}</span> confirmed attendees ·{" "}
            <span className="font-medium text-ink">
              ₦{stats.raised.toLocaleString()}
            </span>{" "}
            total revenue · data refreshes on page load
          </p>
        </motion.div>
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

function TicketsTab() {
  const { rows, refresh } = useRows<TicketRow>("ticket_orders");

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

  if (!rows) return <Loader />;

  return (
    <div>
      <SectionHeader
        title="Tickets"
        count={rows.length}
        onExport={rows.length > 0 ? handleExport : undefined}
      />
      {rows.length === 0 ? (
        <EmptyState label="ticket orders" />
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
                    <span className="text-[10px] uppercase tracking-[0.2em] font-medium">
                      {r.tier}
                    </span>
                    {r.quantity > 1 && (
                      <span className="ml-1.5 text-[10px] text-muted-foreground">
                        × {r.quantity}
                      </span>
                    )}
                  </Td>
                  <Td>
                    <span className="font-display text-sm">
                      ₦{(r.amount_naira * r.quantity).toLocaleString()}
                    </span>
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
                      options={TICKET_STATUSES}
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

  const updateStatus = async (id: string, status: string) => {
    await supabase
      .from("volunteer_applications")
      .update({ status: status as "new" | "reviewing" | "accepted" | "declined" })
      .eq("id", id);
    refresh();
  };

  if (!rows) return <Loader />;

  return (
    <div>
      <SectionHeader title="Volunteers" count={rows.length} />
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
