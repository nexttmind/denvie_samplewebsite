import { Link } from "@tanstack/react-router";
import { Search, Heart, ShoppingBag, User, Menu, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useCart, useWishlist } from "@/hooks/useCart";
import { SearchOverlay } from "@/components/SearchOverlay";

const NAV = [
  { to: "/shop", label: "Shop" },
  { to: "/collections", label: "Collections" },
  { to: "/about", label: "About" },
  { to: "/contact", label: "Contact" },
];

export function Header() {
  const { count } = useCart();
  const { count: wcount } = useWishlist();
  const [open, setOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav
      className={
        "sticky top-0 z-50 w-full transition-all duration-500 " +
        (scrolled
          ? "bg-brand-canvas/90 backdrop-blur-md border-b border-black/5 shadow-[0_1px_24px_-12px_rgba(0,0,0,0.15)]"
          : "bg-transparent border-b border-transparent")
      }
    >
      <div className="max-w-7xl mx-auto px-6 h-16 sm:h-20 flex items-center justify-between gap-4">
        <button
          className="lg:hidden -ml-2 p-2"
          onClick={() => setOpen((o) => !o)}
          aria-label="Toggle menu"
        >
          {open ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>

        <div className="hidden lg:flex items-center gap-8">
          {NAV.map((n) => (
            <Link
              key={n.to}
              to={n.to}
              className="text-xs uppercase tracking-luxe font-medium text-brand-charcoal/70 hover:text-brand-charcoal transition-colors"
              activeProps={{ className: "text-brand-charcoal" }}
            >
              {n.label}
            </Link>
          ))}
        </div>

        <Link to="/" className="flex flex-col items-center absolute left-1/2 -translate-x-1/2">
          <span className="font-display text-xl sm:text-2xl tracking-[0.15em] uppercase">
            Dénvie
          </span>
          <span className="text-[8px] tracking-luxer uppercase opacity-60 -mt-1">By Denise</span>
        </Link>

        <div className="flex items-center gap-4 sm:gap-6">
          <button
            aria-label="Search"
            onClick={() => setSearchOpen(true)}
            className="hover:text-brand-rose transition-colors"
          >
            <Search className="size-4" />
          </button>
          <Link to="/wishlist" aria-label="Wishlist" className="hidden sm:flex relative hover:text-brand-rose">
            <Heart className="size-4" />
            {wcount > 0 && (
              <span className="absolute -top-1.5 -right-2 text-[9px] bg-brand-rose text-white rounded-full size-4 flex items-center justify-center">
                {wcount}
              </span>
            )}
          </Link>
          <Link to="/account" aria-label="Account" className="hidden sm:block hover:text-brand-rose">
            <User className="size-4" />
          </Link>
          <Link to="/cart" aria-label="Cart" className="flex items-center gap-2 hover:text-brand-rose">
            <span className="relative inline-flex">
              <ShoppingBag className="size-4" />
              {count > 0 && (
                <span className="absolute -top-1.5 -right-2 text-[9px] bg-brand-rose text-white rounded-full size-4 flex items-center justify-center">
                  {count}
                </span>
              )}
            </span>
            <span className="text-xs font-medium hidden sm:inline">Cart</span>
          </Link>
        </div>
      </div>

      {open && (
        <div className="lg:hidden border-t border-black/5 bg-brand-canvas">
          <div className="px-6 py-6 flex flex-col gap-4">
            {NAV.map((n) => (
              <Link
                key={n.to}
                to={n.to}
                onClick={() => setOpen(false)}
                className="text-sm uppercase tracking-luxe font-medium"
              >
                {n.label}
              </Link>
            ))}
            <Link to="/wishlist" onClick={() => setOpen(false)} className="text-sm uppercase tracking-luxe">
              Wishlist
            </Link>
            <Link to="/account" onClick={() => setOpen(false)} className="text-sm uppercase tracking-luxe">
              Account
            </Link>
          </div>
        </div>
      )}
      <SearchOverlay open={searchOpen} onClose={() => setSearchOpen(false)} />
    </nav>
  );
}