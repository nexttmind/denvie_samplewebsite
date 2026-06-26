import type { ProductCardData } from "@/components/ProductCard";

export type Category = {
  id: string;
  slug: string;
  name: string;
  sort_order: number;
};

export type Collection = {
  id: string;
  slug: string;
  name: string;
  description: string;
  banner_url?: string;
  sort_order: number;
};

export type Product = ProductCardData & {
  description?: string;
  category_id?: string;
  collection_id?: string;
  is_bestseller?: boolean;
  is_active?: boolean;
  created_at: string;
};

export type Testimonial = {
  id: string;
  author: string;
  location: string;
  quote: string;
  rating: number;
};

const CATEGORIES: Category[] = [
  { id: "cat-dresses", slug: "dresses", name: "Dresses", sort_order: 1 },
  { id: "cat-tops", slug: "tops", name: "Tops", sort_order: 2 },
  { id: "cat-sets", slug: "sets", name: "Sets", sort_order: 3 },
  { id: "cat-skirts", slug: "skirts", name: "Skirts", sort_order: 4 },
];

const COLLECTIONS: Collection[] = [
  {
    id: "col-new",
    slug: "new-arrivals",
    name: "New Arrivals",
    description: "Fresh silhouettes from the A/W 2026 edit — softly tailored pieces designed for the season ahead.",
    sort_order: 1,
  },
  {
    id: "col-best",
    slug: "best-sellers",
    name: "Best Sellers",
    description: "The Dénvie classics — pieces our community returns to again and again.",
    sort_order: 2,
  },
  {
    id: "col-resort",
    slug: "resort",
    name: "Resort Edit",
    description: "Featherlight knits and breezy silks for slow afternoons by the Mediterranean.",
    sort_order: 3,
  },
  {
    id: "col-sale",
    slug: "sale",
    name: "Sale",
    description: "Considered reductions on a curated edit of seasonal favourites. While stocks last.",
    sort_order: 4,
  },
];

const PRODUCTS: Product[] = [
  {
    id: "p1",
    slug: "silk-draped-gown",
    name: "Silk Draped Gown",
    price: 289,
    compare_at_price: null,
    images: ["/src/assets/product-1.jpg"],
    is_new: true,
    is_sale: false,
    is_bestseller: true,
    is_active: true,
    sizes: ["XS", "S", "M", "L"],
    colors: ["Ivory"],
    category_id: "cat-dresses",
    collection_id: "col-best",
    description: "Fluid silk with a soft drape and quiet-luxury finish — designed for evening and occasion dressing.",
    created_at: "2026-01-15T00:00:00Z",
  },
  {
    id: "p2",
    slug: "tailored-blazer-dress",
    name: "Tailored Blazer Dress",
    price: 245,
    compare_at_price: null,
    images: ["/src/assets/product-2.jpg"],
    is_new: true,
    is_sale: false,
    is_bestseller: true,
    is_active: true,
    sizes: ["S", "M", "L"],
    colors: ["Camel"],
    category_id: "cat-dresses",
    collection_id: "col-new",
    description: "Structured shoulders with a relaxed skirt line — polished enough for dinner, comfortable enough for all day.",
    created_at: "2026-02-01T00:00:00Z",
  },
  {
    id: "p3",
    slug: "linen-wrap-blouse",
    name: "Linen Wrap Blouse",
    price: 128,
    compare_at_price: 158,
    images: ["/src/assets/product-3.jpg"],
    is_new: false,
    is_sale: true,
    is_bestseller: true,
    is_active: true,
    sizes: ["XS", "S", "M", "L", "XL"],
    colors: ["Sand", "White"],
    category_id: "cat-tops",
    collection_id: "col-sale",
    description: "Breathable linen with a flattering wrap cut — an everyday essential with a refined hand.",
    created_at: "2025-11-10T00:00:00Z",
  },
  {
    id: "p4",
    slug: "pleated-midi-skirt",
    name: "Pleated Midi Skirt",
    price: 165,
    compare_at_price: null,
    images: ["/src/assets/product-4.jpg"],
    is_new: false,
    is_sale: false,
    is_bestseller: true,
    is_active: true,
    sizes: ["XS", "S", "M", "L"],
    colors: ["Black"],
    category_id: "cat-skirts",
    collection_id: "col-best",
    description: "Fine pleats with gentle movement — pairs effortlessly with knits and tailoring from the same edit.",
    created_at: "2025-12-05T00:00:00Z",
  },
  {
    id: "p5",
    slug: "resort-linen-set-cream",
    name: "Resort Linen Set — Cream",
    price: 198,
    images: ["/src/assets/sets/686235541_18052554656751757_459677585304781708_n.jpg"],
    is_new: true,
    is_bestseller: false,
    is_active: true,
    sizes: ["S", "M", "L"],
    colors: ["Cream"],
    category_id: "cat-sets",
    collection_id: "col-resort",
    description: "A coordinated two-piece in airy linen — relaxed resort dressing with a polished finish.",
    created_at: "2026-02-20T00:00:00Z",
  },
  {
    id: "p6",
    slug: "evening-set-rose",
    name: "Evening Set — Rose",
    price: 275,
    images: ["/src/assets/sets/687675516_18052554674751757_688509099294867561_n.jpg"],
    is_new: true,
    is_bestseller: false,
    is_active: true,
    sizes: ["S", "M", "L"],
    colors: ["Rose"],
    category_id: "cat-sets",
    collection_id: "col-new",
    description: "Soft rose tones with a refined silhouette — an elevated set for evenings out.",
    created_at: "2026-02-18T00:00:00Z",
  },
  {
    id: "p7",
    slug: "tailored-coord-set",
    name: "Tailored Coord Set",
    price: 320,
    compare_at_price: 380,
    images: ["/src/assets/sets/688444083_18052554935751757_4295382456932081352_n.jpg"],
    is_sale: true,
    is_bestseller: false,
    is_active: true,
    sizes: ["S", "M", "L"],
    colors: ["Taupe"],
    category_id: "cat-sets",
    collection_id: "col-sale",
    description: "Clean lines and considered proportions — modern tailoring in a wearable coord.",
    created_at: "2025-10-01T00:00:00Z",
  },
  {
    id: "p8",
    slug: "knit-lounge-set",
    name: "Knit Lounge Set",
    price: 185,
    images: ["/src/assets/sets/689263451_18052554665751757_1410251385940074137_n.jpg"],
    is_bestseller: false,
    is_active: true,
    sizes: ["S", "M", "L", "XL"],
    colors: ["Oat"],
    category_id: "cat-sets",
    collection_id: "col-resort",
    description: "Soft knit with a relaxed fit — comfort-first luxury for travel and downtime.",
    created_at: "2026-01-28T00:00:00Z",
  },
  {
    id: "p9",
    slug: "satin-evening-set",
    name: "Satin Evening Set",
    price: 295,
    images: ["/src/assets/sets/689782854_18052554620751757_1684108676654769484_n.jpg"],
    is_bestseller: true,
    is_active: true,
    sizes: ["S", "M", "L"],
    colors: ["Champagne"],
    category_id: "cat-sets",
    collection_id: "col-best",
    description: "Lustrous satin with an easy drape — occasion dressing without sacrificing comfort.",
    created_at: "2025-12-20T00:00:00Z",
  },
  {
    id: "p10",
    slug: "day-to-night-set",
    name: "Day-to-Night Set",
    price: 210,
    images: ["/src/assets/sets/689865199_18052554962751757_906014087717347504_n.jpg"],
    is_bestseller: false,
    is_active: true,
    sizes: ["XS", "S", "M", "L"],
    colors: ["Stone"],
    category_id: "cat-sets",
    collection_id: "col-new",
    description: "Versatile pieces that transition from brunch to evening — effortless and refined.",
    created_at: "2026-02-10T00:00:00Z",
  },
  {
    id: "p11",
    slug: "signature-luxe-set",
    name: "Signature Luxe Set",
    price: 340,
    images: ["/src/assets/sets/693391971_18052554953751757_4483155544622230184_n.jpg"],
    is_bestseller: true,
    is_active: true,
    sizes: ["S", "M", "L"],
    colors: ["Ivory", "Black"],
    category_id: "cat-sets",
    collection_id: "col-best",
    description: "The signature Dénvie set — elevated fabrics, relaxed tailoring, and timeless appeal.",
    created_at: "2026-01-05T00:00:00Z",
  },
];

