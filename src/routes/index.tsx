import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useScroll, useSpring, useInView } from "framer-motion";
import { SiteLayout } from "@/components/site-layout";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "TEDxOrileIganmu · Beyond Boundaries" },
      { name: "description", content: "Beyond Boundaries · An independently TED-licensed event. 6 March 2027, Rita Lori Event Centre, 1 Taoridi St, Surulere, Lagos 101211. One hundred seats." },
      { property: "og:title", content: "TEDxOrileIganmu · Beyond Boundaries" },
      { property: "og:description", content: "6 March 2027 · Surulere, Lagos. Ideas that transcend place, perspective, and possibility." },
    ],
  }),
  component: HomePage,
});

const ease = [0.22, 1, 0.36, 1] as const;

/* ─── Animated counter ──────────────────────────────────────────────────── */
function AnimatedCounter({ end, label }: { end: number; label: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  useEffect(() => {
    if (!inView) return;
    let startTime: number;
    let rafId: number;
    const duration = 1200;
    const step = (ts: number) => {
      if (!startTime) startTime = ts;
      const progress = Math.min((ts - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.round(eased * end));
      if (progress < 1) rafId = requestAnimationFrame(step);
    };
    rafId = requestAnimationFrame(step);
    return () => cancelAnimationFrame(rafId);
  }, [inView, end]);

  return (
    <div ref={ref}>
      <p className="font-display font-medium text-3xl md:text-5xl tracking-[-0.03em] text-white tabular-nums">{count}</p>
      <p className="mt-1 text-[10px] uppercase tracking-[0.3em] text-white/40">{label}</p>
    </div>
  );
}

/* ─── Countdown ─────────────────────────────────────────────────────────── */
const EVENT_DATE = new Date("2027-03-06T08:30:00+01:00");

function useCountdown() {
  const calc = () => {
    const diff = EVENT_DATE.getTime() - Date.now();
    if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 };
    return {
      days: Math.floor(diff / 86400000),
      hours: Math.floor((diff % 86400000) / 3600000),
      minutes: Math.floor((diff % 3600000) / 60000),
      seconds: Math.floor((diff % 60000) / 1000),
    };
  };
  const [time, setTime] = useState(calc);
  useEffect(() => {
    const id = setInterval(() => setTime(calc()), 1000);
    return () => clearInterval(id);
  }, []);
  return time;
}

function CountdownCard() {
  const { days, hours, minutes, seconds } = useCountdown();
  return (
    <div className="bg-ink border border-white/10 p-6 md:p-8">
      <div className="absolute top-0 left-0 h-[2px] w-12 bg-red" />
      <p className="text-[9px] uppercase tracking-[0.3em] text-white/30 mb-6">Countdown to event</p>
      {/* Days — big */}
      <div className="mb-6 pb-6 border-b border-white/10">
        <p className="font-display font-medium text-[clamp(3.5rem,8vw,5.5rem)] leading-none tracking-[-0.04em] text-white tabular-nums">
          {String(days).padStart(3, "0")}
        </p>
        <p className="text-[9px] uppercase tracking-[0.35em] text-white/30 mt-2">Days remaining</p>
      </div>
      {/* Hours · Mins · Secs */}
      <div className="grid grid-cols-3 gap-3">
        {[{ v: hours, l: "Hrs" }, { v: minutes, l: "Min" }, { v: seconds, l: "Sec" }].map(({ v, l }) => (
          <div key={l} className="bg-white/5 px-3 py-3 text-center">
            <p className="font-display font-medium text-xl tracking-[-0.02em] tabular-nums text-white">{String(v).padStart(2, "0")}</p>
            <p className="text-[8px] uppercase tracking-[0.25em] text-white/30 mt-1">{l}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── Scroll progress ───────────────────────────────────────────────────── */
function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 200, damping: 30 });
  return (
    <motion.div
      className="fixed top-0 left-0 right-0 z-[60] h-[2px] bg-red origin-left pointer-events-none"
      style={{ scaleX }}
    />
  );
}

/* ─── Explainer scenes ───────────────────────────────────────────────────── */

const EXPLAINER_SCENES = [
  { id: "event",     label: "The Event",    duration: 7000 },
  { id: "ticket",    label: "Get a Ticket", duration: 10000 },
  { id: "volunteer", label: "Volunteer",    duration: 10000 },
] as const;

function EventScene() {
  return (
    <div className="max-w-2xl">
      <motion.p initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, delay: 0.1 }}
        className="text-[9px] uppercase tracking-[0.3em] text-red mb-5">
        TEDxOrileIganmu · Beyond Boundaries
      </motion.p>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.25 }}
        className="font-display font-medium text-[clamp(1.8rem,5vw,4.5rem)] tracking-[-0.04em] leading-[0.88] mb-10">
        One day.<br/>
        <span className="font-serif italic font-normal text-red">One hundred seats.</span>
      </motion.div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-5 md:gap-8">
        {[
          { label: "Date",     value: "6 March 2027" },
          { label: "Venue",    value: "Rita Lori Event Centre, Surulere" },
          { label: "Capacity", value: "100 seats only" },
          { label: "Theme",    value: "Beyond Boundaries" },
        ].map(({ label, value }, i) => (
          <motion.div key={label} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.5 + i * 0.1 }}>
            <p className="text-[9px] uppercase tracking-[0.2em] text-white/30 mb-1.5">{label}</p>
            <p className="text-sm font-semibold tracking-[-0.01em] text-white">{value}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

const TICKET_STEPS = [
  { n: "01", title: "Visit the website",      body: 'Go to tedxorileiganmu.xyz and click "Get Tickets →" in the top navigation.' },
  { n: "02", title: "Choose your tier",       body: "Regular (₦3,500) or Standard (₦5,000). Enter your name, email, and phone." },
  { n: "03", title: "Pay via Paystack",       body: "Card, bank transfer, or USSD — takes under two minutes to complete." },
  { n: "04", title: "Get your confirmation",  body: "Your ticket arrives instantly by email. Bring it to the door on 6 March." },
];

function TicketScene() {
  return (
    <div>
      <motion.p initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
        className="text-[9px] uppercase tracking-[0.3em] text-red mb-4">
        Attending
      </motion.p>
      <motion.p initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="font-display font-medium text-[clamp(1.4rem,3vw,2.4rem)] tracking-[-0.03em] mb-8 text-white">
        How to get your ticket
      </motion.p>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-5 md:gap-8">
        {TICKET_STEPS.map(({ n, title, body }, i) => (
          <motion.div key={n} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.35 + i * 0.18 }}>
            <p className="text-red text-[10px] tracking-[0.15em] font-semibold mb-2.5">{n}</p>
            <p className="text-[13px] font-semibold mb-1.5 leading-snug">{title}</p>
            <p className="text-[11px] text-white/40 leading-relaxed">{body}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

const VOLUNTEER_STEPS = [
  { n: "01", title: "Visit the volunteer page",  body: "Head to tedxorileiganmu.xyz/volunteer to find the application form." },
  { n: "02", title: "Fill in your application",  body: "Share who you are, your skills, and why you want to be part of TEDxOrileIganmu." },
  { n: "03", title: "We review & reach out",     body: "Every application is reviewed. Selected volunteers get a confirmation email." },
  { n: "04", title: "Join the volunteer group",  body: "Approved volunteers are invited to our private WhatsApp group for pre-event updates." },
];

function VolunteerScene() {
  return (
    <div>
      <motion.p initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
        className="text-[9px] uppercase tracking-[0.3em] text-red mb-4">
        Volunteering
      </motion.p>
      <motion.p initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="font-display font-medium text-[clamp(1.4rem,3vw,2.4rem)] tracking-[-0.03em] mb-8 text-white">
        How to register as a volunteer
      </motion.p>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-5 md:gap-8">
        {VOLUNTEER_STEPS.map(({ n, title, body }, i) => (
          <motion.div key={n} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.35 + i * 0.18 }}>
            <p className="text-red text-[10px] tracking-[0.15em] font-semibold mb-2.5">{n}</p>
            <p className="text-[13px] font-semibold mb-1.5 leading-snug">{title}</p>
            <p className="text-[11px] text-white/40 leading-relaxed">{body}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function ExplainerSection() {
  const [scene, setScene] = useState(0);
  const [playing, setPlaying] = useState(true);
  const progRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLDivElement>(null);
  const inView = useInView(sectionRef, { margin: "-100px" });

  useEffect(() => {
    if (!playing || !inView) return;
    const duration = EXPLAINER_SCENES[scene].duration;
    const start = performance.now();
    let rafId: number;

    if (progRef.current) progRef.current.style.width = "0%";

    const tick = (now: number) => {
      const pct = Math.min((now - start) / duration, 1);
      if (progRef.current) progRef.current.style.width = `${pct * 100}%`;
      if (pct < 1) {
        rafId = requestAnimationFrame(tick);
      } else {
        setScene(s => (s + 1) % EXPLAINER_SCENES.length);
      }
    };
    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, [scene, playing, inView]);

  return (
    <section ref={sectionRef} className="bg-ink text-white border-t border-white/8">
      <div className="mx-auto max-w-7xl px-6 md:px-10 py-20 md:py-28">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, ease }}
        >
          <div className="flex items-center gap-3 text-[9px] uppercase tracking-[0.3em] text-white/30 mb-10">
            <span className="h-px w-6 bg-red shrink-0" />
            <span>How It Works</span>
          </div>

          {/* Player */}
          <div className="relative bg-[#080808] border border-white/6 overflow-hidden min-h-[320px] md:min-h-[420px]">

            {/* Grid texture */}
            <div className="absolute inset-0 pointer-events-none opacity-[0.04]"
              style={{ backgroundImage: "linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)", backgroundSize: "72px 72px" }} />

            {/* Scenes */}
            <AnimatePresence mode="wait">
              <motion.div
                key={scene}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.4 }}
                className="absolute inset-0 p-7 md:p-12 pb-16 flex flex-col justify-center"
              >
                {scene === 0 && <EventScene />}
                {scene === 1 && <TicketScene />}
                {scene === 2 && <VolunteerScene />}
              </motion.div>
            </AnimatePresence>

            {/* Controls bar */}
            <div className="absolute bottom-0 left-0 right-0">
              <div className="h-[2px] bg-white/8">
                <div ref={progRef} className="h-full bg-red" style={{ width: "0%" }} />
              </div>
              <div className="flex items-center gap-5 px-5 py-2.5 bg-black/60 backdrop-blur-sm">
                {EXPLAINER_SCENES.map((s, i) => (
                  <button key={s.id} onClick={() => setScene(i)}
                    className={`flex items-center gap-1.5 text-[9px] uppercase tracking-[0.2em] transition-colors ${scene === i ? "text-white" : "text-white/25 hover:text-white/55"}`}>
                    {scene === i && <span className="w-1 h-1 bg-red rounded-full shrink-0" />}
                    {s.label}
                  </button>
                ))}
                <button onClick={() => setPlaying(p => !p)}
                  className="ml-auto text-white/35 hover:text-white/80 transition-colors"
                  aria-label={playing ? "Pause" : "Play"}>
                  {playing ? (
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="currentColor">
                      <rect x="2" y="1" width="3.5" height="12" rx="0.5"/>
                      <rect x="8.5" y="1" width="3.5" height="12" rx="0.5"/>
                    </svg>
                  ) : (
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="currentColor">
                      <path d="M3 1.5l10 5.5-10 5.5z"/>
                    </svg>
                  )}
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

/* ─── Stats ──────────────────────────────────────────────────────────────── */

const STATS = [
  { value: "100", label: "Seats", animate: true, num: 100 },
  { value: "1", label: "Day", animate: false },
  { value: "Mar", label: "2027", animate: false },
  { value: "LOS", label: "Lagos", animate: false },
];

function HomePage() {
  return (
    <SiteLayout>
      <ScrollProgress />

      {/* ── HERO ──────────────────────────────────────────────────────────── */}
      <section className="relative bg-paper overflow-hidden min-h-[calc(100svh-90px)] flex flex-col">

        {/* Faint grid texture */}
        <div
          className="absolute inset-0 pointer-events-none opacity-[0.025]"
          style={{
            backgroundImage: "linear-gradient(rgba(0,0,0,1) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,1) 1px, transparent 1px)",
            backgroundSize: "80px 80px",
          }}
        />

        {/* Decorative vertical text — right */}
        <div className="absolute right-4 md:right-8 top-0 bottom-0 hidden lg:flex items-center pointer-events-none select-none z-10">
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.2, ease, delay: 1.2 }}
            className="text-[8px] uppercase text-ink/10 whitespace-nowrap"
            style={{ writingMode: "vertical-rl", letterSpacing: "0.55em" }}
          >
            Beyond Boundaries · Ideas Worth Spreading · TEDxOrileIganmu · Vol. 01
          </motion.span>
        </div>

        {/* Red left accent */}
        <motion.div
          initial={{ scaleY: 0 }}
          animate={{ scaleY: 1 }}
          transition={{ duration: 0.9, ease, delay: 0.2 }}
          className="absolute left-0 top-0 bottom-0 w-[3px] bg-red origin-top hidden md:block"
        />

        <div className="relative mx-auto max-w-7xl px-6 md:px-10 lg:px-16 flex-1 flex flex-col justify-between py-12 md:py-20">

          {/* Top kicker row */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease }}
            className="flex flex-col gap-1.5"
          >
            <div className="flex items-center gap-3 text-[9px] uppercase tracking-[0.3em] text-red">
              <span className="h-px w-8 bg-red shrink-0" />
              <span>Independently organised · TED licensed</span>
            </div>
            <div className="flex items-center gap-3 text-[9px] uppercase tracking-[0.22em] text-ink/30">
              <span className="h-px w-8 bg-ink/15 shrink-0" />
              <span>Theme · Beyond Boundaries</span>
            </div>
          </motion.div>

          {/* Main content grid */}
          <div className="mt-12 md:mt-0 grid gap-12 md:grid-cols-[1fr_380px] md:gap-16 lg:gap-24 items-center flex-1 md:py-8">

            {/* Left: headline */}
            <div>
              <h1 className="font-display font-medium tracking-[-0.045em] leading-[0.87] text-[clamp(3.5rem,11vw,10rem)]">
                {["Ideas", "Worth", "Spreading."].map((w, i) => (
                  <motion.span
                    key={w}
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.75, ease, delay: 0.15 + i * 0.08 }}
                    className="block"
                  >
                    {w === "Spreading." ? (
                      <>Spreading<span className="text-red">.</span></>
                    ) : w}
                  </motion.span>
                ))}
              </h1>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, ease, delay: 0.5 }}
                className="mt-10 md:mt-14 flex flex-col gap-4"
              >
                <div className="flex items-baseline gap-4 flex-wrap">
                  <span className="text-[9px] uppercase tracking-[0.3em] text-red">Saturday</span>
                  <span className="font-display text-2xl md:text-3xl tracking-[-0.025em] font-medium">6 March 2027</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-[9px] uppercase tracking-[0.25em] text-muted-foreground">Venue</span>
                  <span className="h-px w-4 bg-border shrink-0" />
                  <a
                    href="https://www.google.com/maps/dir/?api=1&destination=Rita+Lori+Event+Centre,+1+Taoridi+St,+Surulere,+Lagos+101211,+Nigeria"
                    target="_blank" rel="noreferrer"
                    className="font-serif italic text-lg text-ink/60 hover:text-red transition-colors"
                  >
                    Rita Lori Event Centre, Surulere →
                  </a>
                </div>
                <p className="text-[10px] uppercase tracking-[0.2em] text-ink/30 font-serif italic">
                  Ideas that transcend place, perspective, and possibility.
                </p>
              </motion.div>
            </div>

            {/* Right: countdown + CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease, delay: 0.4 }}
              className="flex flex-col gap-4 relative"
            >
              <CountdownCard />
              <Link
                to="/tickets"
                className="group relative inline-flex items-center justify-center bg-red text-white px-8 py-4 text-[10px] uppercase tracking-[0.25em] overflow-hidden"
              >
                <span className="absolute inset-0 bg-ink translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]" />
                <span className="relative">Reserve a Seat →</span>
              </Link>
              <Link
                to="/volunteer"
                className="group relative inline-flex items-center justify-center border border-ink text-ink px-8 py-4 text-[10px] uppercase tracking-[0.25em] overflow-hidden"
              >
                <span className="absolute inset-0 bg-ink translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]" />
                <span className="relative group-hover:text-white transition-colors">Volunteer · Partner</span>
              </Link>
            </motion.div>
          </div>

          {/* Bottom: vol / issue label */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, ease, delay: 0.9 }}
            className="flex items-center justify-between pt-6 border-t border-border"
          >
            <span className="text-[9px] uppercase tracking-[0.3em] text-ink/25">Vol. 01 · 2027</span>
            <span className="text-[9px] uppercase tracking-[0.3em] text-ink/25">Orile Iganmu · Lagos · Nigeria</span>
          </motion.div>
        </div>
      </section>

      {/* ── STATS STRIP ───────────────────────────────────────────────────── */}
      <div className="border-y border-border bg-ink text-white">
        <div className="mx-auto max-w-7xl px-6 md:px-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-white/8">
            {STATS.map((s, i) => (
              <motion.div
                key={s.label}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease, delay: 0.7 + i * 0.06 }}
                className="bg-ink px-6 md:px-10 py-8 md:py-12 group hover:bg-white/5 transition-colors"
              >
                {s.animate && s.num ? (
                  <AnimatedCounter end={s.num} label={s.label} />
                ) : (
                  <>
                    <p className="font-display font-medium text-3xl md:text-5xl tracking-[-0.03em] text-white group-hover:text-red transition-colors">{s.value}</p>
                    <p className="mt-1 text-[10px] uppercase tracking-[0.3em] text-white/35">{s.label}</p>
                  </>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* ── MARQUEE ───────────────────────────────────────────────────────── */}
      <div className="border-b border-border bg-paper overflow-hidden">
        <motion.div
          animate={{ x: ["0%", "-50%"] }}
          transition={{ duration: 42, repeat: Infinity, ease: "linear" }}
          className="flex whitespace-nowrap py-4 text-[9px] uppercase tracking-[0.3em] text-muted-foreground"
        >
          {Array.from({ length: 2 }).map((_, k) => (
            <div key={k} className="flex shrink-0 gap-12 pr-12">
              {["Vol. 01 · 2027", "Surulere, Lagos", "100 Seats Only", "6 March 2027", "Beyond Boundaries", "Ideas Worth Spreading", "From Orile, to the World"].map((s, i) => (
                <span key={`${k}-${i}`} className="flex items-center gap-12">
                  <span className="text-red">◆</span>{s}
                </span>
              ))}
            </div>
          ))}
        </motion.div>
      </div>

      {/* ── SECTION CARDS ─────────────────────────────────────────────────── */}
      <section className="bg-ink text-white">
        <div className="mx-auto max-w-7xl px-6 md:px-10 py-20 md:py-32">
          <div className="flex items-center gap-3 text-[9px] uppercase tracking-[0.3em] text-white/30 mb-12">
            <span className="h-px w-6 bg-red shrink-0" />
            <span>Explore</span>
          </div>
          <div className="grid gap-px md:grid-cols-3 bg-white/8 border border-white/8">
            {[
              { to: "/about", n: "01", t: "Why this exists.", d: "A Lagos stage for Nigerian ideas told on their own terms. Small room, long echo." },
              { to: "/speakers", n: "02", t: "Who's in the room.", d: "A small, deliberate cast. Lineup unfolding through the year." },
              { to: "/tickets", n: "03", t: "One day. One seat.", d: "₦3,500 – ₦10,000. Limited to one hundred people. No exceptions." },
            ].map((c, i) => (
              <motion.div
                key={c.to}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.6, ease, delay: i * 0.1 }}
              >
                <Link to={c.to} className="group block bg-ink p-8 md:p-10 lg:p-12 h-full relative overflow-hidden">
                  <div className="absolute top-0 left-0 h-[2px] w-0 bg-red group-hover:w-full transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]" />
                  <span className="absolute inset-0 bg-white/4 translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]" />
                  <p className="relative text-[9px] uppercase tracking-[0.35em] text-white/20 mb-10">{c.n}</p>
                  <h2 className="relative font-display text-2xl md:text-3xl tracking-[-0.02em] font-medium group-hover:text-red transition-colors duration-300 leading-tight">{c.t}</h2>
                  <p className="relative mt-4 text-sm text-white/45 leading-relaxed">{c.d}</p>
                  <span className="relative mt-10 inline-flex items-center gap-2 text-[9px] uppercase tracking-[0.3em] text-white/30 group-hover:text-red transition-colors duration-300">
                    Explore <span className="transition-transform group-hover:translate-x-1.5 duration-300">→</span>
                  </span>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <ExplainerSection />

      {/* ── PULL QUOTE ────────────────────────────────────────────────────── */}
      <section className="bg-paper border-t border-border py-24 md:py-44 relative overflow-hidden">
        {/* Giant decorative quote mark */}
        <div className="absolute top-0 left-6 md:left-10 font-serif text-[20rem] leading-none text-ink/[0.03] select-none pointer-events-none">
          "
        </div>
        <div className="relative mx-auto max-w-5xl px-6 md:px-10 text-center">
          <motion.blockquote
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-120px" }}
            transition={{ duration: 0.9, ease }}
            className="font-serif italic font-light text-[clamp(1.9rem,4.5vw,3.75rem)] leading-[1.07] tracking-[-0.01em]"
          >
            "Orile Iganmu is small on the map.{" "}
            <span className="text-red not-italic font-normal">The ideas are not.</span>"
          </motion.blockquote>
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease, delay: 0.3 }}
            className="mt-10 flex items-center justify-center gap-4"
          >
            <span className="h-px w-10 bg-red" />
            <p className="text-[9px] uppercase tracking-[0.3em] text-muted-foreground">Ekanem Michael · Curator</p>
          </motion.div>
        </div>
      </section>

      {/* ── THEME REVEAL ──────────────────────────────────────────────────── */}
      <section className="bg-ink text-white border-t border-white/8 overflow-hidden">
        <div className="mx-auto max-w-7xl px-6 md:px-10 py-20 md:py-28">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.7, ease }}
          >
            <p className="text-[9px] uppercase tracking-[0.35em] text-white/25 mb-6">Theme · 2027</p>
            <h2 className="font-display font-medium text-[clamp(3rem,10vw,9rem)] tracking-[-0.045em] leading-[0.87]">
              Beyond{" "}
              <span className="font-serif italic font-normal text-red">Boundaries.</span>
            </h2>
            <p className="mt-8 font-serif italic text-lg md:text-xl text-white/40 max-w-lg leading-relaxed">
              Ideas that transcend place, perspective, and possibility.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ── VOLUNTEER CTA ─────────────────────────────────────────────────── */}
      <section className="bg-red text-white">
        <div className="mx-auto max-w-7xl px-6 md:px-10 py-20 md:py-28">
          <div className="grid gap-10 grid-cols-1 md:grid-cols-[1fr_auto] items-center">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.6, ease }}
            >
              <p className="text-[9px] uppercase tracking-[0.3em] text-white/50 mb-5">Join the crew</p>
              <h2 className="font-display font-medium text-[clamp(2.5rem,6vw,5rem)] tracking-[-0.035em] leading-[0.9]">
                Help us build<br/>the room.
              </h2>
              <p className="mt-5 font-serif italic text-lg text-white/70 max-w-lg leading-relaxed">
                Twelve roles. One day. A chance to be on the inside of something Lagos will remember.
              </p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.6, ease, delay: 0.1 }}
            >
              <Link
                to="/volunteer"
                className="group relative inline-flex items-center justify-center bg-white text-red px-10 py-5 text-[10px] uppercase tracking-[0.25em] overflow-hidden w-full md:w-auto shrink-0"
              >
                <span className="absolute inset-0 bg-ink translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]" />
                <span className="relative group-hover:text-white transition-colors duration-300">Apply to Volunteer →</span>
              </Link>
            </motion.div>
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}
