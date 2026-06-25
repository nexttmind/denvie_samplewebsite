// Resolves DB-stored image paths like "/src/assets/product-1.jpg" or "/src/assets/sets/product-1.jpg" to bundled URLs.
const modules = import.meta.glob("/src/assets/**/*.{jpg,jpeg,png,webp}", {
  eager: true,
  query: "?url",
  import: "default",
}) as Record<string, string>;

import fallback from "@/assets/product-1.jpg";

export function resolveImage(path?: string | null): string {
  if (!path) return fallback;
  if (path.startsWith("http") || path.startsWith("data:")) return path;
  return modules[path] ?? fallback;
}

export function resolveImages(paths?: string[] | null): string[] {
  if (!paths || paths.length === 0) return [fallback];
  return paths.map(resolveImage);
}