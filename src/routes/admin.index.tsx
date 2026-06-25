import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { checkAdmin } from "@/hooks/useAuth";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/")({
  head: () => ({ meta: [{ title: "Admin — Dénvie" }] }),
  component: Admin,
});

function Admin() {
  const navigate = useNavigate();
  const [allowed, setAllowed] = useState<boolean | null>(null);

  useEffect(() => {
    (async () => {
      const ok = await checkAdmin();
      if (!ok) {
        toast.error("Admin access required");
        navigate({ to: "/" });
      } else {
        setAllowed(true);
      }
    })();
  }, [navigate]);

  const { data: stats } = useQuery({
    queryKey: ["admin-stats"],
    enabled: allowed === true,
    queryFn: async () => {
      const [{ count: products }, { count: orders }, { data: revenue }] = await Promise.all([
        supabase.from("products").select("*", { count: "exact", head: true }),
        supabase.from("orders").select("*", { count: "exact", head: true }),
        supabase.from("orders").select("total"),
      ]);
      const total = (revenue ?? []).reduce((s, r) => s + Number(r.total ?? 0), 0);
      return { products: products ?? 0, orders: orders ?? 0, revenue: total };
    },
  });

  const { data: products = [] } = useQuery({
    queryKey: ["admin-products"],
    enabled: allowed === true,
    queryFn: async () => (await supabase.from("products").select("id,name,price,stock,is_active").order("stock", { ascending: true })).data ?? [],
  });

  const lowStockProducts = (products ?? []).filter((p) => Number(p.stock) <= 5);

  const { data: orders = [] } = useQuery({
    queryKey: ["admin-orders"],
    enabled: allowed === true,
    queryFn: async () => (await supabase.from("orders").select("id,order_number,customer_name,status,total,created_at").order("created_at", { ascending: false }).limit(10)).data ?? [],
  });

  if (allowed !== true) return <section className="py-24 text-center text-sm">Verifying access…</section>;

  return (
    <section className="max-w-7xl mx-auto px-6 py-12">
      <header className="mb-10">
        <p className="text-[10px] uppercase tracking-luxer text-brand-rose mb-2">Admin</p>
        <h1 className="font-display text-4xl">Dashboard</h1>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-12">
        <Stat label="Revenue" value={`$${(stats?.revenue ?? 0).toFixed(2)}`} />
        <Stat label="Orders" value={String(stats?.orders ?? 0)} />
        <Stat label="Products" value={String(stats?.products ?? 0)} />
      </div>

      {lowStockProducts.length > 0 && (
        <div className="mb-10 border border-amber-300 bg-amber-50/70 p-5 rounded-sm">
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div>
              <p className="text-[10px] uppercase tracking-luxer text-amber-700 mb-1">⚠ Notification</p>
              <h3 className="font-display text-xl text-amber-900 mb-2">
                {lowStockProducts.length} product{lowStockProducts.length === 1 ? "" : "s"} need restocking
              </h3>
              <ul className="text-sm text-amber-900/90 space-y-1">
                {lowStockProducts.slice(0, 5).map((p) => (
                  <li key={p.id}>
                    • {p.name} — <strong>{p.stock === 0 ? "Out of stock" : `${p.stock} left`}</strong>
                  </li>
                ))}
                {lowStockProducts.length > 5 && <li className="text-amber-800/70">…and {lowStockProducts.length - 5} more</li>}
              </ul>
            </div>
            <Link to="/admin/products" className="text-xs uppercase tracking-luxe bg-amber-900 text-white px-4 py-2 hover:bg-amber-800">
              Manage stock →
            </Link>
          </div>
        </div>
      )}

      <div className="grid lg:grid-cols-2 gap-8">
        <div>
          <div className="flex justify-between mb-4">
            <h2 className="font-display text-2xl">Recent Orders</h2>
            <Link to="/admin/orders" className="text-xs uppercase tracking-luxe border-b border-brand-charcoal/30 pb-1 hover:border-brand-rose">Manage</Link>
          </div>
          <div className="border border-black/5">
            {orders.length === 0 && <p className="p-6 text-sm text-brand-charcoal/60">No orders yet.</p>}
            {orders.map((o) => (
              <div key={o.id} className="grid grid-cols-4 gap-2 p-4 border-b border-black/5 last:border-b-0 text-sm">
                <span className="truncate">{o.order_number}</span>
                <span className="truncate">{o.customer_name}</span>
                <span className="text-xs uppercase tracking-luxe text-brand-charcoal/60">{o.status}</span>
                <span className="text-right">${Number(o.total).toFixed(2)}</span>
              </div>
            ))}
          </div>
        </div>

        <div>
          <div className="flex justify-between mb-4">
            <h2 className="font-display text-2xl">Products</h2>
            <Link to="/admin/products" className="text-xs uppercase tracking-luxe border-b border-brand-charcoal/30 pb-1 hover:border-brand-rose">Manage</Link>
          </div>
          <div className="border border-black/5 max-h-[420px] overflow-auto">
            {products.map((p) => (
              <div key={p.id} className="flex justify-between p-4 border-b border-black/5 last:border-b-0 text-sm">
                <span className="truncate flex-1">{p.name}</span>
                <span className="text-brand-charcoal/60 text-xs px-3">Stock: {p.stock}</span>
                <span>${Number(p.price).toFixed(2)}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-brand-beige/40 p-6">
      <p className="text-[10px] uppercase tracking-luxe mb-2 text-brand-charcoal/60">{label}</p>
      <p className="font-display text-3xl">{value}</p>
    </div>
  );
}