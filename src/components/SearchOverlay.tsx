import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Search, X } from "lucide-react";
import { getActiveProducts, getCategories } from "@/lib/catalog";
import { resolveImage } from "@/lib/product-images";

type SearchProduct = {
  id: string;
  slug: string;
  name: string;
  price: number;
  images: string[] | null;
  colors: string[] | null;
  category_id: string | null;
};

export function SearchOverlay({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [q, setQ] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  const { data: products = [] } = useQuery({
    queryKey: ["search-products"],
    queryFn: () => getActiveProducts(),
    enabled: open,
  });

  const { data: categories = [] } = useQuery({
    queryKey: ["search-categories"],
    queryFn: getCategories,
    enabled: open,
  });

  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 50);
      const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
      window.addEventListener("keydown", onKey);
      document.body.style.overflow = "hidden";
      return () => {
        window.removeEventListener("keydown", onKey);
        document.body.style.overflow = "";
      };
    }
  }, [open, onClose]);

  const term = q.trim().toLowerCase();

  const matches = useMemo(() => {
    if (!term) return [];
    const catName = (id: string | null) =>
      categories.find((c) => c.id === id)?.name?.toLowerCase() ?? "";
    return products
      .filter((p) => {
        const hay = [
          p.name,
          ...(p.colors ?? []),
          catName(p.category_id),
        ]
          .filter(Boolean)
          .join(" ")
          .toLowerCase();
        return term.split(/\s+/).every((t) => hay.includes(t));
      })
      .slice(0, 6);
  }, [term, products, categories]);

  const quickChips = ["Dress", "Skirt", "Top", "Sets", "Red", "Black", "Night"];

  const submit = () => {
    if (!term) return;
    navigate({ to: "/shop", search: { q: term } as never });
    onClose();
    setQ("");
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] animate-fade-in">
      <button
        onClick={onClose}
        aria-label="Close search"
        className="absolute inset-0 bg-brand-charcoal/40 backdrop-blur-sm"
      />
      <div className="relative bg-brand-canvas shadow-2xl animate-accordion-down origin-top">
        <div className="max-w-3xl mx-auto px-6 pt-8 pb-10">
          <div className="flex items-center gap-3 border-b border-brand-charcoal/30 pb-3">
            <Search className="size-5 text-brand-charcoal/60" />
            <input
              ref={inputRef}
              value={q}
              onChange={(e) => setQ(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && submit()}
              placeholder="Search dresses, skirts, colors…"
              className="flex-1 bg-transparent text-lg sm:text-2xl font-display placeholder:text-brand-charcoal/30 focus:outline-none"
            />
            <button onClick={onClose} aria-label="Close" className="p-2 hover:text-brand-rose">
              <X className="size-5" />
            </button>
          </div>

          {!term && (
            <div className="mt-6 animate-fade-in">
              <p className="text-[10px] uppercase tracking-luxer text-brand-charcoal/50 mb-3">
                Popular searches
              </p>
              <div className="flex flex-wrap gap-2">
                {quickChips.map((c) => (
                  <button
                    key={c}
                    onClick={() => setQ(c)}
                    className="text-xs px-4 py-2 ring-1 ring-black/10 hover:ring-brand-charcoal hover:bg-brand-beige/40 transition"
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>
          )}

          {term && (
            <div className="mt-6 animate-fade-in">
              <p className="text-[10px] uppercase tracking-luxer text-brand-charcoal/50 mb-3">
                {matches.length} {matches.length === 1 ? "result" : "results"}
              </p>
              {matches.length === 0 ? (
                <p className="text-sm text-brand-charcoal/60 py-6">
                  No matches. Try “dress”, “red”, or “skirt”.
                </p>
              ) : (
                <ul className="divide-y divide-black/5">
                  {matches.map((p) => (
                    <li key={p.id}>
                      <Link
                        to="/product/$slug"
                        params={{ slug: p.slug }}
                        onClick={() => {
                          onClose();
                          setQ("");
                        }}
                        className="flex items-center gap-4 py-3 hover:bg-brand-beige/30 px-2 -mx-2 transition"
                      >
                        <img
                          src={resolveImage(p.images?.[0])}
                          alt={p.name}
                          className="size-14 object-cover bg-brand-beige rounded-sm"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">{p.name}</p>
                          {p.colors && p.colors.length > 0 && (
                            <p className="text-xs text-brand-charcoal/50 truncate">
                              {p.colors.join(" · ")}
                            </p>
                          )}
                        </div>
                        <span className="text-sm">${Number(p.price).toFixed(2)}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
              <button
                onClick={submit}
                className="mt-6 w-full bg-brand-charcoal text-white py-3 text-xs uppercase tracking-luxe hover:bg-brand-rose transition-colors"
              >
                See all results for “{term}”
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}