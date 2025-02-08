import type { APIRoute } from "astro";
import { getCollection } from "astro:content";

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

export const GET: APIRoute = async () => {
  return new Response(
    `<!DOCTYPE html>
<html>
  <head>
    <title>Redirecting to random page...</title>
    <script>
      // Define the pages array
      const pages = ${JSON.stringify(allPages)};
      // Select random page at runtime
      const randomPage = pages[Math.floor(Math.random() * pages.length)];
      const redirectUrl = '/immunodb/' + randomPage;
      window.location.href = redirectUrl;
    </script>
  </head>
  <body>
    <p>Redirecting to a random page...</p>
  </body>
</html>`,
    {
      status: 200,
      headers: {
        "Content-Type": "text/html",
      },
    },
  );
};
