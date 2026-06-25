import { useEffect, useState, useCallback } from "react";

export type CartItem = {
  productId: string;
  slug: string;
  name: string;
  price: number;
  image: string;
  size?: string;
  color?: string;
  quantity: number;
};

const KEY = "denvie_cart";
const WKEY = "denvie_wishlist";

function read<T>(k: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = localStorage.getItem(k);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function write(k: string, v: unknown) {
  if (typeof window === "undefined") return;
  localStorage.setItem(k, JSON.stringify(v));
  window.dispatchEvent(new CustomEvent("denvie:storage"));
}

export function useCart() {
  const [items, setItems] = useState<CartItem[]>([]);

  useEffect(() => {
    setItems(read<CartItem[]>(KEY, []));
    const onChange = () => setItems(read<CartItem[]>(KEY, []));
    window.addEventListener("denvie:storage", onChange);
    window.addEventListener("storage", onChange);
    return () => {
      window.removeEventListener("denvie:storage", onChange);
      window.removeEventListener("storage", onChange);
    };
  }, []);

  const add = useCallback((it: CartItem) => {
    const next = [...read<CartItem[]>(KEY, [])];
    const idx = next.findIndex(
      (x) => x.productId === it.productId && x.size === it.size && x.color === it.color,
    );
    if (idx >= 0) next[idx].quantity += it.quantity;
    else next.push(it);
    write(KEY, next);
  }, []);

  const update = useCallback((idx: number, qty: number) => {
    const next = [...read<CartItem[]>(KEY, [])];
    if (qty <= 0) next.splice(idx, 1);
    else next[idx].quantity = qty;
    write(KEY, next);
  }, []);

  const remove = useCallback((idx: number) => {
    const next = [...read<CartItem[]>(KEY, [])];
    next.splice(idx, 1);
    write(KEY, next);
  }, []);

  const clear = useCallback(() => write(KEY, []), []);

  const subtotal = items.reduce((s, i) => s + i.price * i.quantity, 0);
  const count = items.reduce((s, i) => s + i.quantity, 0);

  return { items, add, update, remove, clear, subtotal, count };
}

export function useWishlist() {
  const [ids, setIds] = useState<string[]>([]);
  useEffect(() => {
    setIds(read<string[]>(WKEY, []));
    const onChange = () => setIds(read<string[]>(WKEY, []));
    window.addEventListener("denvie:storage", onChange);
    return () => window.removeEventListener("denvie:storage", onChange);
  }, []);

  const toggle = useCallback((id: string) => {
    const cur = read<string[]>(WKEY, []);
    const next = cur.includes(id) ? cur.filter((x) => x !== id) : [...cur, id];
    write(WKEY, next);
  }, []);

  const has = (id: string) => ids.includes(id);

  return { ids, has, toggle, count: ids.length };
}