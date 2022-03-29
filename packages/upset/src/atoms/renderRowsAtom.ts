import { Intersection, Intersections } from '@visdesignlab/upset2-core';
import { selector } from 'recoil';

import { dimensionsSelector } from './dimensionsAtom';

const firstAggRRSelector = selector<Intersections>({
  key: 'first-aggregate-render-row',
  get: ({ get }) => {
    return {};
  },
});

const secondAggRRSelector = selector<Intersections>({
  key: 'second-aggregate-render-row',
  get: ({ get }) => {
    return {};
  },
});

const sortByRRSelector = selector<Intersections>({
  key: 'sort-render-row',
  get: ({ get }) => {
    return {};
  },
});

const filterRRSelector = selector<Intersections>({
  key: 'filter-render-row',
  get: ({ get }) => {
    return {};
  },
});

export type RowConfig = {
  position: number;
  collapsed: boolean;
};

export type RowConfigMap = { [key: string]: RowConfig };

export const rowsSelector = selector<Intersections>({
  key: 'rows',
  get: ({ get }) => get(filterRRSelector),
});

export type RenderRow = {
  id: string;
  row: Intersection;
};

function flattenRows(
  rows: Intersections,
  flattenedRows: RenderRow[] = [],
  idPrefix: string = '',
): RenderRow[] {
  return [];
}

export const flattenedRowsSelector = selector<RenderRow[]>({
  key: 'flattened-rows',
  get: ({ get }) => {
    return [];
  },
});

export const flattenedOnlyRows = selector({
  key: 'only-rows',
  get: ({ get }) => {
    return {};
  },
});

export const rowsCountSelector = selector({
  key: 'render-row-count',
  get: ({ get }) => {
    const rr = get(flattenedRowsSelector);
    return rr.length;
  },
});

export const rowConfigSelector = selector<RowConfigMap>({
  key: 'row-config',
  get: ({ get }) => {
    const flattenedRows = get(flattenedRowsSelector);
    const dimensions = get(dimensionsSelector);

    const configMap: RowConfigMap = {};

    flattenedRows.forEach((row, idx) => {
      const config: RowConfig = {
        position: idx * dimensions.body.rowHeight,
        collapsed: false,
      };

      configMap[row.id] = config;
    });

    return configMap;
  },
});
