import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { checkAdmin } from "@/hooks/useAuth";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/orders")({
  head: () => ({ meta: [{ title: "Orders — Admin — Dénvie" }] }),
  component: AdminOrders,
});

const STATUSES = ["pending", "confirmed", "shipped", "delivered", "cancelled"] as const;

function AdminOrders() {
  const navigate = useNavigate();
  const qc = useQueryClient();
  const [allowed, setAllowed] = useState<boolean | null>(null);
  const [filter, setFilter] = useState<string>("all");

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

  const { data: orders = [] } = useQuery({
    queryKey: ["admin-orders-all", filter],
    enabled: allowed === true,
    queryFn: async () => {
      let q = supabase
        .from("orders")
        .select("id,order_number,customer_name,customer_phone,shipping_city,status,total,created_at")
        .order("created_at", { ascending: false });
      if (filter !== "all") q = q.eq("status", filter as never);
      return (await q).data ?? [];
    },
  });

  const updateStatus = async (id: string, status: string) => {
    const { error } = await supabase.from("orders").update({ status: status as never }).eq("id", id);
    if (error) return toast.error(error.message);
    toast.success("Order updated");
    qc.invalidateQueries({ queryKey: ["admin-orders-all"] });
  };

  if (allowed !== true) return <section className="py-24 text-center text-sm">Verifying access…</section>;

  return (
    <section className="max-w-7xl mx-auto px-6 py-12">
      <div className="flex items-end justify-between mb-10">
        <div>
          <p className="text-[10px] uppercase tracking-luxer text-brand-rose mb-2">Admin</p>
          <h1 className="font-display text-4xl">Orders</h1>
        </div>
        <Link to="/admin" className="text-xs uppercase tracking-luxe border-b border-brand-charcoal/30 hover:border-brand-rose">← Dashboard</Link>
      </div>

      <div className="flex flex-wrap gap-2 mb-6">
        {["all", ...STATUSES].map((s) => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={`px-4 py-2 text-[10px] uppercase tracking-luxe ring-1 ring-black/10 ${filter === s ? "bg-brand-charcoal text-white" : "bg-white"}`}
          >
            {s}
          </button>
        ))}
      </div>

      <div className="border border-black/5 bg-white overflow-x-auto">
        {orders.length === 0 && <p className="p-8 text-sm text-brand-charcoal/60 text-center">No orders found.</p>}
        {orders.map((o) => (
          <div key={o.id} className="grid grid-cols-1 md:grid-cols-6 gap-3 p-4 border-b border-black/5 last:border-b-0 text-sm items-center">
            <span className="font-medium">{o.order_number}</span>
            <span>{o.customer_name}</span>
            <span className="text-brand-charcoal/60">{o.customer_phone}</span>
            <span className="text-brand-charcoal/60">{o.shipping_city}</span>
            <span className="font-medium">${Number(o.total).toFixed(2)}</span>
            <select
              value={o.status as string}
              onChange={(e) => updateStatus(o.id, e.target.value)}
              className="bg-brand-beige/40 px-3 py-2 text-xs uppercase tracking-luxe focus:outline-none"
            >
              {STATUSES.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>
        ))}
      </div>
    </section>
  );
}