import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/account")({
  head: () => ({ meta: [{ title: "My Account — Dénvie" }] }),
  component: Account,
});

function Account() {
  return (
    <section className="max-w-5xl mx-auto px-6 py-16">
      <div className="mb-12">
        <p className="text-[10px] uppercase tracking-luxer text-brand-rose mb-2">My Account</p>
        <h1 className="font-display text-3xl">Welcome to Dénvie</h1>
        <p className="text-sm text-brand-charcoal/60 mt-2">
          Browse, save favourites, and checkout via WhatsApp — no sign-in required.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
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
    </section>
  );
}
