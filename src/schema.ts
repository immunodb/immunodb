interface Cell {
    name: string;
    cell_id: string;
    description: string;
    markers: string[];
    products: string[];
    subsets: string[];
    parent: string;
    growth_factors: string[];
}

interface Cytokine {
    name: string;
    cytokine_id: string;
    targets: string[];
    producers: string[];
}
