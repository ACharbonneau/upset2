import { getSubsets, Subsets } from '@visdesignlab/upset2-core';
import { selector } from 'recoil';

import { attributeSelector } from './attributeAtom';
import { visibleSetSelector } from './config/setManagementAtoms';
import { itemsSelector } from './itemsAtoms';
import { setsSelector } from './setsAtoms';

export const subsetSelector = selector<Subsets>({
  key: 'subsets',
  get: ({ get }) => {
    const items = get(itemsSelector);
    const sets = get(setsSelector);
    const visibleSets = get(visibleSetSelector);
    const attributeColumns = get(attributeSelector);

    return getSubsets(items, sets, visibleSets, attributeColumns);
  },
});
