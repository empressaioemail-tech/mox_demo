/**
 * WS-4 curated twin imagery manifest.
 *
 * The heavy RVT + the ~133-image bulk stay gitignored under apartment_bldg/.
 * This manifest points at the CURATED, OPTIMIZED webp set placed under
 * frontend/public/twin/ (each <=150KB, downscaled from the operator's Revit
 * exports). The building hero ALSO reuses the 8 renderings WS-5 already
 * optimized under /renderings/ (referenced, not re-copied).
 */

export interface TwinImage {
  src: string;
  alt: string;
  caption: string;
  kind: "rendering" | "elevation" | "floorplan" | "interior-elevation";
}

/** Building view: photoreal renderings + exterior elevations (the spatial face). */
export const BUILDING_IMAGES: TwinImage[] = [
  // Reuse WS-5's already-optimized renderings (do not re-copy these).
  {
    src: "/renderings/exterior-north-east.webp",
    alt: "North-east exterior elevation of the proposed 5-story apartment",
    caption: "North-east — the proposed 5-story massing (the height the MF-3 finding flags)",
    kind: "elevation",
  },
  {
    src: "/renderings/exterior-east.webp",
    alt: "East exterior elevation showing five floors",
    caption: "East elevation — five floors over the 40 ft MF-3 envelope",
    kind: "elevation",
  },
  // New curated renderings / elevations under /twin/building/.
  {
    src: "/twin/building/render-1.webp",
    alt: "Photoreal street-level rendering of the proposed building",
    caption: "Street-level massing study",
    kind: "rendering",
  },
  {
    src: "/twin/building/render-2.webp",
    alt: "Photoreal rendering of the proposed apartment exterior",
    caption: "Exterior, primary frontage",
    kind: "rendering",
  },
  {
    src: "/twin/building/render-3.webp",
    alt: "Photoreal rendering of the building, angled view",
    caption: "Angled massing view",
    kind: "rendering",
  },
  {
    src: "/twin/building/render-4.webp",
    alt: "Photoreal rendering of the building corner",
    caption: "Corner study",
    kind: "rendering",
  },
  {
    src: "/twin/building/elev-north.webp",
    alt: "North exterior elevation drawing",
    caption: "North elevation (drawing)",
    kind: "elevation",
  },
  {
    src: "/twin/building/elev-south.webp",
    alt: "South exterior elevation drawing",
    caption: "South elevation (drawing)",
    kind: "elevation",
  },
];

/** Building-level orientation floor plans. */
export const LEVEL_PLANS: TwinImage[] = [
  {
    src: "/twin/floorplans/level-1.webp",
    alt: "First floor plan of the proposed building",
    caption: "Level 1 — first floor plan",
    kind: "floorplan",
  },
  {
    src: "/twin/floorplans/level-5.webp",
    alt: "Fifth floor plan of the proposed building",
    caption: "Level 5 — fifth floor plan (typical residential level)",
    kind: "floorplan",
  },
];

/**
 * Per-room imagery, keyed by the room name from the unit atoms
 * (Bed 1, Bed 2, MSTR, Kitchen, Living, Baths). Each has a floor plan and at
 * least one interior elevation. Bath plan/elevation cover the unit's "Baths".
 */
export const ROOM_IMAGES: Record<string, { plan?: TwinImage; elevations: TwinImage[] }> = {
  "Bed 1": {
    plan: { src: "/twin/rooms/bed-1-plan.webp", alt: "Bedroom 1 floor plan", caption: "Bed 1 — floor plan", kind: "floorplan" },
    elevations: [
      { src: "/twin/rooms/bed-1-elev.webp", alt: "Bedroom 1 north interior elevation", caption: "Bed 1 — north interior elevation", kind: "interior-elevation" },
    ],
  },
  "Bed 2": {
    plan: { src: "/twin/rooms/bed-2-plan.webp", alt: "Bedroom 2 floor plan", caption: "Bed 2 — floor plan", kind: "floorplan" },
    elevations: [
      { src: "/twin/rooms/bed-2-elev.webp", alt: "Bedroom 2 north interior elevation", caption: "Bed 2 — north interior elevation", kind: "interior-elevation" },
    ],
  },
  MSTR: {
    plan: { src: "/twin/rooms/mstr-plan.webp", alt: "Master bedroom floor plan", caption: "MSTR — floor plan", kind: "floorplan" },
    elevations: [
      { src: "/twin/rooms/mstr-elev.webp", alt: "Master bedroom north interior elevation", caption: "MSTR — north interior elevation", kind: "interior-elevation" },
    ],
  },
  Kitchen: {
    plan: { src: "/twin/rooms/kitchen-plan.webp", alt: "Kitchen floor plan", caption: "Kitchen — floor plan", kind: "floorplan" },
    elevations: [
      { src: "/twin/rooms/kitchen-elev.webp", alt: "Kitchen north interior elevation", caption: "Kitchen — north interior elevation", kind: "interior-elevation" },
    ],
  },
  Living: {
    plan: { src: "/twin/rooms/living-plan.webp", alt: "Living room floor plan", caption: "Living — floor plan", kind: "floorplan" },
    elevations: [
      { src: "/twin/rooms/living-elev.webp", alt: "Living room north interior elevation", caption: "Living — north interior elevation", kind: "interior-elevation" },
    ],
  },
  Baths: {
    plan: { src: "/twin/rooms/baths-plan.webp", alt: "Bathroom floor plan", caption: "Baths — floor plan", kind: "floorplan" },
    elevations: [
      { src: "/twin/rooms/baths-elev.webp", alt: "Bathroom north interior elevation", caption: "Baths — north interior elevation", kind: "interior-elevation" },
    ],
  },
};
