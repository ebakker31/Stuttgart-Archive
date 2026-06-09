import { defineConfig } from "vitest/config";
import { fileURLToPath } from "node:url";

/**
 * Vitest configuration. Tests target the pure, deterministic agent + scoring
 * logic (no Next.js/Supabase runtime), so a plain node environment is used.
 * The "@/" alias mirrors tsconfig paths.
 */
export default defineConfig({
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./", import.meta.url)),
    },
  },
  test: {
    environment: "node",
    include: ["tests/**/*.test.ts"],
  },
});
