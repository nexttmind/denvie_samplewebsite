import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable";
import { toast } from "sonner";

export const Route = createFileRoute("/auth")({
  head: () => ({ meta: [{ title: "Sign In — Dénvie by Denise" }] }),
  component: Auth,
});

function Auth() {
  const [mode, setMode] = useState<"sign-in" | "sign-up">("sign-in");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (data.user) navigate({ to: "/account", replace: true });
    });
  }, [navigate]);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const fd = new FormData(e.currentTarget);
    const email = String(fd.get("email"));
    const password = String(fd.get("password"));
    const full_name = String(fd.get("name") ?? "");
    try {
      if (mode === "sign-up") {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { full_name },
            emailRedirectTo: window.location.origin,
          },
        });
        if (error) throw error;
        toast.success("Check your inbox to confirm your account.");
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        navigate({ to: "/account" });
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Authentication failed");
    } finally {
      setLoading(false);
    }
  };

  const onGoogle = async () => {
    try {
      const result = await lovable.auth.signInWithOAuth("google", {
        redirect_uri: window.location.origin,
      });
      if (result.error) {
        toast.error(result.error.message ?? "Google sign-in failed");
        return;
      }
      if (result.redirected) return;
      navigate({ to: "/account" });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Google sign-in failed");
    }
  };

  return (
    <section className="max-w-md mx-auto px-6 py-20">
      <h1 className="font-display text-3xl text-center mb-2">
        {mode === "sign-in" ? "Welcome back" : "Create your account"}
      </h1>
      <p className="text-center text-xs uppercase tracking-luxe text-brand-charcoal/50 mb-10">
        Dénvie by Denise
      </p>
      <form onSubmit={onSubmit} className="space-y-4">
        {mode === "sign-up" && (
          <input name="name" placeholder="Full name" required className="w-full bg-white/60 px-5 py-4 text-sm ring-1 ring-black/5 focus:outline-none focus:ring-brand-rose" />
        )}
        <input name="email" type="email" required placeholder="Email address" className="w-full bg-white/60 px-5 py-4 text-sm ring-1 ring-black/5 focus:outline-none focus:ring-brand-rose" />
        <input name="password" type="password" required minLength={6} placeholder="Password" className="w-full bg-white/60 px-5 py-4 text-sm ring-1 ring-black/5 focus:outline-none focus:ring-brand-rose" />
        <button disabled={loading} className="w-full bg-brand-charcoal text-white py-4 text-xs uppercase tracking-luxe hover:bg-brand-rose transition-colors disabled:opacity-50">
          {loading ? "Please wait…" : mode === "sign-in" ? "Sign In" : "Create Account"}
        </button>
      </form>
      <div className="flex items-center gap-3 my-6">
        <span className="flex-1 h-px bg-black/10" />
        <span className="text-[10px] uppercase tracking-luxe text-brand-charcoal/50">or</span>
        <span className="flex-1 h-px bg-black/10" />
      </div>
      <button
        type="button"
        onClick={onGoogle}
        className="w-full bg-white py-4 text-xs uppercase tracking-luxe ring-1 ring-black/10 hover:ring-brand-rose flex items-center justify-center gap-3"
      >
        <svg width="16" height="16" viewBox="0 0 48 48" aria-hidden>
          <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.7 32.6 29.3 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3 0 5.8 1.1 7.9 3l5.7-5.7C34 6 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.4-.4-3.5z"/>
          <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.7 16 19 13 24 13c3 0 5.8 1.1 7.9 3l5.7-5.7C34 6 29.3 4 24 4 16.3 4 9.7 8.3 6.3 14.7z"/>
          <path fill="#4CAF50" d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2C29.2 35.2 26.7 36 24 36c-5.3 0-9.7-3.4-11.3-8.1l-6.5 5C9.5 39.6 16.2 44 24 44z"/>
          <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.2-2.2 4.1-4.1 5.6l6.2 5.2C41 36 44 30.5 44 24c0-1.3-.1-2.4-.4-3.5z"/>
        </svg>
        Continue with Google
      </button>
      <button
        onClick={() => setMode(mode === "sign-in" ? "sign-up" : "sign-in")}
        className="mt-6 w-full text-xs uppercase tracking-luxe text-brand-charcoal/60 hover:text-brand-charcoal"
      >
        {mode === "sign-in" ? "New here? Create an account" : "Already a member? Sign in"}
      </button>
    </section>
  );
}