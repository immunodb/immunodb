import { getCollection } from "astro:content";
import type { APIRoute } from "astro";

const cells = await getCollection("cells");
const conditions = await getCollection("conditions");
const cytokines = await getCollection("cytokines");
const markers = await getCollection("markers");
const transcription_factors = await getCollection("transcription_factors");

const allPages = [
  ...cells.map((x) => x.id),
  ...conditions.map((x) => x.id),
  ...cytokines.map((x) => x.id),
  ...markers.map((x) => x.id),
  ...transcription_factors.map((x) => x.id),
];

export const GET: APIRoute = async ({ redirect }) => {
  try {
    const randomPage = allPages[Math.floor(Math.random() * allPages.length)];
    return redirect("/immunodb/" + randomPage, 302);
  } catch (error) {
    console.error("Random route failed: ", error);
    return redirect("/404", 302);
  }
};
