// @ts-check
import pagefind from "astro-pagefind";
import { defineConfig } from "astro/config";

// https://astro.build/config
export default defineConfig({
    build: {
        format: "file",
    },
    integrations: [pagefind()],
});
