import { describe, expect, it } from 'vitest';
import { embeddingProjection, rankingProjection, UNKNOWN_BAND_Y } from './projection';

describe('projections', () => {
  it('produce the same layout on every call', () => {
    // The visual is covered by the screenshot gate. A layout that reshuffled
    // would either fail that comparison or force its threshold up until it
    // compared nothing.
    expect(rankingProjection().points).toEqual(rankingProjection().points);
    expect(embeddingProjection().points).toEqual(embeddingProjection().points);
  });

  it('keep rows without a basis on their own band in every projection', () => {
    for (const data of [rankingProjection(), embeddingProjection()]) {
      const unknown = data.points.filter((point) => !point.known);
      expect(unknown.length).toBeGreaterThan(0);
      for (const point of unknown) {
        expect(point.positions).toHaveLength(data.projections.length);
        for (const position of point.positions) expect(position.y).toBe(UNKNOWN_BAND_Y);
      }
    }
  });

  it('never move a known row onto the unknown band', () => {
    for (const data of [rankingProjection(), embeddingProjection()]) {
      for (const point of data.points.filter((candidate) => candidate.known)) {
        for (const position of point.positions) expect(position.y).not.toBe(UNKNOWN_BAND_Y);
      }
    }
  });

  it('keep every point inside the frame it is drawn in', () => {
    // `.projection__canvas` sets `overflow: visible`, so a position outside the
    // `viewBox` is drawn outside the bordered panel rather than clipped. The
    // nearest-to-query projection pushes non-neighbours away from the query and
    // used to send the outer clusters past the top and right edges.
    for (const data of [rankingProjection(), embeddingProjection()]) {
      for (const point of data.points) {
        for (const position of point.positions) {
          expect(position.x, `x of ${point.id}`).toBeGreaterThanOrEqual(2);
          expect(position.x, `x of ${point.id}`).toBeLessThanOrEqual(98);
          expect(position.y, `y of ${point.id}`).toBeGreaterThanOrEqual(2);
          expect(position.y, `y of ${point.id}`).toBeLessThanOrEqual(58);
        }
      }
    }
  });

  it('gives every point one position per projection', () => {
    for (const data of [rankingProjection(), embeddingProjection()]) {
      for (const point of data.points) {
        expect(point.positions).toHaveLength(data.projections.length);
      }
    }
  });
});
