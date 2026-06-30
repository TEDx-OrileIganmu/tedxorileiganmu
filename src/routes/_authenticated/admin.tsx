import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import logoBlack from "@/assets/logo-black.png.asset.json";

export const Route = createFileRoute("/_authenticated/admin")({
  head: () => ({ meta: [{ title: "Admin — TEDxOrileIganmu" }] }),
  component: AdminPage,
});

type Tab = "overview" | "tickets" | "volunteers" | "partners" | "donations";

const TABS: { id: Tab; label: string }[] = [
  { id: "overview", label: "Overview" },
  { id: "tickets", label: "Tickets" },
  { id: "volunteers", label: "Volunteers" },
  { id: "partners", label: "Partners" },
  { id: "donations", label: "Donations" },
];

function AdminPage() {
  const navigate = useNavigate();
  const { user, isAdmin, loading } = useAuth();
  const [tab, setTab] = useState<Tab>("overview");

  useEffect(() => {
    if (!loading && user && !isAdmin) {
      // signed in but no admin role
    }
  }, [loading, user, isAdmin]);

  const signOut = async () => {
    await supabase.auth.signOut();
    navigate({ to: "/auth" });
  };

  if (loading) {
    return <div className="min-h-screen bg-paper flex items-center justify-center text-[11px] uppercase tracking-[0.3em] text-muted-foreground">Loading…</div>;
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-paper flex flex-col items-center justify-center px-6 text-center">
        <div className="flex items-center gap-3 text-[11px] uppercase tracking-[0.25em] text-muted-foreground mb-6">
          <span className="h-px w-8 bg-red" /><span>Access denied</span>
        </div>
        <h1 className="font-display text-4xl tracking-[-0.02em] mb-3">Not an admin.</h1>
        <p className="font-serif italic text-ink/60 max-w-md mb-8">
          You're signed in as {user?.email}, but this account doesn't have curator access.
        </p>
        <div className="flex gap-3">
          <button onClick={signOut} className="border border-ink px-6 py-3 text-[11px] uppercase tracking-[0.3em] hover:bg-ink hover:text-white transition-colors">Sign out</button>
          <Link to="/" className="bg-red text-white px-6 py-3 text-[11px] uppercase tracking-[0.3em] hover:bg-ink transition-colors">Back to site</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-paper text-ink">
      <header className="sticky top-0 z-30 bg-paper/95 backdrop-blur border-b border-border">
        <div className="absolute top-0 left-0 h-px w-24 md:w-40 bg-red" />
        <div className="mx-auto max-w-7xl px-6 md:px-10 py-5 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3">
            <img src={logoBlack.url} alt="TEDx" className="h-5 w-auto" />
            <span className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground hidden sm:inline">/ Admin</span>
          </Link>
          <div className="flex items-center gap-4">
            <span className="hidden sm:inline text-[10px] uppercase tracking-[0.3em] text-muted-foreground">{user?.email}</span>
            <button onClick={signOut} className="text-[10px] uppercase tracking-[0.3em] hover:text-red transition-colors">Sign out</button>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-6 md:px-10 pt-12 md:pt-16 pb-6">
        <div className="flex items-center gap-3 text-[11px] uppercase tracking-[0.25em] text-muted-foreground mb-6">
          <span className="h-px w-8 bg-red" /><span>Dashboard</span>
        </div>
        <h1 className="font-display font-medium tracking-[-0.02em] leading-[0.95] text-[clamp(2.25rem,5vw,4rem)]">
          The <span className="font-serif italic">backstage.</span>
        </h1>
      </div>

      <nav className="sticky top-[65px] z-20 bg-paper border-b border-border">
        <div className="mx-auto max-w-7xl px-6 md:px-10 flex gap-8 overflow-x-auto">
          {TABS.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`relative py-5 text-[11px] uppercase tracking-[0.25em] whitespace-nowrap transition-colors ${
                tab === t.id ? "text-ink" : "text-muted-foreground hover:text-ink"
              }`}
            >
              {t.label}
              {tab === t.id && (
                <motion.span layoutId="adminTab" className="absolute left-0 right-0 bottom-0 h-[2px] bg-red" />
              )}
            </button>
          ))}
        </div>
      </nav>

      <main className="mx-auto max-w-7xl px-6 md:px-10 py-12 md:py-16">
        <AnimatePresence mode="wait">
          <motion.div
            key={tab}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25 }}
          >
            {tab === "overview" && <Overview />}
            {tab === "tickets" && <TicketsTable />}
            {tab === "volunteers" && <VolunteersTable />}
            {tab === "partners" && <PartnersTable />}
            {tab === "donations" && <DonationsTable />}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}

