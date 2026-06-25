import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useState, useMemo } from "react";
import { supabase } from "@/integrations/supabase/client";
import { ProductCard, type ProductCardData } from "@/components/ProductCard";

export const Route = createFileRoute("/shop")({
  validateSearch: (s: Record<string, unknown>) => ({
    q: typeof s.q === "string" ? s.q : undefined,
  }),
  head: () => ({
    meta: [
      { title: "Shop — Dénvie by Denise" },
      { name: "description", content: "Shop the full Dénvie collection — dresses, tops, blouses, pants, skirts and sets." },
    ],
  }),
  component: Shop,
});

function Shop() {
  const [sort, setSort] = useState<"new" | "price-asc" | "price-desc">("new");
  const [cat, setCat] = useState<string>("all");
  const { q } = Route.useSearch();
  const term = (q ?? "").trim().toLowerCase();

  const { data: categories = [] } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => (await supabase.from("categories").select("id,slug,name").order("sort_order")).data ?? [],
  });

  const { data: products = [] } = useQuery({
    queryKey: ["all-products"],
    queryFn: async () =>
      ((await supabase
        .from("products")
        .select("id,slug,name,price,compare_at_price,images,is_new,is_sale,sizes,colors,category_id,created_at")
        .eq("is_active", true)).data ?? []) as (ProductCardData & { category_id: string; created_at: string })[],
  });

  const filtered = useMemo(() => {
    let arr = [...products];
    if (cat !== "all") arr = arr.filter((p) => p.category_id === cat);
    if (term) {
      const catName = (id: string) => categories.find((c) => c.id === id)?.name?.toLowerCase() ?? "";
      const tokens = term.split(/\s+/);
      arr = arr.filter((p) => {
        const hay = [p.name, ...(p.colors ?? []), catName(p.category_id)]
          .filter(Boolean).join(" ").toLowerCase();
        return tokens.every((t: string) => hay.includes(t));
      });
    }
    if (sort === "price-asc") arr.sort((a, b) => Number(a.price) - Number(b.price));
    if (sort === "price-desc") arr.sort((a, b) => Number(b.price) - Number(a.price));
    if (sort === "new") arr.sort((a, b) => (b.created_at ?? "").localeCompare(a.created_at ?? ""));
    return arr;
  }, [products, sort, cat, term, categories]);

  return (
    <section className="max-w-7xl mx-auto px-6 py-16">
      <header className="mb-12 text-center">
        <p className="text-[10px] uppercase tracking-luxer text-brand-rose mb-2">All Products</p>
        <h1 className="font-display text-4xl sm:text-5xl">The Wardrobe</h1>
        {term && (
          <p className="text-xs text-brand-charcoal/60 mt-3">
            Search results for <span className="italic">“{term}”</span> ·{" "}
            <Link to="/shop" className="underline">clear</Link>
          </p>
        )}
      </header>

      <div className="flex flex-wrap items-center justify-between gap-4 mb-10 border-y border-black/5 py-4">
        <div className="flex flex-wrap gap-1">
          <FilterChip active={cat === "all"} onClick={() => setCat("all")}>All</FilterChip>
          {categories.map((c) => (
            <FilterChip key={c.id} active={cat === c.id} onClick={() => setCat(c.id)}>{c.name}</FilterChip>
          ))}
        </div>
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value as typeof sort)}
          className="text-xs uppercase tracking-luxe bg-transparent border-b border-black/10 py-1 focus:outline-none"
        >
          <option value="new">Newest</option>
          <option value="price-asc">Price: Low to High</option>
          <option value="price-desc">Price: High to Low</option>
        </select>
      </div>

      {filtered.length === 0 ? (
        <p className="text-center text-sm text-brand-charcoal/60 py-24">No products yet.</p>
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-4 gap-y-12 sm:gap-x-8">
          {filtered.map((p) => <ProductCard key={p.id} product={p} />)}
        </div>
      )}

      <p className="text-center text-xs text-brand-charcoal/40 mt-16">
        Can't find your size? <Link to="/contact" className="underline">Talk to our concierge</Link>.
      </p>
    </section>
  );
}

function FilterChip({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className={`text-[11px] uppercase tracking-luxe px-4 py-2 transition-colors ${
        active ? "bg-brand-charcoal text-white" : "hover:bg-brand-beige/60"
      }`}
    >
      {children}
    </button>
  );
}