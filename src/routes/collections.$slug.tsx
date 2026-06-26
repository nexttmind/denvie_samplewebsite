import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { getCollectionBySlug } from "@/lib/catalog";
import { ProductCard, type ProductCardData } from "@/components/ProductCard";
import { ArrowRight } from "lucide-react";

// Collection banner fallbacks for editorial luxury feel
import bannerNewArrivals from "@/assets/collection-resort.jpg";
import bannerBestSellers from "@/assets/collection-essentials.jpg";
import bannerSale from "@/assets/collection-tailored.jpg";

const BANNER_MAP: Record<string, string> = {
  "new-arrivals": bannerNewArrivals,
  "best-sellers": bannerBestSellers,
  "sale": bannerSale,
};

export const Route = createFileRoute("/collections/$slug")({
  head: () => ({
    meta: [
      { title: "Collection — Dénvie by Denise" },
      { name: "description", content: "Explore curated pieces from this Dénvie collection." },
    ],
  }),
  component: CollectionPage,
});

function CollectionPage() {
  const { slug } = Route.useParams();
  const { data, isLoading } = useQuery({
    queryKey: ["collection", slug],
    queryFn: () => {
      const result = getCollectionBySlug(slug);
      if (!result) return { col: null, products: [] as ProductCardData[], count: 0 };
      return { col: result.col, products: result.products, count: result.count };
    },
  });

  const banner = data?.col?.banner_url || BANNER_MAP[slug] || bannerBestSellers;

  if (isLoading) {
    return (
      <section className="max-w-7xl mx-auto px-6 py-24 text-center">
        <p className="text-sm text-brand-charcoal/60">Loading collection…</p>
      </section>
    );
  }

  if (!data?.col) {
    return (
      <section className="max-w-3xl mx-auto px-6 py-24 text-center">
        <p className="text-sm text-brand-charcoal/60">Collection not found.</p>
      </section>
    );
  }

  return (
    <>
      {/* Hero Banner — extends behind the transparent header */}
      <section className="relative w-full h-[65vh] min-h-[460px] max-h-[680px] overflow-hidden -mt-16 sm:-mt-20">
        <img
          src={banner}
          alt={data.col.name}
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-brand-canvas via-brand-canvas/40 to-brand-canvas/10" />
        <div className="relative h-full max-w-7xl mx-auto px-6 flex flex-col justify-end pb-12 sm:pb-16 pt-16 sm:pt-20">
          <span className="text-[10px] uppercase tracking-luxer text-brand-rose font-medium mb-3">
            Dénvie Collection
          </span>
          <h1 className="font-display text-[clamp(2.5rem,6vw,5rem)] leading-[0.95] tracking-[-0.01em] text-brand-charcoal">
            {data.col.name}
          </h1>
          {data.col.description && (
            <p className="text-sm sm:text-base text-brand-charcoal/65 max-w-[44ch] mt-4 leading-relaxed">
              {data.col.description}
            </p>
          )}
          <div className="flex items-center gap-4 mt-6">
            <span className="text-[10px] uppercase tracking-luxer text-brand-charcoal/50">
              {data.count} {data.count === 1 ? "piece" : "pieces"}
            </span>
            <span className="h-px w-12 bg-brand-charcoal/20" />
            <span className="text-[10px] uppercase tracking-luxer text-brand-charcoal/50">
              A/W 2026
            </span>
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <section className="max-w-7xl mx-auto px-6 py-16 sm:py-24">
        {data.products.length === 0 ? (
          <div className="text-center py-24">
            <p className="text-sm text-brand-charcoal/60">No products in this collection yet.</p>
            <p className="text-xs text-brand-charcoal/40 mt-2">Check back soon — new pieces arrive weekly.</p>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between mb-10 sm:mb-14">
              <div>
                <p className="text-[10px] uppercase tracking-luxer text-brand-rose mb-1">The Pieces</p>
                <h2 className="font-display text-2xl sm:text-3xl">{data.col.name}</h2>
              </div>
              <span className="text-[10px] uppercase tracking-luxer text-brand-charcoal/40">
                {data.count} {data.count === 1 ? "piece" : "pieces"}
              </span>
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-4 gap-y-12 sm:gap-x-8">
              {data.products.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </>
        )}
      </section>

      {/* Editorial CTA */}
      <section className="border-t border-black/5 py-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div>
            <p className="text-[10px] uppercase tracking-luxer text-brand-rose mb-2">Complete the Look</p>
            <h3 className="font-display text-xl sm:text-2xl">Discover the full edit</h3>
          </div>
          <Link
            to="/shop"
            className="group inline-flex items-center gap-3 bg-brand-charcoal text-brand-canvas px-8 py-3.5 text-[11px] uppercase tracking-luxer font-medium hover:bg-brand-rose transition-colors duration-500"
          >
            <span>Shop All</span>
            <ArrowRight className="size-3.5 group-hover:translate-x-1 transition-transform duration-500" />
          </Link>
        </div>
      </section>
    </>
  );
}
