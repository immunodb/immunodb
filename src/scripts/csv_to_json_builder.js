/* eslint-disable no-undef */
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

function sort_on_name(array) {
  return array.sort((a, b) => {
    if (a.name > b.name) {
      return 1;
    } else {
      return -1;
    }
  });
}

function make_name_id_obj(id) {
  return {
    name: id_map[id],
    id: id,
  };
}

let id_map = {};

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
let cytokine_markers = parse(
  readFileSync("./data/cytokine_markers.csv", "utf-8"),
  opts,
);
let condition_associated_id = parse(
  readFileSync("./data/condition_associated_id.csv", "utf-8"),
  opts,
);
let conditions = sort_on_short(
  parse(readFileSync("./data/conditions.csv", "utf-8"), opts),
);
let therapeutics = sort_on_short(
  parse(readFileSync("./data/therapeutics.csv", "utf-8"), opts),
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
let reference_id = parse(
  readFileSync("./data/reference_id.csv", "utf-8"),
  opts,
);
let references = parse(readFileSync("./data/references.csv", "utf-8"), opts);
let cells = parse(readFileSync("./data/cells.csv", "utf-8"), opts);
cells = sort_on_short(cells);

console.log("Building Cytokines");
for (let c of cytokines) {
  c.id = "cytokine/" + c.cytokine_id;
  c.infobox = [];
  c.refs = reference_id
    .filter((x) => x.id == c.id)
    .map((x) => references.find((y) => y.reference_id == x.reference_id));
  c.produced_by = [];
  c.stimulates = [];
  c.receptors = cytokine_markers
    .filter((x) => x.cytokine_id == c.cytokine_id)
    .map((x) => {
      return make_name_id_obj("/marker" + x.marker_id);
    });
  id_map[c.id] = c.short;
}

console.log("Building Markers");
for (let m of markers) {
  m.id = "marker/" + m.marker_id;
  m.infobox = [];
  m.refs = reference_id
    .filter((x) => x.id == m.id)
    .map((x) => references.find((y) => y.reference_id == x.reference_id));
  m.found_on = [];
  id_map[m.id] = m.short;
}

console.log("Building Transcription Factors");
for (let tf of transcription_factors) {
  tf.id = "transcription_factor/" + tf.transcription_factor_id;
  tf.infobox = [];
  tf.refs = reference_id
    .filter((x) => x.id == tf.id)
    .map((x) => references.find((y) => y.reference_id == x.reference_id));
  tf.expressed_by = [];
  id_map[tf.id] = tf.short;
}

console.log("Building Conditions");
for (let c of conditions) {
  c.id = "condition/" + c.condition_id;
  c.infobox = [];
  c.refs = reference_id
    .filter((x) => x.id == c.id)
    .map((x) => references.find((y) => y.reference_id == x.reference_id));
  id_map[c.id] = c.short;
}

console.log("Building Therapeutics");
for (let t of therapeutics) {
  t.id = "therapeutic/" + t.therapeutic_id;
  t.infobox = [];
  t.refs = reference_id
    .filter((x) => x.id == t.id)
    .map((x) => references.find((y) => y.reference_id == x.reference_id));
  t.target = [make_name_id_obj(t.target)];
  id_map[t.id] = t.short;
}

console.log("Building Cells");
for (let c of cells) {
  c.infobox = [];
  c.refs = reference_id
    .filter((x) => x.id == c.id)
    .map((x) => references.find((y) => y.reference_id == x.reference_id));
  c.id = "cell/" + c.cell_id;
  id_map[c.id] = c.short;

  c.markers = sort_on_name(
    cell_markers
      .filter((x) => x.cell_id == c.cell_id)
      .map((x) => {
        let m = markers.find((m) => x.marker_id == m.marker_id);
        m.found_on.push({ name: c.short, id: c.id });
        return make_name_id_obj("marker/" + x.marker_id);
      }),
  );

  c.products = sort_on_name(
    cell_products
      .filter((x) => x.cell_id == c.cell_id)
      .map((x) => {
        cytokines
          .find((m) => x.cytokine_id == m.cytokine_id)
          .produced_by.push({ name: c.short, id: c.id });
        return make_name_id_obj("cytokine/" + x.cytokine_id);
      }),
  );

  c.transcription_factors = cell_transcription_factors
    .filter((x) => x.cell_id == c.cell_id)
    .map((x) => {
      transcription_factors
        .find((m) => x.transcription_factor_id == m.transcription_factor_id)
        .expressed_by.push({ name: c.short, id: c.id });
      return make_name_id_obj(
        "transcription_factor/" + x.transcription_factor_id,
      );
    });

  c.subsets = cell_subsets
    .filter((x) => x.cell_id == c.cell_id)
    .map((x) => {
      let child = x.subset_cell_id;
      cells.find((x) => x.cell_id == child).parent = {
        name: c.short,
        id: c.id,
      };
      return make_name_id_obj("cell/" + x.subset_cell_id);
    });

  c.growth_factors = cell_growth_factors
    .filter((x) => x.cell_id == c.cell_id)
    .map((x) => {
      cytokines
        .find((m) => x.cytokine_id == m.cytokine_id)
        .stimulates.push({ name: c.short, id: c.id });
      return make_name_id_obj("cytokine/" + x.cytokine_id);
    });
}

for (const c of conditions) {
  c.associated = condition_associated_id
    .filter((x) => x.condition_id == c.condition_id)
    .map((x) => {
      return make_name_id_obj(x.associated_id);
    });
}

writeFileSync("data/conditions.json", JSON.stringify(conditions, null, 4));
writeFileSync("data/cells.json", JSON.stringify(cells, null, 4));
writeFileSync("data/cytokines.json", JSON.stringify(cytokines, null, 2));
writeFileSync("data/markers.json", JSON.stringify(markers, null, 2));
writeFileSync(
  "data/transcription_factors.json",
  JSON.stringify(transcription_factors, null, 2),
);
writeFileSync("data/therapeutics.json", JSON.stringify(therapeutics, null, 2));

console.log("Done JSON Build");
