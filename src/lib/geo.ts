import { MAP_H, MAP_W, project } from "./map";

export { MAP_H, MAP_W, project };

export const AIRPORT = { name: "Colombo Airport", code: "CMB", lat: 7.1808, lng: 79.8841 };

/** Smooth path through points (Catmull-Rom → cubic Bézier). */
export function smoothPath(pts: [number, number][], tension = 0.5) {
  if (pts.length < 2) return "";
  let d = `M${pts[0][0].toFixed(1)},${pts[0][1].toFixed(1)}`;
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[i - 1] ?? pts[i];
    const p1 = pts[i];
    const p2 = pts[i + 1];
    const p3 = pts[i + 2] ?? p2;
    const t = tension / 3;
    const c1 = [p1[0] + (p2[0] - p0[0]) * t, p1[1] + (p2[1] - p0[1]) * t];
    const c2 = [p2[0] - (p3[0] - p1[0]) * t, p2[1] - (p3[1] - p1[1]) * t];
    d += `C${c1[0].toFixed(1)},${c1[1].toFixed(1)} ${c2[0].toFixed(1)},${c2[1].toFixed(1)} ${p2[0].toFixed(1)},${p2[1].toFixed(1)}`;
  }
  return d;
}

/** Where each label sits relative to its pin, so neighbours never collide. */
export const LABEL_SIDE: Record<string, "left" | "right"> = {
  sigiriya: "left",
  minneriya: "right",
  kandy: "left",
  "nuwara-eliya": "left",
  ella: "right",
  galle: "left",
  mirissa: "right",
  yala: "right",
  "arugam-bay": "left",
  trincomalee: "right",
};

// Topographic contour rings around the central highlands (approx. 7.0°N 80.75°E).
const HILL = project(7.0, 80.78);
function wobbleRing(r: number, seed: number) {
  const pts: [number, number][] = [];
  const n = 48;
  for (let i = 0; i < n; i++) {
    const a = (i / n) * Math.PI * 2;
    const k = 1 + 0.13 * Math.sin(a * 3 + seed) + 0.07 * Math.sin(a * 5 + seed * 2.3) + 0.04 * Math.cos(a * 7 + seed);
    pts.push([HILL[0] + Math.cos(a) * r * k * 0.82, HILL[1] + Math.sin(a) * r * k * 1.08]);
  }
  pts.push(pts[0], pts[1]);
  return smoothPath(pts, 0.9);
}
export const CONTOURS = [26, 52, 82, 116, 156, 204, 262].map((r, i) => wobbleRing(r, i * 1.7));

/**
 * Monsoon state per month (1-12). The south-west monsoon (May–Sep) wets the
 * west & south; the north-east monsoon (Nov–Feb) wets the east & north.
 * Inter-monsoon months bring afternoon showers island-wide.
 */
export type Monsoon = { wet: "west" | "east" | "both" | "none"; name: string; note: string };
export const MONSOON: Record<number, Monsoon> = {
  1: { wet: "east", name: "North-east monsoon", note: "The south and west are dry and gold. The east coast is wet and wild." },
  2: { wet: "east", name: "North-east monsoon (easing)", note: "Driest month on the south coast. The hill country is clear and cool." },
  3: { wet: "none", name: "Inter-monsoon", note: "Almost everywhere is good. Expect the odd afternoon shower in the hills." },
  4: { wet: "none", name: "Inter-monsoon", note: "It's Sinhala & Tamil New Year. Beaches on both sides are calm." },
  5: { wet: "west", name: "South-west monsoon", note: "The rain swings to the west. The east coast and Cultural Triangle are at their best." },
  6: { wet: "west", name: "South-west monsoon", note: "The surf season starts at Arugam Bay. Yala is dry and good for spotting animals." },
  7: { wet: "west", name: "South-west monsoon", note: "The Gathering begins at Minneriya, and the Perahera lights up Kandy." },
  8: { wet: "west", name: "South-west monsoon", note: "Peak elephant season. The east coast is glassy." },
  9: { wet: "west", name: "South-west monsoon (easing)", note: "Quieter roads, last of the east-coast sunshine." },
  10: { wet: "both", name: "Inter-monsoon", note: "Thunderstorms around the island, but quiet and green. A month for slow travel." },
  11: { wet: "both", name: "Inter-monsoon → NE monsoon", note: "The south coast starts to clear. Whale season opens off Mirissa." },
  12: { wet: "east", name: "North-east monsoon", note: "The south and west are sunny again. Galle and Mirissa are in season." },
};

// Rain polygons in map space (they extend past the island; the SVG clips them).
const sw = (lat: number, lng: number) => project(lat, lng).map((v) => v.toFixed(0)).join(",");
export const RAIN_WEST = `M${sw(10.2, 78.8)} L${sw(10.2, 79.95)} L${sw(7.9, 80.35)} L${sw(6.8, 81.0)} L${sw(5.5, 81.55)} L${sw(5.5, 78.8)}Z`;
export const RAIN_EAST = `M${sw(10.2, 79.95)} L${sw(10.2, 82.4)} L${sw(5.5, 82.4)} L${sw(5.5, 81.55)} L${sw(6.8, 81.0)} L${sw(7.9, 80.35)}Z`;

export { MAP_W as W, MAP_H as H };
