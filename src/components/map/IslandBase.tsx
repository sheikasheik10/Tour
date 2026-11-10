import { useId } from "react";
import { CONTOURS, MAP_H, MAP_W, project } from "@/lib/geo";
import { ISLAND_PATH } from "@/lib/map";
import { cn } from "@/lib/format";

type Props = {
  className?: string;
  tone?: "dark" | "light";
  graticule?: boolean;
  children?: (clipId: string) => React.ReactNode;
  under?: (clipId: string) => React.ReactNode;
  label?: string;
};

/**
 * The island as an SVG stage: land, topographic contours and an optional
 * graticule. Overlays render via children(clipId) to clip to the coastline.
 */
export function IslandBase({ className, tone = "dark", graticule = true, children, under, label = "Map of Sri Lanka" }: Props) {
  const id = useId().replace(/:/g, "");
  const clipId = `island-${id}`;
  const dark = tone === "dark";

  return (
    <svg viewBox={`0 0 ${MAP_W} ${MAP_H}`} className={cn("h-auto w-full overflow-visible", className)} role="img" aria-label={label}>
      <defs>
        <clipPath id={clipId}>
          <path d={ISLAND_PATH} />
        </clipPath>
        <linearGradient id={`land-${id}`} x1="0" y1="0" x2="0.4" y2="1">
          <stop offset="0" stopColor={dark ? "#33503d" : "#e2d7c2"} />
          <stop offset="1" stopColor={dark ? "#2a4233" : "#d6c8ae"} />
        </linearGradient>
      </defs>

      {graticule && (
        <g className={dark ? "text-paper/15" : "text-ink/15"} fontFamily="var(--font-mono)" fontSize="11">
          {[6, 7, 8, 9].map((lat) => {
            const [, y] = project(lat, 80);
            return (
              <g key={lat}>
                <line x1={-40} x2={MAP_W + 40} y1={y} y2={y} stroke="currentColor" strokeDasharray="2 6" />
                <text x={-36} y={y - 6} fill="currentColor" className={dark ? "fill-paper/35" : "fill-ink/40"}>
                  {lat}°N
                </text>
              </g>
            );
          })}
          {[80, 81].map((lng) => {
            const [x] = project(8, lng);
            return (
              <g key={lng}>
                <line y1={-20} y2={MAP_H + 20} x1={x} x2={x} stroke="currentColor" strokeDasharray="2 6" />
                <text x={x + 6} y={MAP_H + 14} className={dark ? "fill-paper/35" : "fill-ink/40"}>
                  {lng}°E
                </text>
              </g>
            );
          })}
        </g>
      )}

      {/* Soft shadow + land */}
      <path d={ISLAND_PATH} transform="translate(6 10)" fill={dark ? "rgb(0 0 0 / 0.25)" : "rgb(23 32 26 / 0.08)"} />
      <path d={ISLAND_PATH} fill={`url(#land-${id})`} stroke={dark ? "rgb(243 237 226 / 0.45)" : "rgb(23 32 26 / 0.35)"} strokeWidth={1.2} strokeLinejoin="round" />

      <g clipPath={`url(#${clipId})`}>
        {under?.(clipId)}
        {CONTOURS.map((d, i) => (
          <path key={i} d={d} fill="none" stroke={dark ? "rgb(243 237 226 / 0.09)" : "rgb(23 32 26 / 0.09)"} strokeWidth={1} />
        ))}
      </g>

      {children?.(clipId)}
    </svg>
  );
}
