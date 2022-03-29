import { selector } from 'recoil';

import { setsSelector } from './setsAtoms';

export const maxSetSizeSelector = selector({
  key: 'max-set-size',
  get: ({ get }) => {
    const sets = get(setsSelector);

    const sizes = Object.values(sets).map((set) => set.size);
    const maxSize = Math.max(...sizes);

    return maxSize;
  },
});
