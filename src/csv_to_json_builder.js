import { parse } from "csv-parse/sync";
import { readFileSync, writeFileSync } from "fs";

// Arrays to store the data from each CSV file
let cells = [];
let cell_markers = [];
let cell_products = [];
let cell_transcription_factors = [];
let cell_subsets = [];
let cell_growth_factors = [];
let cytokines = [];

// Read each CSV file synchronously
const cells_file = readFileSync("./data/cells.csv", "utf-8");
const cell_markers_file = readFileSync("./data/cell_markers.csv", "utf-8");
const cell_products_file = readFileSync("./data/cell_products.csv", "utf-8");
const cell_transcription_factors_file = readFileSync(
    "./data/cell_transcription_factors.csv",
    "utf-8"
);
const cell_subsets_file = readFileSync("./data/cell_subsets.csv", "utf-8");
const cell_growth_factors_file = readFileSync(
    "./data/cell_growth_factors.csv",
    "utf-8"
);
const cytokines_file = readFileSync("./data/cytokines.csv", "utf-8");

// Parse each file's content into arrays of objects
cells = parse(cells_file, {
    columns: true,
    skip_empty_lines: true,
});
console.log(`cells.csv contains ${cells.length} records`);

cell_markers = parse(cell_markers_file, {
    columns: true,
    skip_empty_lines: true,
});
console.log(`cell_markers.csv contains ${cell_markers.length} records`);

cell_products = parse(cell_products_file, {
    columns: true,
    skip_empty_lines: true,
});
console.log(`cell_products.csv contains ${cell_products.length} records`);

cell_transcription_factors = parse(cell_transcription_factors_file, {
    columns: true,
    skip_empty_lines: true,
});
console.log(
    `cell_transcription_factors.csv contains ${cell_transcription_factors.length} records`
);

cell_subsets = parse(cell_subsets_file, {
    columns: true,
    skip_empty_lines: true,
});
console.log(`cell_subsets.csv contains ${cell_subsets.length} records`);

cell_subsets = parse(cell_subsets_file, {
    columns: true,
    skip_empty_lines: true,
});
console.log(`cell_subsets.csv contains ${cell_subsets.length} records`);

cell_growth_factors = parse(cell_growth_factors_file, {
    columns: true,
    skip_empty_lines: true,
});
console.log(
    `cell_growth_factors.csv contains ${cell_growth_factors.length} records`
);

cytokines = parse(cytokines_file, {
    columns: true,
    skip_empty_lines: true,
});
console.log(`cytokines.csv contains ${cytokines.length} records`);

// Log the results
console.log("All files have been read successfully");

// Build Cells
console.log("Building Cells");
for (let c of cells) {
    console.log("ID: " + c.cell_id);

    c.markers = cell_markers
        .filter((x) => x.cell_id == c.cell_id)
        .map((x) => x.marker_id);

    c.products = cell_products
        .filter((x) => x.cell_id == c.cell_id)
        .map((x) => x.cytokine_id);

    c.transcription_factors = cell_transcription_factors
        .filter((x) => x.cell_id == c.cell_id)
        .map((x) => x.transcription_factor_id);

    c.subsets = cell_subsets
        .filter((x) => x.cell_id == c.cell_id)
        .map((x) => x.transcription_factor_id);

    for (let sub of c.subsets) {
        // TODO
    }

    c.growth_factors = cell_growth_factors
        .filter((x) => x.cell_id == c.cell_id)
        .map((x) => x.cytokine_id);
}

console.log(cells);
const cellString = JSON.stringify(cells, null, 2);
writeFileSync("data/cells.json", cellString);

// Build Cytokines
console.log("Building Cytokines");
for (let c of cytokines) {
    console.log("ID: " + c.cytokine_id);

    c.targets = cells
        .filter((cell) => cell.growth_factors.includes(c.cytokine_id))
        .map((cell) => cell.cell_id);
}

console.log(cytokines);
