import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { getCollections } from "@/lib/catalog";
import silks from "@/assets/collection-essentials.jpg";
import tailoring from "@/assets/collection-tailored.jpg";
import knits from "@/assets/collection-resort.jpg";

export const Route = createFileRoute("/collections/")({
  component: CollectionsIndex,
});

const FALLBACK_IMAGES = [silks, tailoring, knits];

function CollectionsIndex() {
  const { data: collections = [] } = useQuery({
    queryKey: ["collections"],
    queryFn: getCollections,
  });

  return (
    <section className="max-w-7xl mx-auto px-6 py-16">
      <header className="mb-12 text-center">
        <p className="text-[10px] uppercase tracking-luxer text-brand-rose mb-2">The Edits</p>
        <h1 className="font-display text-4xl sm:text-5xl">Collections</h1>
      </header>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 sm:gap-6 md:gap-8">
        {collections.map((c, i) => (
          <Link
            key={c.id}
            to="/collections/$slug"
            params={{ slug: c.slug }}
            className="group space-y-3 sm:space-y-4"
          >
            <div className="relative aspect-[4/5] bg-brand-beige rounded-[min(1vw,12px)] overflow-hidden">
              <img
                src={c.banner_url || FALLBACK_IMAGES[i % FALLBACK_IMAGES.length]}
                alt={c.name}
                loading="lazy"
                className="w-full h-full object-cover group-hover:scale-[1.04] transition-transform duration-[1200ms] ease-out"
              />
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-brand-charcoal/85 via-brand-charcoal/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="pointer-events-none absolute inset-x-0 bottom-0 p-4 sm:p-6 text-brand-canvas translate-y-3 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
                {c.description && (
                  <p className="hidden sm:block text-xs leading-relaxed max-w-[34ch] line-clamp-3">
                    {c.description}
                  </p>
                )}
                <p className="text-[10px] uppercase tracking-luxer mt-2 sm:mt-3 flex items-center gap-3">
                  <span>{c.productCount} pieces</span>
                  <span className="h-px flex-1 bg-brand-canvas/40" />
                  <span>Shop →</span>
                </p>
              </div>
            </div>
            <div>
              <h3 className="font-display text-lg sm:text-2xl">{c.name}</h3>
              <p className="hidden sm:block text-sm text-brand-charcoal/60 mt-1 line-clamp-2">{c.description}</p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}