import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { resolveImages } from "@/lib/product-images";
import { useCart, useWishlist } from "@/hooks/useCart";
import { BRAND, whatsappLink } from "@/lib/brand";
import { Heart, MessageCircle, Truck, RefreshCw, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import { ProductCard, type ProductCardData } from "@/components/ProductCard";

export const Route = createFileRoute("/product/$slug")({
  component: ProductPage,
});

function ProductPage() {
  const { slug } = Route.useParams();
  const { add } = useCart();
  const { has, toggle } = useWishlist();

  const { data: product } = useQuery({
    queryKey: ["product", slug],
    queryFn: async () =>
      (await supabase.from("products").select("*").eq("slug", slug).maybeSingle()).data,
  });

  const { data: related = [] } = useQuery({
    queryKey: ["related", product?.category_id, product?.id],
    enabled: !!product,
    queryFn: async () => {
      let q = supabase
        .from("products")
        .select("id,slug,name,price,compare_at_price,images,is_new,is_sale,sizes,colors")
        .eq("is_active", true)
        .neq("id", product!.id)
        .limit(8);
      if (product!.category_id) q = q.eq("category_id", product!.category_id);
      return ((await q).data ?? []) as ProductCardData[];
    },
  });

  const [activeImg, setActiveImg] = useState(0);
  const [size, setSize] = useState<string | undefined>();
  const [color, setColor] = useState<string | undefined>();
  const [qty, setQty] = useState(1);

  if (!product) {
    return <section className="max-w-3xl mx-auto px-6 py-24 text-center text-sm">Loading…</section>;
  }

  const images = resolveImages(product.images);
  const liked = has(product.id);

  const handleAdd = (buyNow = false) => {
    if (product.sizes && product.sizes.length > 0 && !size) {
      toast.error("Please select a size");
      return;
    }
    add({
      productId: product.id,
      slug: product.slug,
      name: product.name,
      price: Number(product.price),
      image: product.images?.[0] ?? "",
      size,
      color,
      quantity: qty,
    });
    toast.success(`${product.name} added to cart`);
    if (buyNow) window.location.href = "/cart";
  };

  return (
    <section className="max-w-7xl mx-auto px-6 py-12 lg:py-16">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
        <div className="space-y-4">
          <div className="aspect-[4/5] bg-brand-beige rounded-[min(1vw,12px)] overflow-hidden">
            <img src={images[activeImg]} alt={product.name} className="w-full h-full object-cover" />
          </div>
          {images.length > 1 && (
            <div className="grid grid-cols-4 gap-3">
              {images.map((src, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImg(i)}
                  className={`aspect-square overflow-hidden rounded-sm ring-1 ${
                    i === activeImg ? "ring-brand-rose" : "ring-black/5"
                  }`}
                >
                  <img src={src} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="space-y-8">
          <div>
            <p className="text-[10px] uppercase tracking-luxer text-brand-rose mb-3">Dénvie</p>
            <h1 className="font-display text-3xl sm:text-4xl mb-3">{product.name}</h1>
            <div className="flex items-center gap-3">
              <p className="text-xl">${Number(product.price).toFixed(2)}</p>
              {product.compare_at_price && (
                <p className="text-sm text-brand-charcoal/40 line-through">
                  ${Number(product.compare_at_price).toFixed(2)}
                </p>
              )}
            </div>
          </div>

          {product.description && (
            <p className="text-sm text-brand-charcoal/70 leading-relaxed">{product.description}</p>
          )}

          {product.colors && product.colors.length > 0 && (
            <div>
              <p className="text-[10px] uppercase tracking-luxe mb-3">Color {color && <span className="text-brand-charcoal/50">— {color}</span>}</p>
              <div className="flex flex-wrap gap-2">
                {product.colors.map((c) => (
                  <button
                    key={c}
                    onClick={() => {
                      setColor(c);
                      const idx = product.colors?.indexOf(c) ?? -1;
                      if (idx >= 0 && images[idx]) setActiveImg(idx);
                    }}
                    className={`text-xs px-4 py-2 ring-1 ${color === c ? "ring-brand-charcoal" : "ring-black/10 hover:ring-black/30"}`}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>
          )}

          {product.sizes && product.sizes.length > 0 && (
            <div>
              <p className="text-[10px] uppercase tracking-luxe mb-3">Size</p>
              <div className="flex flex-wrap gap-2">
                {product.sizes.map((s) => (
                  <button
                    key={s}
                    onClick={() => setSize(s)}
                    className={`min-w-12 text-xs px-4 py-2 ring-1 ${size === s ? "ring-brand-charcoal" : "ring-black/10 hover:ring-black/30"}`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div>
            <p className="text-[10px] uppercase tracking-luxe mb-3">Quantity</p>
            <div className="inline-flex ring-1 ring-black/10">
              <button onClick={() => setQty(Math.max(1, qty - 1))} className="size-10 hover:bg-brand-beige/40">−</button>
              <span className="size-10 grid place-items-center text-sm">{qty}</span>
              <button onClick={() => setQty(qty + 1)} className="size-10 hover:bg-brand-beige/40">+</button>
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => handleAdd(false)}
              className="flex-1 min-w-[180px] bg-brand-charcoal text-white py-4 text-xs uppercase tracking-luxe hover:bg-brand-rose transition-colors"
            >
              Add to Cart
            </button>
            <button
              onClick={() => handleAdd(true)}
              className="flex-1 min-w-[180px] bg-brand-rose text-white py-4 text-xs uppercase tracking-luxe hover:bg-brand-charcoal transition-colors"
            >
              Buy Now
            </button>
            <button
              onClick={() => toggle(product.id)}
              aria-label="Wishlist"
              className="size-12 grid place-items-center ring-1 ring-black/10 hover:ring-brand-rose"
            >
              <Heart className={`size-4 ${liked ? "fill-brand-rose text-brand-rose" : ""}`} />
            </button>
          </div>

          <a
            href={whatsappLink(`Hello, I'm interested in the ${product.name} (${product.slug}).`)}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-2 text-sm text-brand-charcoal/70 hover:text-brand-charcoal"
          >
            <MessageCircle className="size-4" /> Inquire on WhatsApp — {BRAND.phone}
          </a>

          <div className="grid grid-cols-3 gap-3 pt-6 border-t border-black/5 text-[11px] uppercase tracking-luxe text-brand-charcoal/60">
            <div className="flex flex-col items-center gap-2"><Truck className="size-4" />Free Delivery</div>
            <div className="flex flex-col items-center gap-2"><RefreshCw className="size-4" />Easy Returns</div>
            <div className="flex flex-col items-center gap-2"><ShieldCheck className="size-4" />Quality Promise</div>
          </div>

          <p className="text-xs text-brand-charcoal/50">
            <Link to="/shop" className="underline">Continue browsing</Link>
          </p>
        </div>
      </div>

      {related.length > 0 && (
        <div className="mt-24 pt-16 border-t border-black/5">
          <div className="mb-10 text-center">
            <p className="text-[10px] uppercase tracking-luxer text-brand-rose mb-2">Curated for you</p>
            <h2 className="font-display text-3xl sm:text-4xl">You may also like</h2>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-4 gap-y-12 sm:gap-x-8">
            {related.map((p) => <ProductCard key={p.id} product={p} />)}
          </div>
        </div>
      )}
    </section>
  );
}