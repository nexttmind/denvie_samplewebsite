import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { BRAND, whatsappLink } from "@/lib/brand";
import { Phone, MessageCircle, Mail, MapPin, Clock } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact — Dénvie by Denise" },
      { name: "description", content: "Reach the Dénvie team via WhatsApp, phone, or email. Delivery across Lebanon." },
    ],
  }),
  component: Contact,
});

function Contact() {
  const [sending, setSending] = useState(false);
  return (
    <section className="max-w-6xl mx-auto px-6 py-20">
      <header className="text-center mb-16">
        <p className="text-[10px] uppercase tracking-luxer text-brand-rose mb-3">Get in Touch</p>
        <h1 className="font-display text-4xl sm:text-5xl">We'd love to hear from you</h1>
      </header>

      <div className="grid md:grid-cols-2 gap-12">
        <form
          onSubmit={async (e) => {
            e.preventDefault();
            setSending(true);
            const fd = new FormData(e.currentTarget);
            const msg = `Hello Dénvie — message from ${fd.get("name")} (${fd.get("email")}): ${fd.get("message")}`;
            setTimeout(() => {
              window.open(whatsappLink(msg), "_blank");
              toast.success("Opening WhatsApp to send your message");
              setSending(false);
              (e.target as HTMLFormElement).reset();
            }, 200);
          }}
          className="space-y-5"
        >
          <input name="name" required placeholder="Your name" className="w-full bg-white/60 px-5 py-4 text-sm ring-1 ring-black/5 focus:outline-none focus:ring-brand-rose" />
          <input name="email" type="email" required placeholder="Email address" className="w-full bg-white/60 px-5 py-4 text-sm ring-1 ring-black/5 focus:outline-none focus:ring-brand-rose" />
          <textarea name="message" required rows={6} placeholder="Your message" className="w-full bg-white/60 px-5 py-4 text-sm ring-1 ring-black/5 focus:outline-none focus:ring-brand-rose" />
          <button disabled={sending} className="w-full bg-brand-charcoal text-white py-4 text-xs uppercase tracking-luxe hover:bg-brand-rose transition-colors disabled:opacity-50">
            {sending ? "Sending…" : "Send Message"}
          </button>
        </form>

        <div className="space-y-8 bg-brand-beige/40 p-8 lg:p-12">
          <div className="flex gap-4">
            <MessageCircle className="size-5 mt-1 text-brand-rose" />
            <div>
              <p className="text-[10px] uppercase tracking-luxe mb-1">WhatsApp</p>
              <a href={BRAND.whatsapp} target="_blank" rel="noreferrer" className="text-sm hover:underline">{BRAND.phone}</a>
            </div>
          </div>
          <div className="flex gap-4">
            <Phone className="size-5 mt-1 text-brand-rose" />
            <div>
              <p className="text-[10px] uppercase tracking-luxe mb-1">Phone</p>
              <a href={`tel:${BRAND.phone}`} className="text-sm hover:underline">{BRAND.phone}</a>
            </div>
          </div>
          <div className="flex gap-4">
            <Mail className="size-5 mt-1 text-brand-rose" />
            <div>
              <p className="text-[10px] uppercase tracking-luxe mb-1">Email</p>
              <a href={`mailto:${BRAND.email}`} className="text-sm hover:underline">{BRAND.email}</a>
            </div>
          </div>
          <div className="flex gap-4">
            <MapPin className="size-5 mt-1 text-brand-rose" />
            <div>
              <p className="text-[10px] uppercase tracking-luxe mb-1">Delivery</p>
              <p className="text-sm">{BRAND.delivery}</p>
            </div>
          </div>
          <div className="flex gap-4">
            <Clock className="size-5 mt-1 text-brand-rose" />
            <div>
              <p className="text-[10px] uppercase tracking-luxe mb-1">Hours</p>
              <p className="text-sm">Mon–Sat, 10:00 — 19:00</p>
            </div>
          </div>

          <iframe
            title="Lebanon"
            src="https://www.openstreetmap.org/export/embed.html?bbox=35.45%2C33.85%2C35.55%2C33.92&layer=mapnik&marker=33.8886%2C35.4955"
            className="w-full h-56 mt-6 grayscale"
            loading="lazy"
          />
        </div>
      </div>
    </section>
  );
}