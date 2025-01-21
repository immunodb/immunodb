import { readFileSync, writeFileSync } from "fs";
import { JWT } from "google-auth-library";
import { GoogleSpreadsheet } from "google-spreadsheet";
import assert from "node:assert/strict";

const CELL_NAMES = [
  "cells",
  "cell_markers",
  "cell_products",
  "cell_transcription_factors",
  "cell_subsets",
  "cell_growth_factors",
  "cytokines",
  "markers",
  "references",
  "transcription_factors",
];

const doc = await get_doc();

for (const element of CELL_NAMES) {
  await write_sheet(element);
}

async function get_doc() {
  let creds = {};
  try {
    const creds = JSON.parse(readFileSync("gkey.json"));
  } catch {
    creds = {
      client_email: process.env.EMAIL,
      private_key: process.env.PRIVATE_KEY,
      sheet_id: process.env.SHEET_ID,
    };
  }
  assert(creds.client_email != null);
  assert(creds.private_key != null);
  assert(creds.sheet_id != null);

  const SCOPES = ["https://www.googleapis.com/auth/spreadsheets"];

  const jwt = new JWT({
    email: creds.client_email,
    key: creds.private_key,
    scopes: SCOPES,
  });

  const doc = new GoogleSpreadsheet(creds.sheet_id, jwt);

  await doc.loadInfo();
  console.log("Loaded spreadsheet " + doc.title);
  return doc;
}

async function write_sheet(sheet_name) {
  let sheet = doc.sheetsByTitle[sheet_name];
  sheet.loadHeaderRow();
  let rows = await sheet.getRows();
  let out = [];
  rows.forEach((element) => {
    out.push(element.toObject());
  });
  let csv = arrayToCSV(out);
  writeFileSync(`./data/${sheet_name}.csv`, csv);
  console.log(`Wrote ${out.length} entries to ./data/${sheet_name}.csv`);
}

function arrayToCSV(array) {
  // Get headers from first object keys
  const headers = Object.keys(array[0]);

  // Create CSV rows
  const csvRows = [
    // Add headers as first row
    headers.join(","),
    // Add data rows
    ...array.map((obj) =>
      headers
        .map((header) => {
          // Handle values that contain commas or quotes
          let value = obj[header];
          if (value === null || value === undefined) {
            value = "";
          }
          value = value.toString();
          if (
            value.includes(",") ||
            value.includes('"') ||
            value.includes("\n")
          ) {
            value = `"${value.replace(/"/g, '""')}"`;
          }
          return value;
        })
        .join(","),
    ),
  ];

  return csvRows.join("\n");
}
