import { createFileRoute } from "@tanstack/react-router";
import founder from "@/assets/founder.jpg";
import heroModel from "@/assets/hero-model.jpg";
import { BRAND } from "@/lib/brand";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "Our Story — Dénvie by Denise" },
      { name: "description", content: "The story of Dénvie by Denise — a Lebanese luxury fashion house founded by Denise Al Chalouhy." },
    ],
  }),
  component: About,
});

function About() {
  return (
    <>
      <section className="max-w-5xl mx-auto px-6 py-20 text-center">
        <p className="text-[10px] uppercase tracking-luxer text-brand-rose mb-3">Our Story</p>
        <h1 className="font-display text-4xl sm:text-6xl leading-[1.05] mb-8">
          A Lebanese house of quiet, considered luxury.
        </h1>
        <p className="text-base sm:text-lg text-brand-charcoal/70 max-w-2xl mx-auto leading-relaxed">
          Dénvie was born from a belief that true elegance is comfortable. Every piece is designed
          and curated by {BRAND.founder} in Beirut, with the modern woman in mind — refined,
          confident, unbothered.
        </p>
      </section>

      <section className="bg-brand-beige/40 py-24">
        <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-2 gap-16 items-center">
          <img src={heroModel} alt="Dénvie atelier" loading="lazy" className="w-full aspect-[4/5] object-cover rounded-[min(1vw,12px)]" />
          <div className="space-y-8">
            <div>
              <p className="text-[10px] uppercase tracking-luxer text-brand-rose mb-2">Our Mission</p>
              <h2 className="font-display text-3xl mb-3">Effortless luxury, made personal.</h2>
              <p className="text-sm text-brand-charcoal/70 leading-relaxed">
                We design clothes that move with you — fluid silhouettes in the finest fabrics,
                cut to flatter, made to last beyond a season.
              </p>
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-luxer text-brand-rose mb-2">Our Vision</p>
              <h2 className="font-display text-3xl mb-3">Lebanon's voice in modern fashion.</h2>
              <p className="text-sm text-brand-charcoal/70 leading-relaxed">
                To celebrate the spirit of the Lebanese woman through pieces that travel, that
                gather, that remain part of the wardrobe.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-24">
        <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-2 gap-16 items-center">
          <div className="space-y-6 order-2 md:order-1">
            <p className="text-[10px] uppercase tracking-luxer text-brand-rose">The Founder</p>
            <h2 className="font-display text-3xl sm:text-4xl">{BRAND.founder}</h2>
            <p className="text-sm text-brand-charcoal/70 leading-relaxed">
              Denise founded Dénvie with one principle: that style and comfort are not opposites.
              From sourcing to fitting, she leads every step — and every piece carries her care.
            </p>
            <a
              href={BRAND.instagramOwner}
              target="_blank"
              rel="noreferrer"
              className="inline-block text-xs uppercase tracking-luxe border-b border-brand-charcoal/30 pb-1 hover:border-brand-rose"
            >
              Follow @denise.joee
            </a>
          </div>
          <img src={founder} alt={BRAND.founder} loading="lazy" className="w-full aspect-[4/5] object-cover rounded-[min(1vw,12px)] order-1 md:order-2" />
        </div>
      </section>
    </>
  );
}