import type { Locale } from '../lib/portfolio';

interface ProjectionPoint {
  id: string;
  /** One position per projection, in the 0-100 × 0-60 diagram space. */
  positions: { x: number; y: number }[];
  /**
   * False when the row has no comparable basis. Such points are drawn hollow
   * and parked in their own band; plotting them at zero is the exact dishonesty
   * this case is about.
   */
  known: boolean;
  /** True for the rows the last projection is meant to surface. */
  selected: boolean;
}

export interface ProjectionCase {
  projections: { id: string; label: Record<Locale, string>; note: Record<Locale, string> }[];
  points: ProjectionPoint[];
  unknownLabel: Record<Locale, string>;
}

/**
 * Deterministic positions. The visual is captured by the screenshot gate, so a
 * layout that reshuffled on every render would either fail the comparison or
 * force the threshold up until it stopped comparing anything.
 */
function seeded(seed: number): () => number {
  let state = seed >>> 0;
  return () => {
    state = (state * 1_664_525 + 1_013_904_223) >>> 0;
    return state / 0x1_0000_0000;
  };
}

/** Shared with the renderer so the band line and the parked points agree. */
export const UNKNOWN_BAND_Y = 54;

/**
 * Where a point may land: the full width of the diagram, and everything above
 * the unknown band and the label that names it. Wider than any projection
 * actually uses, because it is a limit rather than a layout.
 */
const PLOT = { minX: 3, maxX: 97, minY: 3, maxY: 46 };

/**
 * Move a point away from `from` by `factor`, stopping at the edge of the plot.
 *
 * `.projection__canvas` sets `overflow: visible`, so a position outside the
 * `viewBox` is not clipped — it is drawn outside the bordered panel, over
 * whatever the page has there. The direction of the push is what carries the
 * meaning, so the ray is shortened rather than the coordinates squashed: a
 * point that would land past an edge stops on it, still pointing the way it
 * was pushed.
 */
function pushedFrom(
  from: { x: number; y: number },
  to: { x: number; y: number },
  factor: number,
): { x: number; y: number } {
  const dx = to.x - from.x;
  const dy = to.y - from.y;
  const reach = (delta: number, low: number, high: number, origin: number): number =>
    delta > 0
      ? (high - origin) / delta
      : delta < 0
        ? (low - origin) / delta
        : Number.POSITIVE_INFINITY;
  const scale = Math.min(
    factor,
    reach(dx, PLOT.minX, PLOT.maxX, from.x),
    reach(dy, PLOT.minY, PLOT.maxY, from.y),
  );
  return { x: from.x + dx * scale, y: from.y + dy * scale };
}

/** Rows with no basis sit on their own band, spread evenly along it. */
function unknownPosition(index: number, total: number): { x: number; y: number } {
  return { x: 12 + (index / Math.max(total - 1, 1)) * 76, y: UNKNOWN_BAND_Y };
}

/**
 * Ranking: one dataset under three explicit bases. The dataset does not change
 * between them — only the question being asked of it does, which is why the
 * unknown band is the same height in all three.
 */
