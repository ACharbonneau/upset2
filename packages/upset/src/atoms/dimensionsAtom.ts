import { useMemo } from 'react';
import { selector, useRecoilValue } from 'recoil';

import { calculateDimensions } from '../dimensions';
import { visibleAttributesSelector } from './config/visibleAttributes';
import { hiddenSetSelector, visibleSetSelector } from './config/visibleSetsAtoms';
import { rowsCountSelector } from './renderRowsAtom';

export const dimensionsSelector = selector<
  ReturnType<typeof calculateDimensions>
>({
  key: 'dimensions',
  get: ({ get }) => {
    const visibleSets = get(visibleSetSelector);
    const rowCount = get(rowsCountSelector);
    const hiddenSets = get(hiddenSetSelector);
    const attributes = get(visibleAttributesSelector);

    return calculateDimensions(
      visibleSets.length,
      hiddenSets.length,
      rowCount,
      attributes.length,
    );
  },
});

export function useSvgDimensions() {
  const { height, width, margin } = useRecoilValue(dimensionsSelector);

  return useMemo(() => {
    return { height, width, margin };
  }, [height, width, margin]);
}
