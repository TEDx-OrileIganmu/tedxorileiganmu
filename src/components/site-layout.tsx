import { Link } from "@tanstack/react-router";
import { useState, type ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";
import logoBlack from "@/assets/logo-black.png.asset.json";
import logoWhite from "@/assets/logo-white.png.asset.json";

const NAV = [
  { to: "/", label: "Home", n: "01" },
  { to: "/about", label: "About", n: "02" },
  { to: "/speakers", label: "Speakers", n: "03" },
  { to: "/tickets", label: "Tickets", n: "04" },
  { to: "/volunteer", label: "Volunteer", n: "05" },
  { to: "/support", label: "Support", n: "06" },
  { to: "/dp", label: "Get a DP", n: "07" },
] as const;

export function SiteLayout({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-paper text-ink">
      {/* Announcement strip */}
      <div className="bg-red text-white overflow-hidden">
        <motion.div
          animate={{ x: ["0%", "-50%"] }}
          transition={{ duration: 28, repeat: Infinity, ease: "linear" }}
          className="flex whitespace-nowrap py-2.5 text-[9px] uppercase tracking-[0.28em]"
        >
          {Array.from({ length: 2 }).map((_, k) => (
            <div key={k} className="flex shrink-0 gap-10 pr-10 items-center">
              {["6 March 2027", "The Stable · Surulere", "Beyond Boundaries", "100 Seats Only", "TED Licensed", "Orile Iganmu · Lagos"].map((s, i) => (
                <span key={`${k}-${i}`} className="flex items-center gap-10">
                  <span className="opacity-50">◆</span>{s}
                </span>
              ))}
            </div>
          ))}
        </motion.div>
      </div>

      {/* Sticky nav */}
      <header className="sticky top-0 z-30 bg-paper/96 backdrop-blur-md border-b border-border">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 md:px-10 md:py-5 gap-6">
          <Link to="/" className="block shrink-0" onClick={() => setOpen(false)}>
            <img src={logoBlack.url} alt="TEDxOrileIganmu" className="h-6 md:h-7 w-auto" />
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-7 text-[10px] uppercase tracking-[0.2em] text-ink/50">
            {NAV.map((n) => (
              <Link
                key={n.to}
                to={n.to}
                activeOptions={{ exact: n.to === "/" }}
                activeProps={{ className: "!text-red" }}
                className="relative hover:text-ink transition-colors duration-200 group"
              >
                {n.label}
                <span className="absolute -bottom-1 left-0 h-px w-0 bg-red group-hover:w-full transition-all duration-300" />
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <Link
              to="/tickets"
              className="hidden md:inline-flex group relative items-center justify-center bg-red text-white px-5 py-2.5 text-[10px] uppercase tracking-[0.2em] overflow-hidden shrink-0"
            >
              <span className="absolute inset-0 bg-ink translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]" />
              <span className="relative">Get Tickets →</span>
            </Link>
            <button
              aria-label={open ? "Close menu" : "Open menu"}
              onClick={() => setOpen((v) => !v)}
              className="md:hidden w-10 h-10 flex flex-col items-center justify-center gap-[5px] group"
            >
              <span className={`block h-px bg-ink transition-all duration-300 origin-center ${open ? "w-5 rotate-45 translate-y-[6px]" : "w-5"}`} />
              <span className={`block h-px bg-ink transition-all duration-300 ${open ? "w-0 opacity-0" : "w-4"}`} />
              <span className={`block h-px bg-ink transition-all duration-300 origin-center ${open ? "w-5 -rotate-45 -translate-y-[6px]" : "w-5"}`} />
            </button>
          </div>
        </div>
      </header>

      {/* Full-screen mobile menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-20 bg-ink flex flex-col"
          >
            <div className="absolute top-0 left-0 h-[3px] w-full bg-red" />
            <div className="flex-1 flex flex-col justify-center px-8 py-24">
              <nav className="flex flex-col gap-1">
                {NAV.map((n, i) => (
                  <motion.div
                    key={n.to}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4, delay: i * 0.06, ease: [0.22, 1, 0.36, 1] }}
                  >
                    <Link
                      to={n.to}
                      onClick={() => setOpen(false)}
                      activeOptions={{ exact: n.to === "/" }}
                      activeProps={{ className: "!text-red" }}
                      className="group flex items-baseline gap-4 py-3 border-b border-white/10 last:border-b-0 hover:text-red transition-colors duration-200"
                    >
                      <span className="text-[9px] uppercase tracking-[0.3em] text-white/25 w-6 shrink-0">{n.n}</span>
                      <span className="font-display text-[clamp(1.8rem,6vw,3rem)] font-medium tracking-[-0.02em] leading-none text-white group-hover:text-red transition-colors">
                        {n.label}
                      </span>
                      <span className="ml-auto text-white/20 group-hover:text-red group-hover:translate-x-1 transition-all">→</span>
                    </Link>
                  </motion.div>
                ))}
              </nav>
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.4 }}
                className="mt-10"
              >
                <Link
                  to="/tickets"
                  onClick={() => setOpen(false)}
                  className="inline-flex items-center justify-center bg-red text-white px-8 py-4 text-[10px] uppercase tracking-[0.25em] w-full"
                >
                  Reserve Your Seat →
                </Link>
              </motion.div>
            </div>
            <div className="px-8 pb-10">
              <p className="text-[9px] uppercase tracking-[0.3em] text-white/20">6 March 2027 · The Stable · Surulere, Lagos</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <main className="flex-1">{children}</main>
      <SiteFooter />
    </div>
  );
}

export function SectionHeader({ kicker, title, lede }: { kicker: string; title: ReactNode; lede?: string }) {
  return (
    <div className="relative bg-ink text-white overflow-hidden">
      {/* Subtle grid */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.03]"
        style={{
          backgroundImage: "linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)",
          backgroundSize: "80px 80px",
        }}
      />
      <div className="relative mx-auto max-w-7xl px-6 md:px-10 pt-20 md:pt-32 pb-20 md:pb-28">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="flex items-center gap-3 text-[10px] uppercase tracking-[0.3em] text-red mb-8"
        >
          <span className="h-px w-8 bg-red" />
          <span>{kicker}</span>
        </motion.div>
        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: 0.05 }}
          className="font-display font-medium tracking-[-0.03em] leading-[0.92] text-[clamp(3rem,9vw,7rem)] max-w-4xl text-white"
        >
          {title}
        </motion.h1>
        {lede && (
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: 0.15 }}
            className="mt-8 font-serif italic text-xl md:text-2xl text-white/50 max-w-2xl leading-snug"
          >
            {lede}
          </motion.p>
        )}
      </div>
      <div className="h-px bg-white/10" />
    </div>
  );
}

