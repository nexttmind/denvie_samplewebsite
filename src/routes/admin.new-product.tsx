import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { checkAdmin } from "@/hooks/useAuth";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/new-product")({
  component: NewProduct,
});

function NewProduct() {
  const navigate = useNavigate();
  const [allowed, setAllowed] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    checkAdmin().then((ok) => {
      if (!ok) navigate({ to: "/" });
      else setAllowed(true);
    });
  }, [navigate]);

  if (!allowed) return <section className="py-24 text-center text-sm">…</section>;

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSaving(true);
    const fd = new FormData(e.currentTarget);
    const slug = String(fd.get("slug")).toLowerCase().replace(/[^a-z0-9-]+/g, "-");
    const { error } = await supabase.from("products").insert({
      slug,
      name: String(fd.get("name")),
      description: String(fd.get("description") ?? ""),
      price: Number(fd.get("price")),
      stock: Number(fd.get("stock") ?? 0),
      sizes: String(fd.get("sizes") ?? "").split(",").map((s) => s.trim()).filter(Boolean),
      colors: String(fd.get("colors") ?? "").split(",").map((s) => s.trim()).filter(Boolean),
      images: String(fd.get("images") ?? "").split(",").map((s) => s.trim()).filter(Boolean),
      is_active: true,
    });
    setSaving(false);
    if (error) toast.error(error.message);
    else {
      toast.success("Product created");
      navigate({ to: "/admin" });
    }
  };

  return (
    <section className="max-w-2xl mx-auto px-6 py-16">
      <h1 className="font-display text-3xl mb-8">New Product</h1>
      <form onSubmit={onSubmit} className="space-y-4">
        <Input name="name" placeholder="Name" required />
        <Input name="slug" placeholder="Slug (e.g. aria-linen-midi)" required />
        <textarea name="description" placeholder="Description" rows={4} className="w-full bg-white/60 px-5 py-4 text-sm ring-1 ring-black/5 focus:outline-none focus:ring-brand-rose" />
        <Input name="price" type="number" step="0.01" placeholder="Price" required />
        <Input name="stock" type="number" placeholder="Stock" />
        <Input name="sizes" placeholder="Sizes (comma separated)" />
        <Input name="colors" placeholder="Colors (comma separated)" />
        <Input name="images" placeholder="Image paths (e.g. /src/assets/product-1.jpg)" />
        <button disabled={saving} className="w-full bg-brand-charcoal text-white py-4 text-xs uppercase tracking-luxe hover:bg-brand-rose disabled:opacity-50">
          {saving ? "Saving…" : "Save Product"}
        </button>
      </form>
    </section>
  );
}

function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return <input {...props} className="w-full bg-white/60 px-5 py-4 text-sm ring-1 ring-black/5 focus:outline-none focus:ring-brand-rose" />;
}