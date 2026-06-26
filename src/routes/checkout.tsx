import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { useCart } from "@/hooks/useCart";
import { BRAND, whatsappLink } from "@/lib/brand";
import { toast } from "sonner";

export const Route = createFileRoute("/checkout")({
  head: () => ({ meta: [{ title: "Checkout — Dénvie" }] }),
  component: Checkout,
});

function Checkout() {
  const { items, subtotal, clear } = useCart();
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();
  const shipping = subtotal > 0 ? 5 : 0;
  const total = subtotal + shipping;

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (items.length === 0) {
      toast.error("Your cart is empty");
      return;
    }
    setSubmitting(true);
    const fd = new FormData(e.currentTarget);
    const name = String(fd.get("name"));
    const phone = String(fd.get("phone"));
    const email = String(fd.get("email") ?? "");
    const address = String(fd.get("address"));
    const city = String(fd.get("city"));
    const region = String(fd.get("region") ?? "");
    const notes = String(fd.get("notes") ?? "");

    const lines = items.map(
      (it) =>
        `• ${it.name}${it.size ? ` (${it.size})` : ""}${it.color ? ` — ${it.color}` : ""} × ${it.quantity} — $${(it.price * it.quantity).toFixed(2)}`,
    );

    const message = [
      `Hello ${BRAND.fullName}, I'd like to place an order:`,
      "",
      `Name: ${name}`,
      `Phone: ${phone}`,
      email ? `Email: ${email}` : "",
      `Address: ${address}, ${city}${region ? `, ${region}` : ""}`,
      notes ? `Notes: ${notes}` : "",
      "",
      "Items:",
      ...lines,
      "",
      `Subtotal: $${subtotal.toFixed(2)}`,
      `Shipping: $${shipping.toFixed(2)}`,
      `Total: $${total.toFixed(2)}`,
      "Payment: Cash on delivery",
    ]
      .filter(Boolean)
      .join("\n");

    clear();
    toast.success("Opening WhatsApp to complete your order");
    window.open(whatsappLink(message), "_blank", "noopener,noreferrer");
    navigate({ to: "/" });
    setSubmitting(false);
  };

  return (
    <section className="max-w-5xl mx-auto px-6 py-16">
      <h1 className="font-display text-4xl mb-10 text-center">Checkout</h1>
      <div className="grid lg:grid-cols-[1fr_360px] gap-12">
        <form onSubmit={onSubmit} className="space-y-4">
          <h2 className="font-display text-xl mb-2">Shipping Information</h2>
          <input name="name" required placeholder="Full name" className="w-full bg-white/60 px-5 py-4 text-sm ring-1 ring-black/5 focus:outline-none focus:ring-brand-rose" />
          <input name="phone" required placeholder="Phone number" className="w-full bg-white/60 px-5 py-4 text-sm ring-1 ring-black/5 focus:outline-none focus:ring-brand-rose" />
          <input name="email" type="email" placeholder="Email (optional)" className="w-full bg-white/60 px-5 py-4 text-sm ring-1 ring-black/5 focus:outline-none focus:ring-brand-rose" />
          <input name="address" required placeholder="Address" className="w-full bg-white/60 px-5 py-4 text-sm ring-1 ring-black/5 focus:outline-none focus:ring-brand-rose" />
          <div className="grid grid-cols-2 gap-4">
            <input name="city" required placeholder="City" className="bg-white/60 px-5 py-4 text-sm ring-1 ring-black/5 focus:outline-none focus:ring-brand-rose" />
            <input name="region" placeholder="Region" className="bg-white/60 px-5 py-4 text-sm ring-1 ring-black/5 focus:outline-none focus:ring-brand-rose" />
          </div>
          <textarea name="notes" rows={3} placeholder="Delivery notes (optional)" className="w-full bg-white/60 px-5 py-4 text-sm ring-1 ring-black/5 focus:outline-none focus:ring-brand-rose" />

          <h2 className="font-display text-xl pt-6">Payment</h2>
          <div className="bg-brand-beige/40 p-4 text-sm">
            <p className="font-medium mb-1">Cash on Delivery</p>
            <p className="text-xs text-brand-charcoal/60">Your order is sent via WhatsApp. Pay when your order arrives.</p>
          </div>

          <button disabled={submitting} className="w-full bg-brand-charcoal text-white py-4 text-xs uppercase tracking-luxe hover:bg-brand-rose transition-colors disabled:opacity-50">
            {submitting ? "Opening WhatsApp…" : "Complete Order on WhatsApp"}
          </button>
        </form>

        <aside className="bg-brand-beige/40 p-6 h-fit space-y-3">
          <h2 className="font-display text-xl">Summary</h2>
          {items.map((it, i) => (
            <div key={i} className="flex justify-between text-sm">
              <span>{it.name} × {it.quantity}</span>
              <span>${(it.price * it.quantity).toFixed(2)}</span>
            </div>
          ))}
          <div className="border-t border-black/10 pt-3 space-y-1 text-sm">
            <div className="flex justify-between"><span>Subtotal</span><span>${subtotal.toFixed(2)}</span></div>
            <div className="flex justify-between"><span>Shipping</span><span>${shipping.toFixed(2)}</span></div>
            <div className="flex justify-between font-medium pt-2 border-t border-black/10"><span>Total</span><span>${total.toFixed(2)}</span></div>
          </div>
        </aside>
      </div>
    </section>
  );
}
