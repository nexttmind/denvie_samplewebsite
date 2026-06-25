import { BRAND } from "@/lib/brand";
import { MessageCircle } from "lucide-react";

export function WhatsAppButton({ message }: { message?: string }) {
  const href = message ? `${BRAND.whatsapp}?text=${encodeURIComponent(message)}` : BRAND.whatsapp;
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      aria-label="Chat on WhatsApp"
      className="fixed bottom-6 right-6 z-50 bg-[#25D366] text-white size-12 flex items-center justify-center rounded-full ring-4 ring-white/30 shadow-lg hover:scale-105 transition-transform"
    >
      <MessageCircle className="size-5" />
    </a>
  );
}