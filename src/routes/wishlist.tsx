import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useWishlist } from "@/hooks/useCart";
import { getProductsByIds } from "@/lib/catalog";
import { ProductCard, type ProductCardData } from "@/components/ProductCard";

export const Route = createFileRoute("/wishlist")({
  component: Wishlist,
});

function Wishlist() {
  const { ids } = useWishlist();
  const { data: products = [] } = useQuery({
    queryKey: ["wishlist", ids],
    queryFn: () => getProductsByIds(ids),
  });

  return (
    <section className="max-w-7xl mx-auto px-6 py-16">
      <h1 className="font-display text-4xl mb-12 text-center">Your Wishlist</h1>
      {products.length === 0 ? (
        <div className="text-center py-20 space-y-4">
          <p className="text-sm text-brand-charcoal/60">Your wishlist is empty.</p>
          <Link to="/shop" className="inline-block bg-brand-charcoal text-white px-8 py-3 text-xs uppercase tracking-luxe hover:bg-brand-rose">
            Discover pieces
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-4 gap-y-12 sm:gap-x-8">
          {products.map((p) => <ProductCard key={p.id} product={p} />)}
        </div>
      )}
    </section>
  );
}