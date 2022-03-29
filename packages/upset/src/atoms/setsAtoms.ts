import { Sets } from '@visdesignlab/upset2-core';
import { selector } from 'recoil';

import { dataAtom } from './dataAtom';

export const setsSelector = selector<Sets>({
  key: 'base-sets',
  get: ({ get }) => {
    const data = get(dataAtom);

    return data.sets;
  },
});
