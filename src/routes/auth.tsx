import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/auth")({
  ssr: false,
  head: () => ({ meta: [{ title: "Sign in · TEDxOrileIganmu Admin" }] }),
  component: AuthPage,
});

function AuthPage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) navigate({ to: "/admin" });
    });
  }, [navigate]);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      if (mode === "signup") {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: { emailRedirectTo: `${window.location.origin}/admin` },
        });
        if (error) throw error;
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
      }
      navigate({ to: "/admin" });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-paper text-ink flex flex-col">
      <header className="border-b border-border">
        <div className="mx-auto max-w-7xl px-6 md:px-10 py-5 flex items-center justify-between">
          <Link to="/" className="text-[11px] uppercase tracking-[0.3em] hover:text-red transition-colors">
            ← TEDxOrileIganmu
          </Link>
          <span className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground">Admin Access</span>
        </div>
      </header>
      <main className="flex-1 flex items-center justify-center px-6 py-20">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="w-full max-w-md"
        >
          <div className="flex items-center gap-3 text-[11px] uppercase tracking-[0.25em] text-muted-foreground mb-8">
            <span className="h-px w-8 bg-red" />
            <span>{mode === "signin" ? "Sign in" : "Create account"}</span>
          </div>
          <h1 className="font-display font-medium tracking-[-0.02em] leading-[0.95] text-5xl mb-3">
            The <span className="font-serif italic">Backstage.</span>
          </h1>
          <p className="font-serif italic text-lg text-ink/60 mb-10">
            Curator and organiser access only.
          </p>

          <form onSubmit={onSubmit} className="space-y-6">
            <label className="block">
              <span className="block text-[10px] uppercase tracking-[0.3em] text-muted-foreground mb-2">Email</span>
              <input
                type="email" required value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-transparent border-b border-ink/25 py-3 focus:outline-none focus:border-red text-lg"
                placeholder="you@domain.com"
              />
            </label>
            <label className="block">
              <span className="block text-[10px] uppercase tracking-[0.3em] text-muted-foreground mb-2">Password</span>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"} required minLength={6} value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-transparent border-b border-ink/25 py-3 pr-10 focus:outline-none focus:border-red text-lg"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-0 top-1/2 -translate-y-1/2 p-2 text-muted-foreground hover:text-ink transition-colors"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M1 9s3-5.5 8-5.5S17 9 17 9s-3 5.5-8 5.5S1 9 1 9Z"/>
                      <circle cx="9" cy="9" r="2.5"/>
                      <line x1="2" y1="2" x2="16" y2="16"/>
                    </svg>
                  ) : (
                    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M1 9s3-5.5 8-5.5S17 9 17 9s-3 5.5-8 5.5S1 9 1 9Z"/>
                      <circle cx="9" cy="9" r="2.5"/>
                    </svg>
                  )}
                </button>
              </div>
            </label>
            {error && <p className="text-sm text-red">{error}</p>}
            <button
              type="submit" disabled={loading}
              className="w-full bg-red text-white py-5 text-xs uppercase tracking-[0.3em] hover:bg-ink transition-colors disabled:opacity-50"
            >
              {loading ? "…" : mode === "signin" ? "Sign in →" : "Create account →"}
            </button>
          </form>

          <button
            onClick={() => { setMode(mode === "signin" ? "signup" : "signin"); setError(null); }}
            className="mt-8 text-[11px] uppercase tracking-[0.25em] text-muted-foreground hover:text-red transition-colors"
          >
            {mode === "signin" ? "First time? Create account →" : "Have an account? Sign in →"}
          </button>
        </motion.div>
      </main>
    </div>
  );
}