function SiteFooter() {
  return (
    <footer className="bg-ink text-white">
      {/* Pre-footer CTA */}
      <div className="border-b border-white/10 relative overflow-hidden">
        <div className="absolute top-0 left-0 h-[3px] w-full bg-red" />
        <div className="mx-auto max-w-7xl px-6 md:px-10 py-20 md:py-28 flex flex-col md:flex-row md:items-end justify-between gap-8">
          <div>
            <p className="text-[10px] uppercase tracking-[0.3em] text-white/30 mb-5">6 March 2027 · Surulere, Lagos</p>
            <h2 className="font-display font-medium tracking-[-0.04em] leading-[0.88] text-[clamp(2.5rem,7vw,5.5rem)] text-white">
              One day.<br />
              <span className="font-serif italic font-normal text-red">One hundred seats.</span>
            </h2>
          </div>
          <Link
            to="/tickets"
            className="group relative inline-flex items-center justify-center bg-red text-white px-10 py-5 text-[10px] uppercase tracking-[0.25em] overflow-hidden shrink-0"
          >
            <span className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]" />
            <span className="relative">Reserve a Seat →</span>
          </Link>
        </div>
      </div>

      {/* Footer grid */}
      <div className="mx-auto max-w-7xl px-6 md:px-10 py-16 md:py-20">
        <div className="grid gap-10 grid-cols-2 md:grid-cols-[1.8fr_1fr_1fr_1fr]">
          <div className="col-span-2 md:col-span-1">
            <img src={logoWhite.url} alt="TEDxOrileIganmu" className="h-7 w-auto" />
            <p className="mt-6 font-serif italic text-white/40 max-w-xs leading-relaxed text-sm">
              From Orile, to the world.
            </p>
            <div className="mt-6 flex items-center gap-3">
              <a href="https://instagram.com/tedxorileiganmu" target="_blank" rel="noreferrer" title="Instagram" className="opacity-80 hover:opacity-100 transition-opacity">
                <img src="/icon-instagram.svg" alt="Instagram" width="32" height="32" />
              </a>
              <a href="https://tedxorileiganmu.xyz" target="_blank" rel="noreferrer" title="Website" className="opacity-80 hover:opacity-100 transition-opacity">
                <img src="/icon-website.svg" alt="Website" width="32" height="32" />
              </a>
            </div>
          </div>
          <div>
            <p className="text-[9px] uppercase tracking-[0.3em] text-white/25 mb-5">Navigate</p>
            <ul className="space-y-2.5">
              {NAV.map((n) => (
                <li key={n.to}>
                  <Link to={n.to} className="text-[11px] text-white/60 hover:text-red transition-colors">{n.label}</Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="text-[9px] uppercase tracking-[0.3em] text-white/25 mb-5">Event</p>
            <ul className="space-y-2.5 text-[11px] text-white/60">
              <li>6 March 2027</li>
              <li>8:30 AM · Full day</li>
              <li>The Stable by Union Bank</li>
              <li>Surulere, Lagos</li>
              <li className="pt-1">100 seats only</li>
            </ul>
          </div>
          <div>
            <p className="text-[9px] uppercase tracking-[0.3em] text-white/25 mb-5">Contact</p>
            <ul className="space-y-2.5 text-[11px] text-white/60">
              <li>
                <a href="mailto:tedxorileiganmu@gmail.com" className="hover:text-red transition-colors">
                  tedxorileiganmu@gmail.com
                </a>
              </li>
              <li>
                <a href="tel:+2348172386902" className="hover:text-red transition-colors">
                  +234 817 238 6902
                </a>
              </li>
              <li className="pt-1">
                <a
                  href="https://instagram.com/tedxorileiganmu"
                  target="_blank" rel="noreferrer"
                  className="hover:text-red transition-colors"
                >
                  @tedxorileiganmu
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-16 pt-8 border-t border-white/8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-[9px] uppercase tracking-[0.2em] text-white/20">
          <p>© 2027 TEDxOrileIganmu</p>
          <p>Independently operated under license from TED.</p>
        </div>
      </div>
    </footer>
  );
}
