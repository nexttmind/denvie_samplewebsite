// @lovable.dev/vite-tanstack-config already includes the following — do NOT add them manually
// or the app will break with duplicate plugins:
//   - tanstackStart, viteReact, tailwindcss, tsConfigPaths, nitro (build-only using cloudflare as a default target),
//     componentTagger (dev-only), VITE_* env injection, @ path alias, React/TanStack dedupe,
//     error logger plugins, and sandbox detection (port/host/strictPort).
// You can pass additional config via defineConfig({ vite: { ... }, etc... }) if needed.
import { defineConfig } from "@lovable.dev/vite-tanstack-config";
import netlify from "@netlify/vite-plugin-tanstack-start";

/** Netlify sets env at build time in process.env; map SUPABASE_* → VITE_* for the client bundle. */
function supabaseClientEnvDefine(): Record<string, string> {
  const define: Record<string, string> = {};
  const mappings = [
    ["VITE_SUPABASE_URL", "SUPABASE_URL"],
    ["VITE_SUPABASE_PUBLISHABLE_KEY", "SUPABASE_PUBLISHABLE_KEY"],
    ["VITE_SUPABASE_PROJECT_ID", "SUPABASE_PROJECT_ID"],
  ] as const;

  for (const [viteKey, fallbackKey] of mappings) {
    const value = process.env[viteKey] ?? process.env[fallbackKey];
    if (value) {
      define[`import.meta.env.${viteKey}`] = JSON.stringify(value);
    }
  }

  return define;
}

export default defineConfig({
  plugins: [netlify()],
  vite: {
    define: supabaseClientEnvDefine(),
  },
  tanstackStart: {
    // Redirect TanStack Start's bundled server entry to src/server.ts (our SSR error wrapper).
    // nitro/vite builds from this
    server: { entry: "server" },
  },
});