/* ---------------- Overview ---------------- */
function Overview() {
  const [stats, setStats] = useState<{ tickets: number; paid: number; volunteers: number; partners: number; donations: number; raised: number } | null>(null);

  useEffect(() => {
    (async () => {
      const [t, tp, v, p, d] = await Promise.all([
        supabase.from("ticket_orders").select("id", { count: "exact", head: true }),
        supabase.from("ticket_orders").select("amount_naira").eq("payment_status", "paid"),
        supabase.from("volunteer_applications").select("id", { count: "exact", head: true }),
        supabase.from("partner_inquiries").select("id", { count: "exact", head: true }),
        supabase.from("donations").select("amount_naira").eq("payment_status", "paid"),
      ]);
      const raised =
        (tp.data ?? []).reduce((s, r) => s + (r.amount_naira ?? 0), 0) +
        (d.data ?? []).reduce((s, r) => s + (r.amount_naira ?? 0), 0);
      setStats({
        tickets: t.count ?? 0,
        paid: tp.data?.length ?? 0,
        volunteers: v.count ?? 0,
        partners: p.count ?? 0,
        donations: d.data?.length ?? 0,
        raised,
      });
    })();
  }, []);

  const cards = [
    { k: "Ticket orders", v: stats?.tickets, sub: `${stats?.paid ?? 0} paid` },
    { k: "Volunteer applications", v: stats?.volunteers, sub: "Awaiting review" },
    { k: "Partner inquiries", v: stats?.partners, sub: "Sponsor & media" },
    { k: "Donations", v: stats?.donations, sub: `₦${(stats?.raised ?? 0).toLocaleString()} raised` },
  ];

  return (
    <div className="grid gap-px md:grid-cols-2 lg:grid-cols-4 bg-border border border-border">
      {cards.map((c, i) => (
        <motion.div
          key={c.k}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.06, duration: 0.4 }}
          className="bg-paper p-8 relative"
        >
          <div className="absolute top-0 left-0 h-[2px] w-12 bg-red" />
          <p className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground">{c.k}</p>
          <p className="mt-6 font-display text-5xl tracking-[-0.03em] font-medium">
            {c.v ?? "—"}
          </p>
          <p className="mt-3 text-xs text-muted-foreground">{c.sub}</p>
        </motion.div>
      ))}
    </div>
  );
}

