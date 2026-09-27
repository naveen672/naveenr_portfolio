import * as opentype from 'opentype.js';
import fontUrl from '@fontsource/space-grotesk/files/space-grotesk-latin-700-normal.woff?url';

/** A word laid out to fill a viewport, plus where and how far to zoom to fly through one letter. */
export interface WordLayout {
  w: number;
  h: number;
  fontSize: number;
  baseline: number;
  d: string; // the word as an exact vector outline
  ox: number; // zoom origin: the deepest point inside the chosen letter
  oy: number;
  maxZoom: number; // enough for that letter's stroke to cover the whole viewport
}

let fontPromise: Promise<opentype.Font> | null = null;
const loadFont = () =>
  (fontPromise ??= fetch(fontUrl)
    .then((r) => r.arrayBuffer())
    .then((buf) => opentype.parse(buf)));

/**
 * Lays `word` out from the font file's own outlines, so the rendered cut-out and the maths below use one
 * identical shape. The zoom origin is the point inside letter `letterIndex` farthest from any edge (a
 * chamfer distance transform over the rasterised outline), and that depth sets how far to zoom for the
 * stroke to swallow the viewport.
 */
export async function measureWord(word: string, letterIndex: number, w: number, h: number): Promise<WordLayout> {
  const font = await loadFont();
  const ratio = font.getAdvanceWidth(word, 100) / 100;
  const fontSize = Math.min((w * 0.88) / ratio, h * 0.42);
  const total = font.getAdvanceWidth(word, fontSize);
  const os2 = (font.tables as { os2?: { sCapHeight?: number } }).os2;
  const capHeight = ((os2?.sCapHeight || font.unitsPerEm * 0.7) / font.unitsPerEm) * fontSize;
  const x = (w - total) / 2;
  const baseline = h / 2 + capHeight / 2;

  const d = font.getPath(word, x, baseline, fontSize).toPathData(2);
  const letter = font.getPaths(word, x, baseline, fontSize)[letterIndex];
  const box = letter.getBoundingBox();

  const bx = Math.floor(box.x1) - 2;
  const by = Math.floor(box.y1) - 2;
  const bw = Math.ceil(box.x2 - box.x1) + 4;
  const bh = Math.ceil(box.y2 - box.y1) + 4;
  const canvas = document.createElement('canvas');
  canvas.width = bw;
  canvas.height = bh;
  const ctx = canvas.getContext('2d', { willReadFrequently: true })!;
  ctx.translate(-bx, -by);
  ctx.fill(new Path2D(letter.toPathData(2)));
  const px = ctx.getImageData(0, 0, bw, bh).data;

  // Two-pass chamfer distance: distance of each solid pixel to the nearest empty one
  const dist = new Float32Array(bw * bh);
  for (let i = 0; i < bw * bh; i++) dist[i] = px[i * 4 + 3] > 128 ? 1e9 : 0;
  const at = (xx: number, yy: number) => (xx < 0 || yy < 0 || xx >= bw || yy >= bh ? 0 : dist[yy * bw + xx]);
  for (let yy = 0; yy < bh; yy++)
    for (let xx = 0; xx < bw; xx++) {
      const i = yy * bw + xx;
      if (dist[i] === 0) continue;
      dist[i] = Math.min(dist[i], at(xx - 1, yy) + 1, at(xx, yy - 1) + 1, at(xx - 1, yy - 1) + 1.414, at(xx + 1, yy - 1) + 1.414);
    }
  let best = 0;
  let ox = (box.x1 + box.x2) / 2;
  let oy = (box.y1 + box.y2) / 2;
  for (let yy = bh - 1; yy >= 0; yy--)
    for (let xx = bw - 1; xx >= 0; xx--) {
      const i = yy * bw + xx;
      if (dist[i] === 0) continue;
      dist[i] = Math.min(dist[i], at(xx + 1, yy) + 1, at(xx, yy + 1) + 1, at(xx + 1, yy + 1) + 1.414, at(xx - 1, yy + 1) + 1.414);
      if (dist[i] > best) {
        best = dist[i];
        ox = bx + xx + 0.5;
        oy = by + yy + 0.5;
      }
    }

  // Scale needed for a disc of radius `best` around the origin to reach the farthest viewport corner
  const farthest = Math.max(Math.hypot(ox, oy), Math.hypot(w - ox, oy), Math.hypot(ox, h - oy), Math.hypot(w - ox, h - oy));
  const maxZoom = Math.max(20, (farthest / Math.max(best - 1, 1)) * 1.15);

  return { w, h, fontSize, baseline, d, ox, oy, maxZoom };
}

/**
 * SVG transform for progress `v`: an exponential zoom from 1 to `maxZoom` between `start` and
 * `start + span`, so every scroll step feels like the same speed of travel.
 */
export function zoomTransform(layout: WordLayout, v: number, start: number, span: number) {
  const s = Math.pow(layout.maxZoom, Math.min(1, Math.max(0, (v - start) / span)));
  return `translate(${layout.ox} ${layout.oy}) scale(${s}) translate(${-layout.ox} ${-layout.oy})`;
}
