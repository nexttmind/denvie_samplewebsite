import { createFileRoute, Link } from "@tanstack/react-router";
import { useCart } from "@/hooks/useCart";
import { resolveImage } from "@/lib/product-images";
import { X } from "lucide-react";

export const Route = createFileRoute("/cart")({
  component: Cart,
});

function Cart() {
  const { items, update, remove, subtotal } = useCart();
  const shipping = subtotal > 0 ? 5 : 0;
  const total = subtotal + shipping;

  return (
    <section className="max-w-6xl mx-auto px-6 py-16">
      <h1 className="font-display text-4xl mb-10 text-center">Shopping Bag</h1>
      {items.length === 0 ? (
        <div className="text-center py-20 space-y-4">
          <p className="text-sm text-brand-charcoal/60">Your bag is empty.</p>
          <Link to="/shop" className="inline-block bg-brand-charcoal text-white px-8 py-3 text-xs uppercase tracking-luxe hover:bg-brand-rose">
            Discover the collection
          </Link>
        </div>
      ) : (
        <div className="grid lg:grid-cols-[1fr_360px] gap-12">
          <div className="space-y-6">
            {items.map((it, i) => (
              <div key={i} className="flex gap-4 border-b border-black/5 pb-6">
                <img src={resolveImage(it.image)} alt={it.name} className="w-24 h-32 object-cover bg-brand-beige" />
                <div className="flex-1">
                  <div className="flex justify-between gap-4">
                    <div>
                      <h3 className="text-sm font-medium">{it.name}</h3>
                      <p className="text-xs text-brand-charcoal/60 mt-1">
                        {[it.color, it.size].filter(Boolean).join(" · ")}
                      </p>
                      <p className="text-sm mt-2">${it.price.toFixed(2)}</p>
                    </div>
                    <button onClick={() => remove(i)} aria-label="Remove"><X className="size-4" /></button>
                  </div>
                  <div className="inline-flex ring-1 ring-black/10 mt-3">
                    <button onClick={() => update(i, it.quantity - 1)} className="size-8 hover:bg-brand-beige/40">−</button>
                    <span className="size-8 grid place-items-center text-xs">{it.quantity}</span>
                    <button onClick={() => update(i, it.quantity + 1)} className="size-8 hover:bg-brand-beige/40">+</button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <aside className="bg-brand-beige/40 p-6 lg:p-8 space-y-4 h-fit">
            <h2 className="font-display text-xl">Order Summary</h2>
            <div className="flex justify-between text-sm"><span>Subtotal</span><span>${subtotal.toFixed(2)}</span></div>
            <div className="flex justify-between text-sm"><span>Shipping</span><span>${shipping.toFixed(2)}</span></div>
            <input placeholder="Coupon code" className="w-full bg-white/60 px-4 py-3 text-sm ring-1 ring-black/5 focus:outline-none" />
            <div className="flex justify-between font-medium pt-3 border-t border-black/10"><span>Total</span><span>${total.toFixed(2)}</span></div>
            <Link to="/checkout" className="block text-center bg-brand-charcoal text-white py-4 text-xs uppercase tracking-luxe hover:bg-brand-rose">
              Proceed to Checkout
            </Link>
            <Link to="/shop" className="block text-center text-xs uppercase tracking-luxe pt-2 text-brand-charcoal/60 hover:text-brand-charcoal">
              Continue Shopping
            </Link>
          </aside>
        </div>
      )}
    </section>
  );
}