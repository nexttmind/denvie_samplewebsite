import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { checkAdmin } from "@/hooks/useAuth";
import { toast } from "sonner";
import { Trash2, Plus, X, AlertTriangle, Upload, Image as ImageIcon } from "lucide-react";
import { resolveImage } from "@/lib/product-images";

export const Route = createFileRoute("/admin/products")({
  head: () => ({ meta: [{ title: "Products — Admin — Dénvie" }] }),
  component: AdminProducts,
});

const LOW_STOCK_THRESHOLD = 5;

type ProductRow = {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  price: number;
  compare_at_price: number | null;
  stock: number;
  sizes: string[] | null;
  colors: string[] | null;
  images: string[] | null;
  is_active: boolean | null;
  is_sale: boolean | null;
  category_id: string | null;
};

type Category = { id: string; name: string; slug: string };

function AdminProducts() {
  const navigate = useNavigate();
  const qc = useQueryClient();
  const [allowed, setAllowed] = useState<boolean | null>(null);
  const [editing, setEditing] = useState<ProductRow | null>(null);
  const [creating, setCreating] = useState(false);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"all" | "low" | "out">("all");

  useEffect(() => {
    checkAdmin().then((ok) => {
      if (!ok) {
        toast.error("Admin access required");
        navigate({ to: "/" });
      } else setAllowed(true);
    });
  }, [navigate]);

  const { data: products = [], isLoading } = useQuery({
    queryKey: ["admin-products-full"],
    enabled: allowed === true,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("products")
        .select("id,slug,name,description,price,compare_at_price,stock,sizes,colors,images,is_active,is_sale,category_id")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return (data ?? []) as ProductRow[];
    },
  });

  const { data: categories = [] } = useQuery({
    queryKey: ["admin-categories"],
    enabled: allowed === true,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("categories")
        .select("id,name,slug")
        .order("sort_order", { ascending: true });
      if (error) throw error;
      return (data ?? []) as Category[];
    },
  });

  const lowStock = useMemo(() => products.filter((p) => p.stock > 0 && p.stock <= LOW_STOCK_THRESHOLD), [products]);
  const outOfStock = useMemo(() => products.filter((p) => p.stock === 0), [products]);

  const filtered = useMemo(() => {
    let list = products;
    if (filter === "low") list = lowStock;
    if (filter === "out") list = outOfStock;
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter((p) => p.name.toLowerCase().includes(q) || p.slug.toLowerCase().includes(q));
    }
    return list;
  }, [products, filter, search, lowStock, outOfStock]);

  const removeProduct = async (id: string, name: string) => {
    if (!confirm(`Delete "${name}"? This cannot be undone.`)) return;
    const { error } = await supabase.from("products").delete().eq("id", id);
    if (error) return toast.error(error.message);
    toast.success("Product deleted");
    qc.invalidateQueries({ queryKey: ["admin-products-full"] });
  };

  const toggleActive = async (p: ProductRow) => {
    const { error } = await supabase.from("products").update({ is_active: !p.is_active }).eq("id", p.id);
    if (error) return toast.error(error.message);
    qc.invalidateQueries({ queryKey: ["admin-products-full"] });
  };

  if (allowed !== true) return <section className="py-24 text-center text-sm">Verifying access…</section>;

  return (
    <section className="max-w-7xl mx-auto px-6 py-12">
      <div className="flex flex-wrap items-end justify-between gap-4 mb-8">
        <div>
          <p className="text-[10px] uppercase tracking-luxer text-brand-rose mb-2">Admin</p>
          <h1 className="font-display text-4xl">Products</h1>
        </div>
        <div className="flex gap-3">
          <Link to="/admin" className="text-xs uppercase tracking-luxe border-b border-brand-charcoal/30 pb-1 hover:border-brand-rose">← Dashboard</Link>
          <button
            onClick={() => setCreating(true)}
            className="bg-brand-charcoal text-white px-5 py-3 text-[10px] uppercase tracking-luxe hover:bg-brand-rose flex items-center gap-2"
          >
            <Plus className="size-3" /> New Product
          </button>
        </div>
      </div>

      {(lowStock.length > 0 || outOfStock.length > 0) && (
        <button
          type="button"
          onClick={() => {
            setFilter(outOfStock.length > 0 ? "out" : "low");
            setSearch("");
          }}
          className="w-full text-left mb-6 border border-amber-300 bg-amber-50/70 hover:bg-amber-100/80 transition p-4 rounded-sm"
        >
          <div className="flex items-start gap-3">
            <AlertTriangle className="size-5 text-amber-600 mt-0.5 shrink-0" />
            <div className="flex-1">
              <p className="font-medium text-sm text-amber-900 mb-1">Stock Alerts <span className="text-[10px] uppercase tracking-luxe text-amber-700 ml-2">click to filter →</span></p>
              <p className="text-xs text-amber-800/80">
                {outOfStock.length > 0 && <><strong>{outOfStock.length}</strong> out of stock · </>}
                <strong>{lowStock.length}</strong> running low (≤ {LOW_STOCK_THRESHOLD} left)
              </p>
              {(lowStock.length > 0 || outOfStock.length > 0) && (
                <ul className="mt-2 text-xs text-amber-900/90 space-y-0.5 max-h-32 overflow-auto">
                  {[...outOfStock, ...lowStock].slice(0, 8).map((p) => (
                    <li key={p.id}>
                      • {p.name} — <span className={p.stock === 0 ? "text-red-700 font-medium" : ""}>{p.stock === 0 ? "Out of stock" : `${p.stock} left`}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </button>
      )}

      <div className="flex flex-wrap gap-2 mb-4">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by name or slug…"
          className="flex-1 min-w-[200px] bg-white px-4 py-2 text-sm ring-1 ring-black/10 focus:outline-none focus:ring-brand-rose"
        />
        {(["all", "low", "out"] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 text-[10px] uppercase tracking-luxe ring-1 ring-black/10 ${filter === f ? "bg-brand-charcoal text-white" : "bg-white"}`}
          >
            {f === "all" ? "All" : f === "low" ? `Low (${lowStock.length})` : `Out (${outOfStock.length})`}
          </button>
        ))}
      </div>

      <div className="border border-black/5 bg-white overflow-x-auto">
        {isLoading && <p className="p-8 text-sm text-center text-brand-charcoal/60">Loading…</p>}
        {!isLoading && filtered.length === 0 && <p className="p-8 text-sm text-center text-brand-charcoal/60">No products.</p>}
        {filtered.map((p) => {
          const low = p.stock > 0 && p.stock <= LOW_STOCK_THRESHOLD;
          const out = p.stock === 0;
          return (
            <div key={p.id} className="grid grid-cols-12 gap-3 p-3 border-b border-black/5 last:border-b-0 items-center text-sm">
              <div className="col-span-12 sm:col-span-1">
                <div className="w-14 h-14 bg-brand-beige overflow-hidden rounded-sm">
                  <img src={resolveImage(p.images?.[0])} alt={p.name} className="w-full h-full object-cover" loading="lazy" />
                </div>
              </div>
              <div className="col-span-12 sm:col-span-4">
                <p className="font-medium truncate">{p.name}</p>
                <p className="text-xs text-brand-charcoal/50 truncate">/{p.slug}</p>
              </div>
              <div className="col-span-4 sm:col-span-2">
                <p className="font-medium">${Number(p.price).toFixed(2)}</p>
                {p.compare_at_price && (
                  <p className="text-xs text-brand-charcoal/40 line-through">${Number(p.compare_at_price).toFixed(2)}</p>
                )}
              </div>
              <div className="col-span-4 sm:col-span-2">
                <span className={`inline-block px-2 py-1 text-[10px] uppercase tracking-luxe rounded-sm ${out ? "bg-red-100 text-red-800" : low ? "bg-amber-100 text-amber-800" : "bg-brand-beige/60 text-brand-charcoal/70"}`}>
                  {out ? "Out of stock" : `Stock: ${p.stock}`}
                </span>
              </div>
              <div className="col-span-4 sm:col-span-1">
                <button onClick={() => toggleActive(p)} className={`text-[10px] uppercase tracking-luxe px-2 py-1 rounded-sm ${p.is_active ? "bg-emerald-100 text-emerald-800" : "bg-gray-200 text-gray-600"}`}>
                  {p.is_active ? "Active" : "Hidden"}
                </button>
              </div>
              <div className="col-span-12 sm:col-span-2 flex gap-2 justify-end">
                <button onClick={() => setEditing(p)} className="px-3 py-2 text-[10px] uppercase tracking-luxe ring-1 ring-black/10 hover:bg-brand-beige/40">Edit</button>
                <button onClick={() => removeProduct(p.id, p.name)} className="p-2 ring-1 ring-black/10 hover:bg-red-50 hover:text-red-700" aria-label="Delete">
                  <Trash2 className="size-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {(editing || creating) && (
        <ProductForm
          product={editing}
          categories={categories}
          onClose={() => {
            setEditing(null);
            setCreating(false);
          }}
          onSaved={() => {
            qc.invalidateQueries({ queryKey: ["admin-products-full"] });
            qc.invalidateQueries({ queryKey: ["admin-products"] });
            qc.invalidateQueries({ queryKey: ["admin-stats"] });
          }}
        />
      )}
    </section>
  );
}

function ProductForm({
  product,
  categories,
  onClose,
  onSaved,
}: {
  product: ProductRow | null;
  categories: Category[];
  onClose: () => void;
  onSaved: () => void;
}) {
  const isEdit = !!product;
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [images, setImages] = useState<string[]>(product?.images ?? []);
  const [newImg, setNewImg] = useState("");
  const [categoryId, setCategoryId] = useState<string>(product?.category_id ?? "");

  const addImage = () => {
    const url = newImg.trim();
    if (!url) return;
    setImages((prev) => [...prev, url]);
    setNewImg("");
  };

  const removeImage = (i: number) => setImages((prev) => prev.filter((_, idx) => idx !== i));

  const uploadFiles = async (files: FileList | File[]) => {
    const arr = Array.from(files).filter((f) => f.type.startsWith("image/"));
    if (arr.length === 0) return;
    setUploading(true);
    const uploaded: string[] = [];
    for (const file of arr) {
      const ext = file.name.split(".").pop() || "jpg";
      const path = `${crypto.randomUUID()}.${ext}`;
      const { error: upErr } = await supabase.storage.from("product-images").upload(path, file, {
        cacheControl: "31536000",
        upsert: false,
      });
      if (upErr) {
        toast.error(`Upload failed: ${upErr.message}`);
        continue;
      }
      // Bucket is private — generate a long-lived signed URL (10 years)
      const { data: signed, error: signErr } = await supabase.storage
        .from("product-images")
        .createSignedUrl(path, 60 * 60 * 24 * 365 * 10);
      if (signErr || !signed?.signedUrl) {
        toast.error(`Could not create image URL`);
        continue;
      }
      uploaded.push(signed.signedUrl);
    }
    if (uploaded.length) {
      setImages((prev) => [...prev, ...uploaded]);
      toast.success(`${uploaded.length} image${uploaded.length === 1 ? "" : "s"} uploaded`);
    }
    setUploading(false);
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files?.length) uploadFiles(e.dataTransfer.files);
  };

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSaving(true);
    const fd = new FormData(e.currentTarget);
    const price = Number(fd.get("price"));
    const compareRaw = String(fd.get("compare_at_price") ?? "").trim();
    const compare_at_price = compareRaw ? Number(compareRaw) : null;
    const stock = Number(fd.get("stock") ?? 0);
    const payload = {
      slug: String(fd.get("slug")).toLowerCase().replace(/[^a-z0-9-]+/g, "-"),
      name: String(fd.get("name")),
      description: String(fd.get("description") ?? ""),
      price,
      compare_at_price,
      is_sale: compare_at_price !== null && compare_at_price > price,
      stock,
      sizes: String(fd.get("sizes") ?? "").split(",").map((s) => s.trim()).filter(Boolean),
      colors: String(fd.get("colors") ?? "").split(",").map((s) => s.trim()).filter(Boolean),
      images,
      is_active: fd.get("is_active") === "on",
      category_id: categoryId || null,
    };

    const { error } = isEdit
      ? await supabase.from("products").update(payload).eq("id", product!.id)
      : await supabase.from("products").insert({ ...payload, is_active: payload.is_active });

    setSaving(false);
    if (error) return toast.error(error.message);
    toast.success(isEdit ? "Product updated" : "Product created");
    onSaved();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-start justify-center p-4 overflow-auto">
      <div className="bg-brand-canvas w-full max-w-2xl my-8 shadow-2xl">
        <div className="flex justify-between items-center p-6 border-b border-black/5">
          <h2 className="font-display text-2xl">{isEdit ? "Edit Product" : "New Product"}</h2>
          <button onClick={onClose} className="size-9 grid place-items-center hover:bg-brand-beige/40">
            <X className="size-4" />
          </button>
        </div>
        <form onSubmit={onSubmit} className="p-6 space-y-4">
          <Field label="Name">
            <input name="name" required defaultValue={product?.name} className={inputCls} />
          </Field>
          <Field label="Slug">
            <input name="slug" required defaultValue={product?.slug} className={inputCls} />
          </Field>
          <Field label="Category">
            <select value={categoryId} onChange={(e) => setCategoryId(e.target.value)} className={inputCls}>
              <option value="">— Select category —</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </Field>
          <Field label="Description">
            <textarea name="description" rows={3} defaultValue={product?.description ?? ""} className={inputCls} />
          </Field>
          <div className="grid grid-cols-3 gap-3">
            <Field label="Price ($)">
              <input name="price" type="number" step="0.01" min="0" required defaultValue={product?.price ?? ""} className={inputCls} />
            </Field>
            <Field label="Compare at ($)">
              <input name="compare_at_price" type="number" step="0.01" min="0" placeholder="Discount from" defaultValue={product?.compare_at_price ?? ""} className={inputCls} />
            </Field>
            <Field label="Stock">
              <input name="stock" type="number" min="0" required defaultValue={product?.stock ?? 0} className={inputCls} />
            </Field>
          </div>
          <p className="text-[11px] text-brand-charcoal/60 -mt-2">
            Tip: Set <em>Compare at</em> higher than <em>Price</em> to show a discount badge on the storefront.
          </p>
          <Field label="Sizes (comma separated)">
            <input name="sizes" defaultValue={(product?.sizes ?? []).join(", ")} placeholder="XS, S, M, L" className={inputCls} />
          </Field>
          <Field label="Colors (comma separated)">
            <input name="colors" defaultValue={(product?.colors ?? []).join(", ")} placeholder="Black, Ivory" className={inputCls} />
          </Field>

          <div>
            <label className="block text-[10px] uppercase tracking-luxe mb-2 text-brand-charcoal/70">Images</label>

            <div
              onDragOver={(e) => {
                e.preventDefault();
                setDragOver(true);
              }}
              onDragLeave={() => setDragOver(false)}
              onDrop={onDrop}
              className={`relative border-2 border-dashed rounded-sm p-6 text-center mb-3 transition ${
                dragOver ? "border-brand-rose bg-brand-rose/5" : "border-black/15 bg-white/40"
              }`}
            >
              <Upload className="size-6 mx-auto mb-2 text-brand-charcoal/40" />
              <p className="text-xs text-brand-charcoal/70">
                Drag &amp; drop images here, or
              </p>
              <div className="flex gap-2 justify-center mt-3 flex-wrap">
                <label className="cursor-pointer px-4 py-2 bg-brand-charcoal text-white text-[10px] uppercase tracking-luxe hover:bg-brand-rose inline-flex items-center gap-2">
                  <ImageIcon className="size-3" />
                  Choose from gallery
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    className="hidden"
                    onChange={(e) => e.target.files && uploadFiles(e.target.files)}
                  />
                </label>
                <label className="cursor-pointer px-4 py-2 ring-1 ring-black/15 text-[10px] uppercase tracking-luxe hover:bg-brand-beige/40 inline-flex items-center gap-2 sm:hidden">
                  📷 Camera
                  <input
                    type="file"
                    accept="image/*"
                    capture="environment"
                    className="hidden"
                    onChange={(e) => e.target.files && uploadFiles(e.target.files)}
                  />
                </label>
              </div>
              {uploading && <p className="text-xs text-brand-rose mt-2">Uploading…</p>}
            </div>

            <div className="flex gap-2 mb-3">
              <input
                value={newImg}
                onChange={(e) => setNewImg(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    addImage();
                  }
                }}
                placeholder="Or paste an image URL"
                className={inputCls}
              />
              <button type="button" onClick={addImage} className="px-4 bg-brand-charcoal text-white text-[10px] uppercase tracking-luxe hover:bg-brand-rose">
                Add
              </button>
            </div>
            {images.length > 0 && (
              <div className="grid grid-cols-4 gap-2">
                {images.map((src, i) => (
                  <div key={i} className="relative group aspect-square bg-brand-beige overflow-hidden rounded-sm">
                    <img src={resolveImage(src)} alt="" className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => removeImage(i)}
                      className="absolute top-1 right-1 size-6 grid place-items-center bg-black/70 text-white rounded-full opacity-0 group-hover:opacity-100 transition"
                      aria-label="Remove image"
                    >
                      <X className="size-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" name="is_active" defaultChecked={product?.is_active ?? true} />
            Active (visible in shop)
          </label>

          <div className="flex gap-3 pt-4 border-t border-black/5">
            <button type="button" onClick={onClose} className="flex-1 py-3 text-[10px] uppercase tracking-luxe ring-1 ring-black/10 hover:bg-brand-beige/40">
              Cancel
            </button>
            <button disabled={saving} className="flex-1 bg-brand-charcoal text-white py-3 text-[10px] uppercase tracking-luxe hover:bg-brand-rose disabled:opacity-50">
              {saving ? "Saving…" : isEdit ? "Save Changes" : "Create Product"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

const inputCls = "w-full bg-white/70 px-4 py-3 text-sm ring-1 ring-black/10 focus:outline-none focus:ring-brand-rose";

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-[10px] uppercase tracking-luxe mb-2 text-brand-charcoal/70">{label}</label>
      {children}
    </div>
  );
}