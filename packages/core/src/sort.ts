import { Aggregate, Aggregates, getDegreeFromSetMembership, Intersections, SortBy, Subset, Subsets } from './types';
import { isObjectEmpty, objectForEach } from './utils';

function sortByCardinality(intersections: Intersections) {
  return Object.values(intersections)
    .sort((b, a) => a.size - b.size)
    .map((d) => d.id);
}

function sortByDegree(intersections: Intersections) {
  return Object.values(intersections)
    .sort(
      (b, a) =>
        getDegreeFromSetMembership(a.setMembership) -
        getDegreeFromSetMembership(b.setMembership),
    )
    .map((d) => d.id);
}

function sortByDeviation(intersections: Intersections) {
  return Object.values(intersections)
    .sort((b, a) => a.deviation - b.deviation)
    .map((d) => d.id);
}

function sortIntersections(intersection: Intersections, sortBy: SortBy) {
  switch (sortBy) {
    case 'Cardinality':
      return sortByCardinality(intersection);
    case 'Degree':
      return sortByDegree(intersection);
    case 'Deviation':
      return sortByDeviation(intersection);
    default:
      throw new Error('Unknown sortBy value: ' + sortBy);
  }
}

type SortMap = {
  [key: string]: string[];
};

type SubsetOnlySortOrder = {
  subsetsOrder: string[];
};

type SingleAggregateSortOrder = {
  aggregatesOrder: string[];
  subsetsOrder: SortMap;
};

type SecondAggregateSortOrder = {
  firstAggregatesOrder: string[];
  secondAggregateOrder: SortMap;
  subsetsOrder: SortMap;
};

export function sortSubsets(
  subsets: Subsets,
  sortBy: SortBy,
): SubsetOnlySortOrder {
  if (isObjectEmpty(subsets)) throw new Error('Nothing to sort');

  return {
    subsetsOrder: sortIntersections(subsets, sortBy),
  };
}

export function sortSingleAggregate(
  aggregates: Aggregates,
  subsets: Subsets,
  sortBy: SortBy,
): SingleAggregateSortOrder {
  const subsetsOrder: SortMap = {};

  objectForEach(aggregates, (aggregate) => {
    const items = aggregate.items
      .map((i) => subsets[i])
      .reduce(
        (acc: Subsets, curr: Subset) => ({ ...acc, [curr.id]: curr }),
        {},
      );

    subsetsOrder[aggregate.id] = sortIntersections(items, sortBy);
  });

  return {
    aggregatesOrder: sortIntersections(aggregates, sortBy),
    subsetsOrder,
  };
}

export function sortSecondAggregate(
  firstLevelAggregates: Aggregates,
  secondLevelAggregates: Aggregates,
  subsets: Subsets,
  sortBy: SortBy,
): SecondAggregateSortOrder {
  let subsetsOrder: SortMap = {};
  const secondAggregateOrder: SortMap = {};

  objectForEach(firstLevelAggregates, (aggregate) => {
    const sub_aggregates = aggregate.items
      .map((i) => secondLevelAggregates[i])
      .reduce(
        (acc: Aggregates, curr: Aggregate) => ({ ...acc, [curr.id]: curr }),
        {},
      );

    const { aggregatesOrder: secondSortOrder, subsetsOrder: sub_order } =
      sortSingleAggregate(sub_aggregates, subsets, sortBy);

    secondAggregateOrder[aggregate.id] = secondSortOrder;
    subsetsOrder = { ...subsetsOrder, ...sub_order };
  });

  return {
    firstAggregatesOrder: sortIntersections(firstLevelAggregates, sortBy),
    secondAggregateOrder,
    subsetsOrder,
  };
}
