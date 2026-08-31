import { useId, useState } from 'react';
import type { Locale } from '../lib/portfolio';
import { UNKNOWN_BAND_Y, type ProjectionCase } from './projection';

/**
 * One dataset under several explicit projections.
 *
 * Rows without a comparable basis keep their own band in every projection.
 * They are never moved onto the plot, because a point at zero and a point with
 * no value are different facts and the chart is the place that usually loses
 * the difference.
 */
export function PointProjection({
  data,
  locale,
  label,
}: {
  data: ProjectionCase;
  locale: Locale;
  label: string;
}): React.JSX.Element {
  const [index, setIndex] = useState(0);
  const projection = data.projections[index] ?? data.projections[0]!;
  const noteId = useId();
  const unknownCount = data.points.filter((point) => !point.known).length;

  return (
    <figure className="projection">
      <div aria-label={label} className="projection__controls" role="group">
        {data.projections.map((item, itemIndex) => (
          <button
            aria-pressed={itemIndex === index}
            key={item.id}
            onClick={() => setIndex(itemIndex)}
            type="button"
          >
            {item.label[locale]}
          </button>
        ))}
      </div>

      <svg aria-describedby={noteId} className="projection__canvas" viewBox="0 0 100 60">
        <line className="projection__band" x1="8" x2="92" y1={UNKNOWN_BAND_Y} y2={UNKNOWN_BAND_Y} />
        <text className="projection__band-label" x="8" y={UNKNOWN_BAND_Y - 3}>
          {data.unknownLabel[locale]} · {unknownCount}
        </text>
        {data.points.map((point) => {
          const position = point.positions[index] ?? point.positions[0]!;
          return (
            <circle
              className={`projection__point${point.known ? '' : ' is-unknown'}${
                point.selected && index === data.projections.length - 1 ? ' is-selected' : ''
              }`}
              cx={point.positions[0]!.x}
              cy={point.positions[0]!.y}
              key={point.id}
              r={point.known ? 1.4 : 1.2}
              style={{
                translate: `${position.x - point.positions[0]!.x}px ${
                  position.y - point.positions[0]!.y
                }px`,
              }}
            />
          );
        })}
      </svg>

      <figcaption className="projection__note t-small text-secondary" id={noteId}>
        {projection.note[locale]}
      </figcaption>
    </figure>
  );
}
