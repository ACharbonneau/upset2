import { getDegreeFromSetMembership, Intersection, isIntersectionAggregate, isIntersectionSubset } from './types';

type FilterConfig = {
  maxVisible: number;
  minVisible: number;
  hideEmpty: boolean;
};

export function filterIntersection(
  intersection: Intersection,
  config: Partial<FilterConfig>,
): boolean {
  const { maxVisible = 3, minVisible = 0, hideEmpty = false } = config;

  if (hideEmpty && intersection.size === 0) return true;

  const degree = getDegreeFromSetMembership(intersection.setMembership);

  let shouldFilter = false;

  if (isIntersectionSubset(intersection)) {
    shouldFilter = degree < minVisible || degree > maxVisible;
  }

  if (isIntersectionAggregate(intersection)) {
    if (
      intersection.aggregateBy === 'Degree' ||
      intersection.aggregateBy === 'Overlaps'
    ) {
      shouldFilter = degree < minVisible || degree > maxVisible;
    }
  }

  return shouldFilter;
}
