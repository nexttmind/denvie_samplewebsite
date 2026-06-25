import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { ArrowRight } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { ProductCard, type ProductCardData } from "@/components/ProductCard";
import heroModel from "@/assets/hero-quiet-luxury.jpg";
import silks from "@/assets/collection-essentials.jpg";
import tailoring from "@/assets/collection-tailored.jpg";
import knits from "@/assets/collection-resort.jpg";
import resort from "@/assets/collection-knits.jpg";
import founder from "@/assets/founder.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Dénvie by Denise — Comfortable and Luxurious Style" },
      {
        name: "description",
        content:
          "Luxury Lebanese women's fashion. Discover curated dresses, blouses, tailoring, and sets — delivered all over Lebanon.",
      },
      { property: "og:title", content: "Dénvie by Denise" },
      { property: "og:description", content: "Comfortable and Luxurious Style" },
    ],
  }),
  component: Home,
});

function Home() {
  const { data: products = [] } = useQuery({
    queryKey: ["home-bestsellers"],
    queryFn: async () => {
      const { data } = await supabase
        .from("products")
        .select("id,slug,name,price,compare_at_price,images,is_new,is_sale,sizes,colors,is_bestseller")
        .eq("is_active", true)
        .eq("is_bestseller", true)
        .limit(4);
      return (data ?? []) as ProductCardData[];
    },
  });

  const { data: testimonials = [] } = useQuery({
    queryKey: ["home-testimonials"],
    queryFn: async () => {
      const { data } = await supabase
        .from("testimonials")
        .select("id,author,location,quote,rating")
        .eq("is_active", true)
        .order("sort_order");
      return data ?? [];
    },
  });

  const featured = [
    {
      img: knits,
      title: "New Arrivals",
      subtitle: "The Latest",
      to: "/collections/new-arrivals",
      detail: "Fresh silhouettes from the A/W 2026 edit — softly tailored pieces designed for the season ahead.",
      pieces: "Shop the latest",
    },
    {
      img: silks,
      title: "Best Sellers",
      subtitle: "Loved by All",
      to: "/collections/best-sellers",
      detail: "The Dénvie classics — pieces our community returns to again and again.",
      pieces: "Shop favourites",
    },
    {
      img: resort,
      title: "Resort Edit",
      subtitle: "Sun & Silk",
      to: "/collections/resort",
      detail: "Featherlight knits and breezy silks for slow afternoons by the Mediterranean.",
      pieces: "Shop resort",
    },
    {
      img: tailoring,
      title: "Sale",
      subtitle: "Last Pieces",
      to: "/collections/sale",
      detail: "Considered reductions on a curated edit of seasonal favourites. While stocks last.",
      pieces: "Limited pieces",
    },
  ];

  return (
    <>
      {/* Hero */}
      <section className="relative w-full -mt-16 sm:-mt-20 h-screen min-h-[680px] overflow-hidden bg-brand-canvas">
        <img
          src={heroModel}
          alt="Dénvie A/W 2026 editorial — model in a draped beige silk gown"
          width={1920}
          height={1280}
          fetchPriority="high"
          className="absolute inset-0 w-full h-full object-cover object-right animate-fade-in"
        />
        {/* Soft ivory wash on the left for typography legibility */}
        <div className="absolute inset-0 bg-gradient-to-r from-brand-canvas via-brand-canvas/70 to-transparent" />

        <div className="relative h-full max-w-7xl mx-auto px-6 sm:px-10 flex items-center">
          <div className="max-w-2xl space-y-10 pt-24 sm:pt-32">
            <span className="block text-[10px] sm:text-[11px] uppercase tracking-luxer text-brand-rose font-medium">
              A/W 2026 Collection
            </span>
            <h1 className="font-display text-[clamp(2.5rem,6vw,5.5rem)] leading-[1] tracking-[-0.01em] text-brand-charcoal">
              <span className="block">Quiet Luxury</span>
              <span className="block italic font-light text-brand-charcoal/85 whitespace-nowrap">for Modern Women</span>
            </h1>
            <p className="text-base sm:text-lg text-brand-charcoal/65 max-w-[38ch] leading-relaxed">
              Timeless silhouettes crafted for elegance and comfort.
            </p>
            <div>
              <Link
                to="/shop"
                className="group inline-flex items-center gap-4 bg-brand-charcoal text-brand-canvas px-9 py-4 text-[11px] uppercase tracking-luxer font-medium hover:bg-brand-rose transition-colors duration-500"
              >
                <span>Shop Collection</span>
                <ArrowRight className="size-3.5 group-hover:translate-x-1 transition-transform duration-500" />
              </Link>
            </div>
          </div>
        </div>

        {/* Editorial corner marks */}
        <div className="hidden sm:block absolute bottom-8 left-8 text-[10px] uppercase tracking-luxer text-brand-charcoal/40">
          Dénvie — Beirut
        </div>
        <div className="hidden sm:block absolute bottom-8 right-8 text-[10px] uppercase tracking-luxer text-brand-charcoal/40">
          N° 01 / Lookbook
        </div>
      </section>

      {/* Featured collections */}
      <section className="py-24 bg-brand-beige/30">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-6 md:gap-8">
            {featured.map((f) => (
              <Link to={f.to} key={f.title} className="group cursor-pointer space-y-3 sm:space-y-4">
                <div className="relative w-full aspect-[4/5] bg-brand-beige rounded-[min(1vw,12px)] overflow-hidden">
                  <img
                    src={f.img}
                    alt={f.subtitle}
                    loading="lazy"
                    className="w-full h-full object-cover group-hover:scale-[1.04] transition-transform duration-[1200ms] ease-out"
                  />
                  {/* Hover overlay with collection detail */}
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-brand-charcoal/85 via-brand-charcoal/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <div className="pointer-events-none absolute inset-x-0 bottom-0 p-4 sm:p-6 text-brand-canvas translate-y-3 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 delay-75">
                    <p className="hidden sm:block text-xs leading-relaxed max-w-[34ch]">{f.detail}</p>
                    <p className="text-[10px] uppercase tracking-luxer mt-2 sm:mt-3 flex items-center gap-3">
                      <span>{f.pieces}</span>
                      <span className="h-px flex-1 bg-brand-canvas/40" />
                      <span>Explore →</span>
                    </p>
                  </div>
                </div>
                <div>
                  <p className="text-[9px] sm:text-[10px] uppercase tracking-luxer text-brand-rose mb-1">
                    {f.subtitle}
                  </p>
                  <h3 className="font-display text-lg sm:text-2xl tracking-wide">{f.title}</h3>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Brand story / About teaser */}
      <section className="py-24 sm:py-32 bg-brand-canvas overflow-hidden">
        {/* Mobile: editorial polaroid stack with marquee tagline */}
        <div className="md:hidden relative">
          <style>{`@keyframes denvie-marquee{0%{transform:translateX(0)}100%{transform:translateX(-50%)}}`}</style>
          <div className="absolute inset-x-0 top-12 h-[420px] bg-brand-rose/10 -skew-y-3 origin-top-left" aria-hidden />
          <div className="relative px-6">
            <p className="text-[10px] uppercase tracking-luxer text-brand-rose mb-4">N° 02 — The Atelier</p>
            <h2 className="font-display text-[40px] leading-[1.05] text-brand-charcoal mb-10">
              Made in Beirut,<br />
              <em className="italic font-light text-brand-charcoal/70">worn everywhere.</em>
            </h2>

            <div className="relative h-[440px] mb-8">
              {/* Back card — fabric swatch feel */}
              <div className="absolute top-2 left-8 right-12 h-[300px] bg-brand-beige rotate-[-4deg] shadow-[0_20px_40px_-20px_rgba(0,0,0,0.15)]" />
              {/* Founder polaroid */}
              <div className="absolute top-8 left-4 right-16 rotate-[2deg] bg-white p-3 pb-12 shadow-[0_30px_60px_-25px_rgba(0,0,0,0.35)]">
                <div className="aspect-[4/5] overflow-hidden bg-brand-beige">
                  <img src={founder} alt="Denise Al Chalouhy" loading="lazy" className="w-full h-full object-cover" />
                </div>
                <p className="absolute bottom-3 left-0 right-0 text-center font-display italic text-sm text-brand-charcoal/70">
                  Denise — Founder
                </p>
              </div>
              {/* Quote chip overlapping */}
              <div className="absolute bottom-0 right-2 max-w-[78%] bg-brand-charcoal text-brand-canvas p-6 rotate-[-2deg] shadow-[0_20px_40px_-15px_rgba(0,0,0,0.4)]">
                <span className="block font-display text-3xl leading-none text-brand-rose mb-2">"</span>
                <p className="text-sm leading-relaxed italic">
                  A second skin — strength of tailoring, softness of silk.
                </p>
              </div>
            </div>

            <Link
              to="/about"
              className="group inline-flex items-center gap-3 bg-brand-charcoal text-brand-canvas px-6 py-3 text-[11px] uppercase tracking-luxer"
            >
              <span>Meet the Maker</span>
              <ArrowRight className="size-3.5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          {/* Endless tagline marquee */}
          <div className="mt-12 overflow-hidden border-y border-brand-charcoal/10 py-4">
            <div
              className="flex gap-10 whitespace-nowrap font-display text-2xl text-brand-charcoal/70 w-max"
              style={{ animation: "denvie-marquee 28s linear infinite" }}
            >
              {Array.from({ length: 2 }).map((_, i) => (
                <div key={i} className="flex gap-10 items-center">
                  <span>Beirut</span><span className="text-brand-rose">✦</span>
                  <span className="italic">Quiet luxury</span><span className="text-brand-rose">✦</span>
                  <span>Lebanese craft</span><span className="text-brand-rose">✦</span>
                  <span className="italic">Slow made</span><span className="text-brand-rose">✦</span>
                  <span>Dénvie</span><span className="text-brand-rose">✦</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Desktop / tablet: editorial asymmetric teaser (unchanged) */}
        <div className="hidden md:grid max-w-6xl mx-auto px-6 md:px-12 grid-cols-1 md:grid-cols-12 gap-12 lg:gap-20 items-center">
          {/* Image column */}
          <div className="md:col-span-5 relative">
            <div className="aspect-[3/4] overflow-hidden relative z-10">
              <img
                src={founder}
                alt="Denise Al Chalouhy — Founder of Dénvie"
                loading="lazy"
                className="w-full h-full object-cover bg-brand-beige"
              />
            </div>
            <div className="absolute -bottom-6 -left-6 w-full h-full bg-brand-beige -z-0 hidden md:block" />
          </div>

          {/* Content column */}
          <div className="md:col-span-7 flex flex-col items-start">
            <span className="text-[11px] uppercase tracking-luxer text-brand-rose mb-6">
              The Heart of Dénvie
            </span>
            <h2 className="font-display text-4xl md:text-5xl lg:text-6xl text-brand-charcoal leading-tight mb-8">
              A Legacy of <br />Lebanese Craft
            </h2>
            <div className="max-w-md">
              <p className="text-brand-charcoal/80 leading-relaxed mb-6 text-base sm:text-lg">
                Founded by Denise Al Chalouhy, Dénvie is more than a label — it's a celebration of
                Beirut's resilient spirit and the timeless elegance of the modern woman.
              </p>
              <p className="text-brand-charcoal/80 leading-relaxed italic mb-10 border-l-2 border-brand-rose pl-6">
                "I wanted to create garments that feel like a second skin, balancing the strength
                of structural tailoring with the softness of silk."
              </p>
              <Link
                to="/about"
                className="group inline-flex items-center gap-4 text-xs uppercase tracking-luxer text-brand-charcoal font-medium hover:opacity-70 transition-opacity"
              >
                <span className="relative">
                  Discover our story
                  <span className="absolute -bottom-1 left-0 w-full h-px bg-brand-charcoal" />
                </span>
                <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Best sellers */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex justify-between items-end mb-12">
            <div className="space-y-2">
              <span className="text-[10px] uppercase tracking-luxer text-brand-rose font-medium">
                Curated Favorites
              </span>
              <h2 className="font-display text-3xl sm:text-4xl">Best Sellers</h2>
            </div>
            <Link
              to="/shop"
              className="text-xs uppercase tracking-luxe border-b border-brand-charcoal/20 pb-1 hover:border-brand-rose"
            >
              View All
            </Link>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-4 gap-y-12 sm:gap-x-8">
            {products.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      </section>

      {/* Value props */}
      <section className="border-y border-black/5 py-16">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 lg:grid-cols-4 gap-8">
          {[
            ["Premium Quality", "Sourced from finest mills"],
            ["Fast Delivery", "All over Lebanon"],
            ["Secure Checkout", "Encrypted transactions"],
            ["Customer Support", "Dedicated personal care"],
          ].map(([t, s]) => (
            <div key={t} className="text-center space-y-2">
              <h5 className="text-[10px] uppercase tracking-luxe font-medium">{t}</h5>
              <p className="text-xs text-brand-charcoal/50">{s}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Testimonial */}
      {testimonials[0] && (
        <section className="py-24">
          <div className="max-w-xl mx-auto px-6 text-center space-y-8">
            <div className="flex justify-center gap-1 text-brand-rose">
              {Array.from({ length: testimonials[0].rating ?? 5 }).map((_, i) => (
                <span key={i}>★</span>
              ))}
            </div>
            <blockquote className="font-display text-2xl sm:text-3xl leading-relaxed text-balance">
              "{testimonials[0].quote}"
            </blockquote>
            <cite className="block text-[10px] uppercase tracking-luxe not-italic font-medium text-brand-charcoal/60">
              — {testimonials[0].author}, {testimonials[0].location}
            </cite>
          </div>
        </section>
      )}

      {/* Newsletter */}
      <section className="py-24 bg-brand-beige">
        <div className="max-w-2xl mx-auto px-6 text-center space-y-8">
          <div className="space-y-4">
            <h2 className="font-display text-3xl sm:text-4xl">Join the Inner Circle</h2>
            <p className="text-sm text-brand-charcoal/60 max-w-[48ch] mx-auto">
              Be the first to know about new arrivals, private sales, and seasonal lookbooks.
            </p>
          </div>
          <NewsletterForm />
        </div>
      </section>
    </>
  );
}

function NewsletterForm() {
  return (
    <form
      onSubmit={async (e) => {
        e.preventDefault();
        const fd = new FormData(e.currentTarget);
        const email = String(fd.get("email") ?? "");
        if (!email) return;
        const { error } = await supabase.from("newsletter_subscribers").insert({ email });
        const { toast } = await import("sonner");
        if (error) toast.error("Could not subscribe. Try again.");
        else {
          toast.success("Welcome to the Inner Circle.");
          (e.target as HTMLFormElement).reset();
        }
      }}
      className="flex flex-col sm:flex-row gap-0 ring-1 ring-black/5"
    >
      <input
        name="email"
        type="email"
        required
        placeholder="Your email address"
        className="flex-1 bg-white/60 px-6 py-4 text-sm focus:outline-none placeholder:text-brand-charcoal/30"
      />
      <button className="bg-brand-charcoal text-white uppercase text-xs tracking-luxe font-medium px-8 py-4 hover:bg-brand-rose transition-colors">
        Subscribe
      </button>
    </form>
  );
}
