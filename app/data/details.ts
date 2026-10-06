/*
 * Retina close-ups. A close-up draws its screenshot up to ~3,500 px wide, more
 * than the full screenshots (up to 3,600 px) can serve sharply on a 2x screen.
 * For these shots `npm run shots` cuts a detail out of the 6x masters: only
 * the part of the window a close-up can ever show (`box`: left, top, right,
 * bottom as fractions of the window, measured from 390 to 2560 px wide with
 * the scroll drift and a small margin), at `width` px for the whole window
 * (twice the widest the window is drawn). ShotCrop uses the detail instead of
 * the full screenshot. Re-measure the box when a crop changes.
 */

export interface Detail {
  box: [number, number, number, number];
  width: number;
  /** How wide the detail is drawn: phones, then everything wider. */
  sizes: string;
}

export const details: Record<string, Detail> = {
  "clusters-hub": { box: [0.35, 0, 1, 0.78], width: 5600, sizes: "(max-width: 767px) 920px, 1820px" },
  "sign-in": { box: [0.33, 0.17, 0.87, 0.89], width: 7040, sizes: "(max-width: 767px) 760px, 1900px" },
  live: { box: [0.36, 0, 0.92, 0.88], width: 6400, sizes: "(max-width: 767px) 600px, 1800px" },
  graph: { box: [0.18, 0.13, 0.94, 0.99], width: 4920, sizes: "(max-width: 767px) 880px, 1850px" },
  "themes-library": { box: [0.34, 0, 0.98, 0.85], width: 5600, sizes: "(max-width: 767px) 650px, 1790px" },
};

/** The detail's own pixel width at full size (`width`) and at half. */
export const detailWidths = (d: Detail) => {
  const full = Math.round((d.box[2] - d.box[0]) * d.width);
  return [Math.round(full / 2), full] as const;
};
