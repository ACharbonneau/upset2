import { getDegreeFromSetMembership, Intersections, SortBy } from './types';

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

export function sortIntersections(
  intersections: Intersections,
  sortBy: SortBy,
) {
  switch (sortBy) {
    case 'Cardinality':
      return sortByCardinality(intersections);
    case 'Degree':
      return sortByDegree(intersections);
    case 'Deviation':
      return sortByDeviation(intersections);
    default:
      throw new Error('Unknown sortBy value: ' + sortBy);
  }
}
