import { Link } from "@tanstack/react-router";
import { BRAND } from "@/lib/brand";
import { Instagram } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-brand-canvas pt-20 pb-12 border-t border-black/5">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 mb-20">
          <div className="lg:col-span-2 space-y-6">
            <Link to="/" className="flex flex-col w-fit">
              <span className="font-display text-2xl tracking-[0.15em] uppercase">Dénvie</span>
              <span className="text-[10px] tracking-luxer uppercase opacity-60 -mt-1">By Denise</span>
            </Link>
            <p className="text-sm text-brand-charcoal/60 max-w-[35ch] leading-relaxed">
              Curating a legacy of comfortable and luxurious style for the modern Lebanese woman.
              Founded by {BRAND.founder}.
            </p>
            <div className="flex gap-6">
              <a
                href={BRAND.instagramBrand}
                target="_blank"
                rel="noreferrer"
                className="text-xs text-brand-charcoal/50 hover:text-brand-charcoal uppercase tracking-luxe font-medium flex items-center gap-2"
              >
                <Instagram className="size-3.5" /> @denvie_lb
              </a>
              <a
                href={BRAND.whatsapp}
                target="_blank"
                rel="noreferrer"
                className="text-xs text-brand-charcoal/50 hover:text-brand-charcoal uppercase tracking-luxe font-medium"
              >
                WhatsApp
              </a>
            </div>
          </div>

          <div className="space-y-6">
            <h6 className="text-[10px] uppercase tracking-luxe font-semibold">Shopping</h6>
            <ul className="space-y-4">
              <li><Link to="/shop" className="text-sm text-brand-charcoal/60 hover:text-brand-charcoal">All Products</Link></li>
              <li><Link to="/collections/new-arrivals" className="text-sm text-brand-charcoal/60 hover:text-brand-charcoal">New Arrivals</Link></li>
              <li><Link to="/collections/best-sellers" className="text-sm text-brand-charcoal/60 hover:text-brand-charcoal">Best Sellers</Link></li>
              <li><Link to="/collections/sale" className="text-sm text-brand-charcoal/60 hover:text-brand-charcoal">Sale</Link></li>
            </ul>
          </div>

          <div className="space-y-6">
            <h6 className="text-[10px] uppercase tracking-luxe font-semibold">Company</h6>
            <ul className="space-y-4">
              <li><Link to="/about" className="text-sm text-brand-charcoal/60 hover:text-brand-charcoal">Our Story</Link></li>
              <li><Link to="/contact" className="text-sm text-brand-charcoal/60 hover:text-brand-charcoal">Delivery Info</Link></li>
              <li><Link to="/contact" className="text-sm text-brand-charcoal/60 hover:text-brand-charcoal">Contact Us</Link></li>
            </ul>
          </div>

          <div className="space-y-6">
            <h6 className="text-[10px] uppercase tracking-luxe font-semibold">Support</h6>
            <p className="text-sm text-brand-charcoal/60 leading-relaxed">
              {BRAND.phone}<br />
              {BRAND.delivery}
            </p>
          </div>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-center pt-8 border-t border-black/5 gap-4">
          <p className="text-[10px] uppercase tracking-luxe text-brand-charcoal/40">
            © {new Date().getFullYear()} Dénvie by Denise. All Rights Reserved.
          </p>
          <p className="text-[10px] uppercase tracking-luxe text-brand-charcoal/40">Made in Lebanon</p>
        </div>
      </div>
    </footer>
  );
}