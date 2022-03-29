import { useMemo } from 'react';
import { selector, useRecoilValue } from 'recoil';

import { calculateDimensions } from '../dimensions';
import { hiddenSetSelector } from './config/setManagementAtoms';
import { upsetConfigAtom } from './config/upsetConfigAtoms';
import { rowsCountSelector } from './renderRowsAtom';

export const dimensionsSelector = selector<
  ReturnType<typeof calculateDimensions>
>({
  key: 'dimensions',
  get: ({ get }) => {
    const { visibleSets, visibleAttributes } = get(upsetConfigAtom);
    const rowCount = get(rowsCountSelector);
    const hiddenSets = get(hiddenSetSelector);

    return calculateDimensions(
      visibleSets.length,
      hiddenSets.length,
      rowCount,
      visibleAttributes.length,
    );
  },
});

export function useSvgDimensions() {
  const { height, width, margin } = useRecoilValue(dimensionsSelector);

  return useMemo(() => {
    return { height, width, margin };
  }, [height, width, margin]);
}
