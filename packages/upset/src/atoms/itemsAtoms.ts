import { Items } from '@visdesignlab/upset2-core';
import { selector } from 'recoil';

import { dataAtom } from './dataAtom';

export const itemsSelector = selector<Items>({
  key: 'items',
  get: ({ get }) => get(dataAtom).items,
});
