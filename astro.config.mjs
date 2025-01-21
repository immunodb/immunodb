// @ts-check
import pagefind from "astro-pagefind";
import { defineConfig } from "astro/config";

// https://astro.build/config
export default defineConfig({
  site: "https://immunodb.github.io",
  base: "immunodb",
  build: {
    format: "file",
  },
  integrations: [pagefind()],
});
