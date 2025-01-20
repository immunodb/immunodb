import { file } from "astro/loaders";
import { defineCollection, z } from "astro:content";

let cell_schema = z.object({
  name: z.string(),
  short: z.string(),
  cell_id: z.string(),
  id: z.string(),
  description: z.string(),
  markers: z.array(
    z.object({
      id: z.string(),
      name: z.string(),
    }),
  ),
});

const cells = defineCollection({
  loader: file("./data/cells.json"),
  schema: cell_schema,
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

export const collections = { cells, cytokines, markers, transcription_factors };
