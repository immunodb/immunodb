type CellID = string;
type CytokineID = string;
type SurfaceMarkerID = string;
type TranscriptionFactorID = string;
type ID = string;
type ConditionID = string;

interface Cell {
  name: string;
  id: ID;
  short: string;
  cell_id: CellID;
  description: string;
  surface_markers: SurfaceMarkerID[];
  cytokine_products: CytokineID[];
  cell_subsets: CellID[];
  parent_cell: CellID;
}

interface Cytokine {
  name: string;
  short: string;
  id: ID;
  description: string;
  cytokine_id: CytokineID;
  cell_targets: CellID[];
  produced_by: CellID[];
}

interface SurfaceMarker {
  name: string;
  short: string;
  id: ID;
  description: string;
  surface_marker_id: SurfaceMarkerID;
}

interface TranscriptionFactor {
  name: string;
  short: string;
  id: ID;
  description: string;
  transcription_factor_id: TranscriptionFactorID;
}

interface Condition {
  name: string;
  short: string;
  id: ID;
  condition_id: ConditionID;
  associated_id: ID[];
}