const TESTIMONIALS: Testimonial[] = [
  {
    id: "t1",
    author: "Maya K.",
    location: "Beirut",
    quote: "The quality is exceptional — every piece feels considered and luxurious without being fussy.",
    rating: 5,
  },
  {
    id: "t2",
    author: "Rana S.",
    location: "Jounieh",
    quote: "Finally a Lebanese brand that balances elegance with everyday comfort. My go-to for special occasions.",
    rating: 5,
  },
  {
    id: "t3",
    author: "Nadia H.",
    location: "Byblos",
    quote: "Beautiful packaging, fast delivery across Lebanon, and the fit is always perfect.",
    rating: 5,
  },
];

export function getCategories(): Category[] {
  return [...CATEGORIES].sort((a, b) => a.sort_order - b.sort_order);
}

export function getCollections() {
  return COLLECTIONS.map((col) => ({
    ...col,
    productCount: PRODUCTS.filter((p) => p.is_active !== false && p.collection_id === col.id).length,
  })).sort((a, b) => a.sort_order - b.sort_order);
}

export function getCollectionBySlug(slug: string) {
  const col = COLLECTIONS.find((c) => c.slug === slug);
  if (!col) return null;
  const products = PRODUCTS.filter((p) => p.is_active !== false && p.collection_id === col.id);
  return { col, products, count: products.length };
}

export function getActiveProducts(): Product[] {
  return PRODUCTS.filter((p) => p.is_active !== false);
}

export function getProductBySlug(slug: string): Product | undefined {
  return PRODUCTS.find((p) => p.slug === slug && p.is_active !== false);
}

export function getProductsByIds(ids: string[]): Product[] {
  const set = new Set(ids);
  return PRODUCTS.filter((p) => set.has(p.id) && p.is_active !== false);
}

export function getBestsellers(limit = 4): Product[] {
  return PRODUCTS.filter((p) => p.is_active !== false && p.is_bestseller).slice(0, limit);
}

export function getRelatedProducts(product: Product, limit = 8): Product[] {
  let related = PRODUCTS.filter((p) => p.id !== product.id && p.is_active !== false);
  if (product.category_id) {
    related = related.filter((p) => p.category_id === product.category_id);
  }
  return related.slice(0, limit);
}

export function getTestimonials(): Testimonial[] {
  return TESTIMONIALS;
}
