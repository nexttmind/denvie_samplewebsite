import { Link } from "@tanstack/react-router";
import { Heart } from "lucide-react";
import { resolveImage } from "@/lib/product-images";
import { useCart, useWishlist } from "@/hooks/useCart";
import { toast } from "sonner";

export type ProductCardData = {
  id: string;
  slug: string;
  name: string;
  price: number;
  compare_at_price?: number | null;
  images: string[] | null;
  is_new?: boolean | null;
  is_sale?: boolean | null;
  sizes?: string[] | null;
  colors?: string[] | null;
};

export function ProductCard({ product }: { product: ProductCardData }) {
  const img = resolveImage(product.images?.[0]);
  const { add } = useCart();
  const { has, toggle } = useWishlist();
  const liked = has(product.id);

  return (
    <div className="group">
      <div className="relative mb-4 overflow-hidden rounded-[min(1vw,12px)]">
        <Link to="/product/$slug" params={{ slug: product.slug }}>
          <div className="aspect-[3/4] bg-brand-beige overflow-hidden">
            <img
              src={img}
              alt={product.name}
              loading="lazy"
              className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-700"
            />
          </div>
        </Link>
        <button
          onClick={(e) => {
            e.preventDefault();
            toggle(product.id);
          }}
          aria-label="Toggle wishlist"
          className="absolute top-3 right-3 size-9 grid place-items-center rounded-full bg-brand-canvas/90 backdrop-blur ring-1 ring-black/5 hover:scale-105 transition"
        >
          <Heart className={`size-4 ${liked ? "fill-brand-rose text-brand-rose" : ""}`} />
        </button>
        {(product.is_new || product.is_sale) && (
          <span className="absolute top-3 left-3 px-2 py-1 text-[9px] uppercase tracking-luxe bg-brand-canvas/90 backdrop-blur rounded-sm">
            {product.is_sale ? "Sale" : "New"}
          </span>
        )}
        <button
          onClick={() => {
            add({
              productId: product.id,
              slug: product.slug,
              name: product.name,
              price: Number(product.price),
              image: product.images?.[0] ?? "",
              size: product.sizes?.[0],
              color: product.colors?.[0],
              quantity: 1,
            });
            toast.success(`${product.name} added to cart`);
          }}
          className="absolute bottom-4 left-4 right-4 bg-brand-canvas py-3 text-[10px] uppercase tracking-luxe font-medium opacity-0 group-hover:opacity-100 transition-opacity ring-1 ring-black/5"
        >
          Quick Add
        </button>
      </div>
      <Link to="/product/$slug" params={{ slug: product.slug }} className="block">
        <h4 className="text-sm font-medium text-brand-charcoal/90 mb-1">{product.name}</h4>
        <div className="flex items-center gap-2">
          <p className="text-sm text-brand-charcoal/60">${Number(product.price).toFixed(2)}</p>
          {product.compare_at_price && (
            <p className="text-xs text-brand-charcoal/40 line-through">
              ${Number(product.compare_at_price).toFixed(2)}
            </p>
          )}
        </div>
      </Link>
    </div>
  );
}