/* ---------------- Generic table helpers ---------------- */
function useRows<T>(table: string, deps: unknown[] = []) {
  const [rows, setRows] = useState<T[] | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);
  useEffect(() => {
    (async () => {
      // @ts-expect-error dynamic table name
      const { data } = await supabase.from(table).select("*").order("created_at", { ascending: false });
      setRows((data ?? []) as T[]);
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [table, refreshKey, ...deps]);
  return { rows, refresh: () => setRefreshKey((k) => k + 1) };
}

function EmptyState({ label }: { label: string }) {
  return (
    <div className="border border-dashed border-border py-20 text-center">
      <p className="font-serif italic text-xl text-muted-foreground">No {label} yet.</p>
    </div>
  );
}

function StatusPill({ status }: { status: string }) {
  const colors: Record<string, string> = {
    new: "bg-muted text-ink",
    pending: "bg-muted text-ink",
    reviewing: "bg-ink text-white",
    paid: "bg-red text-white",
    accepted: "bg-red text-white",
    declined: "border border-border text-muted-foreground",
    failed: "border border-border text-muted-foreground",
    refunded: "border border-border text-muted-foreground",
  };
  return <span className={`inline-block px-2 py-1 text-[9px] uppercase tracking-[0.2em] ${colors[status] ?? "bg-muted"}`}>{status}</span>;
}

/* ---------------- Tickets ---------------- */
type TicketRow = {
  id: string; full_name: string; email: string; phone: string | null;
  tier: string; amount_naira: number; quantity: number; payment_status: string;
  payment_reference: string | null; created_at: string;
};
function TicketsTable() {
  const { rows, refresh } = useRows<TicketRow>("ticket_orders");
  const updateStatus = async (id: string, payment_status: string) => {
    const ps = payment_status as "pending" | "paid" | "failed" | "refunded";
    await supabase.from("ticket_orders").update({ payment_status: ps }).eq("id", id);
    refresh();
  };
  if (!rows) return <p className="text-muted-foreground text-sm">Loading…</p>;
  if (rows.length === 0) return <EmptyState label="ticket orders" />;
  return (
    <div className="border border-border overflow-x-auto">
      <table className="w-full text-sm">
        <thead className="bg-muted">
          <tr className="text-left text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
            <Th>Attendee</Th><Th>Tier</Th><Th>Amount</Th><Th>Status</Th><Th>Submitted</Th><Th>Action</Th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.id} className="border-t border-border align-top">
              <Td>
                <div className="font-medium">{r.full_name}</div>
                <div className="text-xs text-muted-foreground">{r.email}{r.phone ? ` · ${r.phone}` : ""}</div>
              </Td>
              <Td className="capitalize">{r.tier}</Td>
              <Td>₦{r.amount_naira.toLocaleString()} {r.quantity > 1 && `× ${r.quantity}`}</Td>
              <Td><StatusPill status={r.payment_status} /></Td>
              <Td className="text-xs text-muted-foreground">{new Date(r.created_at).toLocaleDateString()}</Td>
              <Td>
                <select
                  value={r.payment_status}
                  onChange={(e) => updateStatus(r.id, e.target.value)}
                  className="text-xs bg-transparent border border-border px-2 py-1"
                >
                  <option value="pending">pending</option>
                  <option value="paid">paid</option>
                  <option value="failed">failed</option>
                  <option value="refunded">refunded</option>
                </select>
              </Td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/* ---------------- Volunteers ---------------- */
type VolunteerRow = {
  id: string; full_name: string; email: string; phone: string;
  role: string; experience: string | null; availability: string | null; note: string | null;
  status: string; created_at: string;
};
function VolunteersTable() {
  const { rows, refresh } = useRows<VolunteerRow>("volunteer_applications");
  const updateStatus = async (id: string, status: string) => {
    const st = status as "new" | "reviewing" | "accepted" | "declined";
    await supabase.from("volunteer_applications").update({ status: st }).eq("id", id);
    refresh();
  };
  if (!rows) return <p className="text-muted-foreground text-sm">Loading…</p>;
  if (rows.length === 0) return <EmptyState label="volunteer applications" />;
  return (
    <div className="space-y-4">
      {rows.map((r) => (
        <article key={r.id} className="border border-border p-6 grid gap-6 md:grid-cols-[1.5fr_2fr_auto]">
          <div>
            <p className="font-display text-lg">{r.full_name}</p>
            <p className="text-xs text-muted-foreground">{r.email}</p>
            <p className="text-xs text-muted-foreground">{r.phone}</p>
            <p className="mt-3 text-[10px] uppercase tracking-[0.25em] text-red">{r.role}</p>
          </div>
          <div className="text-sm text-ink/80 space-y-2">
            {r.availability && <p><span className="text-muted-foreground text-xs uppercase tracking-wider">Availability:</span> {r.availability}</p>}
            {r.experience && <p><span className="text-muted-foreground text-xs uppercase tracking-wider">Experience:</span> {r.experience}</p>}
            {r.note && <p className="italic text-ink/60">"{r.note}"</p>}
          </div>
          <div className="flex flex-col gap-2 items-start md:items-end">
            <StatusPill status={r.status} />
            <select value={r.status} onChange={(e) => updateStatus(r.id, e.target.value)} className="text-xs bg-transparent border border-border px-2 py-1">
              <option value="new">new</option>
              <option value="reviewing">reviewing</option>
              <option value="accepted">accepted</option>
              <option value="declined">declined</option>
            </select>
            <span className="text-[10px] text-muted-foreground">{new Date(r.created_at).toLocaleDateString()}</span>
          </div>
        </article>
      ))}
    </div>
  );
}

/* ---------------- Partners ---------------- */
type PartnerRow = {
  id: string; organisation: string; contact_name: string; email: string; phone: string | null;
  tier: string; note: string | null; status: string; created_at: string;
};
function PartnersTable() {
  const { rows, refresh } = useRows<PartnerRow>("partner_inquiries");
  const updateStatus = async (id: string, status: string) => {
    const st = status as "new" | "reviewing" | "accepted" | "declined";
    await supabase.from("partner_inquiries").update({ status: st }).eq("id", id);
    refresh();
  };
  if (!rows) return <p className="text-muted-foreground text-sm">Loading…</p>;
  if (rows.length === 0) return <EmptyState label="partner inquiries" />;
  return (
    <div className="space-y-4">
      {rows.map((r) => (
        <article key={r.id} className="border border-border p-6 grid gap-6 md:grid-cols-[1.5fr_2fr_auto]">
          <div>
            <p className="font-display text-lg">{r.organisation}</p>
            <p className="text-sm text-ink/70">{r.contact_name}</p>
            <p className="text-xs text-muted-foreground">{r.email}{r.phone ? ` · ${r.phone}` : ""}</p>
            <p className="mt-3 text-[10px] uppercase tracking-[0.25em] text-red">{r.tier}</p>
          </div>
          <div className="text-sm text-ink/80">
            {r.note && <p className="italic text-ink/60">"{r.note}"</p>}
          </div>
          <div className="flex flex-col gap-2 items-start md:items-end">
            <StatusPill status={r.status} />
            <select value={r.status} onChange={(e) => updateStatus(r.id, e.target.value)} className="text-xs bg-transparent border border-border px-2 py-1">
              <option value="new">new</option>
              <option value="reviewing">reviewing</option>
              <option value="accepted">accepted</option>
              <option value="declined">declined</option>
            </select>
            <span className="text-[10px] text-muted-foreground">{new Date(r.created_at).toLocaleDateString()}</span>
          </div>
        </article>
      ))}
    </div>
  );
}

/* ---------------- Donations ---------------- */
type DonationRow = {
  id: string; donor_name: string; email: string; phone: string | null;
  amount_naira: number; tier: string | null; message: string | null;
  payment_status: string; created_at: string;
};
function DonationsTable() {
  const { rows, refresh } = useRows<DonationRow>("donations");
  const updateStatus = async (id: string, payment_status: string) => {
    const ps = payment_status as "pending" | "paid" | "failed" | "refunded";
    await supabase.from("donations").update({ payment_status: ps }).eq("id", id);
    refresh();
  };
  if (!rows) return <p className="text-muted-foreground text-sm">Loading…</p>;
  if (rows.length === 0) return <EmptyState label="donations" />;
  return (
    <div className="border border-border overflow-x-auto">
      <table className="w-full text-sm">
        <thead className="bg-muted">
          <tr className="text-left text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
            <Th>Donor</Th><Th>Amount</Th><Th>Tier</Th><Th>Message</Th><Th>Status</Th><Th>Date</Th><Th>Action</Th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.id} className="border-t border-border align-top">
              <Td>
                <div className="font-medium">{r.donor_name}</div>
                <div className="text-xs text-muted-foreground">{r.email}{r.phone ? ` · ${r.phone}` : ""}</div>
              </Td>
              <Td className="font-display">₦{r.amount_naira.toLocaleString()}</Td>
              <Td className="text-xs">{r.tier ?? "—"}</Td>
              <Td className="max-w-xs text-xs italic text-ink/60">{r.message ?? "—"}</Td>
              <Td><StatusPill status={r.payment_status} /></Td>
              <Td className="text-xs text-muted-foreground">{new Date(r.created_at).toLocaleDateString()}</Td>
              <Td>
                <select value={r.payment_status} onChange={(e) => updateStatus(r.id, e.target.value)} className="text-xs bg-transparent border border-border px-2 py-1">
                  <option value="pending">pending</option>
                  <option value="paid">paid</option>
                  <option value="failed">failed</option>
                  <option value="refunded">refunded</option>
                </select>
              </Td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function Th({ children }: { children: React.ReactNode }) { return <th className="px-4 py-3">{children}</th>; }
function Td({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <td className={`px-4 py-4 ${className}`}>{children}</td>;
}