export function rankingProjection(): ProjectionCase {
  const random = seeded(20_260_831);
  const total = 48;
  const unknownEvery = 6;
  let unknownIndex = 0;
  const unknownTotal = Math.floor(total / unknownEvery);

  const points = Array.from({ length: total }, (_, index) => {
    const known = index % unknownEvery !== 0;
    const jitterX = random();
    const jitterY = random();
    if (!known) {
      const parked = unknownPosition(unknownIndex, unknownTotal);
      unknownIndex += 1;
      return {
        id: `r${index}`,
        known,
        selected: false,
        positions: [parked, parked, parked],
      };
    }
    // Absolute: raw magnitude, so most rows pile into one corner.
    const absolute = { x: 14 + jitterX ** 3.4 * 70, y: 38 - jitterY ** 2.6 * 30 };
    // Adjusted: the same rows against their own cohort, which spreads them.
    const adjusted = { x: 14 + jitterX * 70, y: 38 - jitterY * 30 };
    // Category: three explicit bands rather than a continuous score.
    const band = Math.min(2, Math.floor(jitterY * 3));
    const category = { x: 14 + jitterX * 70, y: 12 + band * 13 };
    return { id: `r${index}`, known, selected: false, positions: [absolute, adjusted, category] };
  });

  return {
    points,
    unknownLabel: { RU: 'НЕТ БАЗЫ ДЛЯ СРАВНЕНИЯ', EN: 'NO COMPARABLE BASIS' },
    projections: [
      {
        id: 'absolute',
        label: { RU: 'Абсолют', EN: 'Absolute' },
        note: {
          RU: 'Сырая величина. Объекты разных когорт сравниваются между собой и слипаются в один угол.',
          EN: 'Raw magnitude. Rows from different cohorts are compared to each other and pile into one corner.',
        },
      },
      {
        id: 'adjusted',
        label: { RU: 'С поправкой на когорту', EN: 'Cohort-adjusted' },
        note: {
          RU: 'Те же строки против собственной когорты. База сравнения указана в ответе, а не подразумевается.',
          EN: 'The same rows against their own cohort. The basis is stated in the response, not implied.',
        },
      },
      {
        id: 'category',
        label: { RU: 'Категория', EN: 'Category' },
        note: {
          RU: 'Три явные полосы вместо непрерывного балла: точность, которой нет в данных, не изображается.',
          EN: 'Three explicit bands rather than a continuous score: precision the data does not have is not drawn.',
        },
      },
    ],
  };
}

/**
 * Image similarity: the same catalogue seen as storage, as an embedding space,
 * and as the answer to one query.
 */
export function embeddingProjection(): ProjectionCase {
  const random = seeded(4_812_026);
  const total = 54;
  const clusters = [
    { x: 28, y: 18 },
    { x: 62, y: 34 },
    { x: 82, y: 14 },
  ];
  const query = { x: 62, y: 34 };

  const points = Array.from({ length: total }, (_, index) => {
    const rejected = index % 9 === 0;
    const clusterIndex = index % 3;
    const cluster = clusters[clusterIndex]!;
    const angle = random() * Math.PI * 2;
    const spread = random();
    if (rejected) {
      const parked = unknownPosition(Math.floor(index / 9), Math.floor(total / 9));
      return {
        id: `v${index}`,
        known: false,
        selected: false,
        positions: [parked, parked, parked],
      };
    }
    const catalogue = { x: 12 + random() * 76, y: 8 + random() * 36 };
    const embedded = {
      x: cluster.x + Math.cos(angle) * spread * 14,
      y: cluster.y + Math.sin(angle) * spread * 9,
    };
    // Neighbours of the query converge; everything else is pushed outward, so
    // the answer is a distance and not a highlight colour.
    const selected = clusterIndex === 1 && spread < 0.45;
    const nearest = pushedFrom(query, embedded, selected ? 0.3 : 1.25);
    return { id: `v${index}`, known: true, selected, positions: [catalogue, embedded, nearest] };
  });

  return {
    points,
    unknownLabel: { RU: 'ОТКЛОНЕНО КАЧЕСТВОМ', EN: 'REJECTED BY QUALITY GATE' },
    projections: [
      {
        id: 'catalogue',
        label: { RU: 'Хранилище', EN: 'Storage' },
        note: {
          RU: '230k+ объектов в S3-совместимом хранилище. Порядок здесь ничего не значит.',
          EN: '230k+ objects in S3-compatible storage. Position here carries no meaning.',
        },
      },
      {
        id: 'embedding',
        label: { RU: 'Векторное пространство', EN: 'Embedding space' },
        note: {
          RU: 'CLIP-эмбеддинги в Qdrant. Соседство означает похожесть, а не совпадение тегов.',
          EN: 'CLIP embeddings in Qdrant. Proximity means similarity, not matching tags.',
        },
      },
      {
        id: 'nearest',
        label: { RU: 'Ближайшие к запросу', EN: 'Nearest to query' },
        note: {
          RU: 'Ответ — расстояние с порогом. Если ближе порога ничего нет, выдача пустая, а не «примерно похожее».',
          EN: 'The answer is a thresholded distance. With nothing inside it the result is empty, not "roughly similar".',
        },
      },
    ],
  };
}
