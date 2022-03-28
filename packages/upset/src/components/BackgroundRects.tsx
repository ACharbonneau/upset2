/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import { useRecoilValue } from 'recoil';

import { visibleSetSelector } from '../atoms/config/visibleSetsAtoms';
import { dimensionsSelector } from '../atoms/dimensionsAtom';
import { useHoveredEntities } from '../atoms/hoverAtom';
import { flattenedRowsSelector } from '../atoms/renderRowsAtom';
import { highlightBackground } from '../utils/styles';
import translate from '../utils/transform';

export const BackgroundRects = () => {
  const dimensions = useRecoilValue(dimensionsSelector);
  const visibleSets = useRecoilValue(visibleSetSelector);
  const rows = useRecoilValue(flattenedRowsSelector);
  const hovered = useHoveredEntities();

  return (
    <>
      <g
        className="background-columns"
        transform={translate(dimensions.set.label.height, 0)}
      >
        {visibleSets.map((setName, idx) => (
          <g key={setName} transform={translate(idx * dimensions.set.width, 0)}>
            <rect
              className={setName}
              css={css`
                ${hovered.shouldTreatAsHovered(setName) && highlightBackground}
              `}
              height={dimensions.body.height}
              width={dimensions.set.width}
              fill="none"
              pointerEvents="none"
            />
          </g>
        ))}
      </g>
      <g
        className="background-rows"
        transform={translate(dimensions.set.label.height, 0)}
      >
        {rows.map(({ row }, idx) => {
          if (row.type !== 'Subset') return null;

          const subsetId = row.id;

          return (
            <g
              key={subsetId}
              transform={translate(0, idx * dimensions.body.rowHeight)}
            >
              <rect
                key={subsetId}
                className={subsetId}
                css={css`
                  ${hovered.shouldTreatAsHovered(subsetId) &&
                  highlightBackground}
                `}
                height={dimensions.body.rowHeight}
                width={dimensions.body.rowWidth}
                fill="none"
              />
            </g>
          );
        })}
      </g>
    </>
  );
};
