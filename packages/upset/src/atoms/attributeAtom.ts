import { selector, selectorFamily } from 'recoil';

import { dataAtom } from './dataAtom';
import { itemsSelector } from './itemsAtoms';

export const attributeSelector = selector<string[]>({
  key: 'attribute-columns',
  get: ({ get }) => get(dataAtom).attributeColumns,
});

export const attributeValuesSelector = selectorFamily<number[], string>({
  key: 'attribute-values',
  get:
    (attribute: string) =>
    ({ get }) => {
      const items = get(itemsSelector);
      const values = Object.values(items).map(
        (val) => val[attribute] as number,
      );
      return values;
    },
});

export const attributeMinMaxSelector = selectorFamily<
  { min: number; max: number },
  string
>({
  key: 'attribute-min-max',
  get:
    (attribute: string) =>
    ({ get }) => {
      const values = get(attributeValuesSelector(attribute));
      return {
        min: Math.min(...values),
        max: Math.max(...values),
      };
    },
});
