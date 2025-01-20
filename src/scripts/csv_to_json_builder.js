import { parse } from "csv-parse/sync";
import { readFileSync, writeFileSync } from "fs";

function sort_on_short(array) {
  return array.sort((a, b) => {
    if (a.short > b.short) {
      return 1;
    } else {
      return -1;
    }
  });
}

const opts = {
  columns: true,
  skip_empty_lines: true,
};

let cell_markers = parse(
  readFileSync("./data/cell_markers.csv", "utf-8"),
  opts,
);
let cell_products = parse(
  readFileSync("./data/cell_products.csv", "utf-8"),
  opts,
);
let cell_transcription_factors = parse(
  readFileSync("./data/cell_transcription_factors.csv", "utf-8"),
  opts,
);
let cell_subsets = parse(
  readFileSync("./data/cell_subsets.csv", "utf-8"),
  opts,
);
let cell_growth_factors = parse(
  readFileSync("./data/cell_growth_factors.csv", "utf-8"),
  opts,
);

let cytokines = parse(readFileSync("./data/cytokines.csv", "utf-8"), opts);
cytokines = sort_on_short(cytokines);
let transcription_factors = parse(
  readFileSync("./data/transcription_factors.csv", "utf-8"),
  opts,
);
transcription_factors = sort_on_short(transcription_factors);
let markers = parse(readFileSync("./data/markers.csv", "utf-8"), opts);
markers = sort_on_short(markers);
let cells = parse(readFileSync("./data/cells.csv", "utf-8"), opts);
cells = sort_on_short(cells);

// Build Cells
console.log("Building Cells");

for (let c of cells) {
  c.markers = cell_markers
    .filter((x) => x.cell_id == c.cell_id)
    .map((x) => {
      return {
        name: markers.find((m) => m.marker_id == x.marker_id).short,
        id: x.marker_id,
      };
    });

  c.products = cell_products
    .filter((x) => x.cell_id == c.cell_id)
    .map((x) => {
      return { name: x.short, id: x.cytokine_id };
    });

  c.transcription_factors = cell_transcription_factors
    .filter((x) => x.cell_id == c.cell_id)
    .map((x) => {
      return {
        name: transcription_factors.find(
          (tf) => tf.transcription_factor_id == x.transcription_factor_id,
        ).short,
        id: x.transcription_factor_id,
      };
    });

  c.subsets = cell_subsets
    .filter((x) => x.cell_id == c.cell_id)
    .map((x) => {
      let child = x.subset_cell_id;
      cells.find((x) => x.cell_id == child).parent = {
        name: c.short,
        id: c.cell_id,
      };
      return {
        name: cells.find((s) => s.cell_id == x.subset_cell_id).short,
        id: x.subset_cell_id,
      };
    });

  c.growth_factors = cell_growth_factors
    .filter((x) => x.cell_id == c.cell_id)
    .map((x) => {
      return { name: x.short, id: x.cytokine_id };
    });

  c.id = "cell-" + c.cell_id;
}

writeFileSync("data/cells.json", JSON.stringify(cells, null, 4));

// Build Cytokines
console.log("Building Cytokines");

for (let c of cytokines) {
  c.id = "cytokine-" + c.cytokine_id;
  c.targets = cells
    .filter((cell) => cell.growth_factors.includes(c.cytokine_id))
    .map((cell) => cell.cell_id);
}

writeFileSync("data/cytokines.json", JSON.stringify(cytokines, null, 2));

// Build Markers

console.log("Building Markers");
for (let m of markers) {
  m.id = "marker-" + m.marker_id;
  m.found_on = cell_markers
    .filter((cm) => cm.marker_id == m.marker_id)
    .map((cm) => {
      return {
        name: cells.find((x) => x.cell_id == cm.cell_id).short,
        id: cm.cell_id,
      };
    });
}

writeFileSync("data/markers.json", JSON.stringify(markers, null, 2));

// Build Transcription Factors
console.log("Building Transcription Factors");
for (let tf of transcription_factors) {
  tf.id = "transcription-factor-" + tf.transcription_factor_id;
}

writeFileSync(
  "data/transcription_factors.json",
  JSON.stringify(transcription_factors, null, 2),
);

console.log("Done JSON Build");
