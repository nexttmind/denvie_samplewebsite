import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";

export const Route = createFileRoute("/account")({
  head: () => ({ meta: [{ title: "My Account — Dénvie" }] }),
  component: Account,
});

function Account() {
  const navigate = useNavigate();
  const [user, setUser] = useState<{ id: string; email?: string } | null>(null);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (!data.user) navigate({ to: "/auth", replace: true });
      else setUser({ id: data.user.id, email: data.user.email });
      setChecking(false);
    });
  }, [navigate]);

  const { data: orders = [] } = useQuery({
    queryKey: ["orders", user?.id],
    enabled: !!user,
    queryFn: async () =>
      (await supabase.from("orders").select("id,order_number,status,total,created_at").order("created_at", { ascending: false })).data ?? [],
  });

  if (checking || !user) return <section className="py-24 text-center text-sm">Loading…</section>;

  return (
    <section className="max-w-5xl mx-auto px-6 py-16">
      <div className="flex flex-wrap justify-between items-end mb-12 gap-4">
        <div>
          <p className="text-[10px] uppercase tracking-luxer text-brand-rose mb-2">My Account</p>
          <h1 className="font-display text-3xl">Welcome, {user.email}</h1>
        </div>
        <button
          onClick={async () => {
            await supabase.auth.signOut();
            toast.success("Signed out");
            navigate({ to: "/" });
          }}
          className="text-xs uppercase tracking-luxe border-b border-brand-charcoal/30 pb-1 hover:border-brand-rose"
        >
          Sign Out
        </button>
      </div>

      <div className="grid md:grid-cols-3 gap-6 mb-12">
        <Link to="/wishlist" className="bg-brand-beige/40 p-6 hover:bg-brand-beige/70 transition">
          <p className="text-[10px] uppercase tracking-luxe mb-2">Wishlist</p>
          <h3 className="font-display text-xl">Saved pieces</h3>
        </Link>
        <Link to="/cart" className="bg-brand-beige/40 p-6 hover:bg-brand-beige/70 transition">
          <p className="text-[10px] uppercase tracking-luxe mb-2">Cart</p>
          <h3 className="font-display text-xl">Your bag</h3>
        </Link>
        <Link to="/shop" className="bg-brand-beige/40 p-6 hover:bg-brand-beige/70 transition">
          <p className="text-[10px] uppercase tracking-luxe mb-2">Shop</p>
          <h3 className="font-display text-xl">New season</h3>
        </Link>
      </div>

      <h2 className="font-display text-2xl mb-6">Order History</h2>
      {orders.length === 0 ? (
        <p className="text-sm text-brand-charcoal/60">No orders yet.</p>
      ) : (
        <div className="border border-black/5">
          {orders.map((o) => (
            <div key={o.id} className="flex justify-between p-4 border-b border-black/5 last:border-b-0 text-sm">
              <span>{o.order_number}</span>
              <span className="uppercase text-xs tracking-luxe text-brand-charcoal/60">{o.status}</span>
              <span>${Number(o.total).toFixed(2)}</span>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}