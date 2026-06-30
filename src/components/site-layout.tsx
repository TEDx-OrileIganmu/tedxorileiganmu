import { Link } from "@tanstack/react-router";
import { useState, type ReactNode } from "react";
import logoBlack from "@/assets/logo-black.png.asset.json";
import logoWhite from "@/assets/logo-white.png.asset.json";

const NAV = [
  { to: "/", label: "Home" },
  { to: "/about", label: "About" },
  { to: "/speakers", label: "Speakers" },
  { to: "/tickets", label: "Tickets" },
  { to: "/volunteer", label: "Volunteer" },
  { to: "/support", label: "Support" },
] as const;

export function SiteLayout({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="min-h-screen flex flex-col bg-paper text-ink">
      <header className="sticky top-0 z-30 bg-paper/95 backdrop-blur border-b border-border">
        <div className="absolute top-0 left-0 h-[2px] w-24 md:w-40 bg-red" />
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 md:px-10 md:py-5">
          <Link to="/" className="block" onClick={() => setOpen(false)}>
            <img src={logoBlack.url} alt="TEDxOrileIganmu" className="h-6 md:h-7 w-auto" />
          </Link>
          <nav className="hidden md:flex items-center gap-7 text-[10px] uppercase tracking-[0.2em] text-ink/60">
            {NAV.map((n) => (
              <Link
                key={n.to}
                to={n.to}
                activeOptions={{ exact: n.to === "/" }}
                activeProps={{ className: "text-red" }}
                className="hover:text-ink transition-colors duration-200"
              >
                {n.label}
              </Link>
            ))}
          </nav>
          <button
            aria-label="Menu"
            onClick={() => setOpen((v) => !v)}
            className="md:hidden text-[11px] uppercase tracking-[0.25em]"
          >
            {open ? "Close" : "Menu"}
          </button>
        </div>
        {open && (
          <div className="md:hidden border-t border-border bg-paper">
            <nav className="flex flex-col px-6 py-2">
              {NAV.map((n) => (
                <Link
                  key={n.to}
                  to={n.to}
                  onClick={() => setOpen(false)}
                  activeOptions={{ exact: n.to === "/" }}
                  activeProps={{ className: "text-red" }}
                  className="py-3.5 text-[11px] uppercase tracking-[0.25em] text-ink/80 border-b border-border last:border-b-0"
                >
                  {n.label}
                </Link>
              ))}
              <Link
                to="/tickets"
                onClick={() => setOpen(false)}
                className="mt-4 mb-2 inline-flex items-center justify-center bg-red text-white text-[10px] uppercase tracking-[0.2em] px-5 py-3 hover:bg-ink transition-colors"
              >
                Get tickets
              </Link>
            </nav>
          </div>
        )}
      </header>
      <main className="flex-1">{children}</main>
      <SiteFooter />
    </div>
  );
}

export function SectionHeader({ kicker, title, lede }: { kicker: string; title: ReactNode; lede?: string }) {
  return (
    <div className="mx-auto max-w-7xl px-6 md:px-10 pt-20 md:pt-32 pb-12 md:pb-20">
      <div className="flex items-center gap-3 text-[10px] uppercase tracking-[0.3em] text-red mb-8">
        <span className="h-px w-8 bg-red" />
        <span>{kicker}</span>
      </div>
      <h1 className="font-display font-medium tracking-[-0.02em] leading-[0.95] text-[clamp(2.5rem,7vw,5.5rem)] max-w-4xl">
        {title}
      </h1>
      {lede && (
        <p className="mt-8 font-serif italic text-xl md:text-2xl text-ink/60 max-w-2xl leading-snug">
          {lede}
        </p>
      )}
    </div>
  );
}

function SiteFooter() {
  return (
    <footer className="bg-ink text-white border-t border-white/10 mt-20">
      <div className="mx-auto max-w-7xl px-6 md:px-10 py-16 md:py-20">
        <div className="grid gap-10 grid-cols-2 md:grid-cols-[1.6fr_1fr_1fr_1fr]">
          <div className="col-span-2 md:col-span-1">
            <img src={logoWhite.url} alt="TEDxOrileIganmu" className="h-7 w-auto" />
            <p className="mt-6 font-serif italic text-white/50 max-w-xs leading-relaxed text-sm">
              Ideas worth spreading. From Orile, to the world.
            </p>
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-[0.3em] text-white/30 mb-4">Navigate</p>
            <ul className="space-y-2 text-sm text-white/70">
              {NAV.map((n) => (
                <li key={n.to}>
                  <Link to={n.to} className="hover:text-red transition-colors">{n.label}</Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-[0.3em] text-white/30 mb-4">Contact</p>
            <ul className="space-y-2 text-sm text-white/70">
              <li><a href="mailto:tedxorileiganmu@gmail.com" className="hover:text-red transition-colors">tedxorileiganmu@gmail.com</a></li>
              <li><a href="tel:+2348172386902" className="hover:text-red transition-colors">+234 817 238 6902</a></li>
            </ul>
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-[0.3em] text-white/30 mb-4">Follow</p>
            <ul className="space-y-2 text-sm text-white/70">
              <li>
                <a href="https://instagram.com/tedxorileiganmu" target="_blank" rel="noreferrer" className="hover:text-red transition-colors">
                  @tedxorileiganmu
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-16 pt-8 border-t border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-4 text-[10px] uppercase tracking-[0.2em] text-white/30">
          <p>© 2027 TEDxOrileIganmu</p>
          <p>Independently operated under license from TED.</p>
        </div>
      </div>
    </footer>
  );
}
