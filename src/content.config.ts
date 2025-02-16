import { file } from "astro/loaders";
import { defineCollection, z } from "astro:content";

const link = z.array(
  z.object({
    id: z.string(),
    name: z.string(),
  }),
);

const cell_schema = z.object({
  name: z.string(),
  short: z.string(),
  cell_id: z.string(),
  id: z.string(),
  description: z.string(),
  infobox: z.array(z.object({ key: z.string(), value: link })),
  markers: link,
  products: link,
  transcription_factors: link,
  growth_factors: link,
});

const cells = defineCollection({
  loader: file("./data/cells.json"),
});

const cytokines = defineCollection({
  loader: file("./data/cytokines.json"),
});

const markers = defineCollection({
  loader: file("./data/markers.json"),
});

const transcription_factors = defineCollection({
  loader: file("./data/transcription_factors.json"),
});

const conditions = defineCollection({
  loader: file("./data/conditions.json"),
});

const therapeutics = defineCollection({
  loader: file("./data/therapeutics.json"),
});

export const collections = {
  cells,
  conditions,
  cytokines,
  markers,
  transcription_factors,
  therapeutics,
};
