import { combinationsFromArray } from './combinations';
import { getFiveNumberSummary, getId } from './process';
import {
  Aggregate,
  AggregateBy,
  Aggregates,
  getBelongingSetsFromSetMembership,
  getDegreeFromSetMembership,
  Intersections,
  Items,
  SetMembershipStatus,
  Sets,
  Subset,
  Subsets,
  UNINCLUDED,
} from './types';
import { isObjectEmpty, objectForEach } from './utils';

function aggregateByDegree(
  intersections: Intersections,
  level: number,
  items: Items,
  attributeColumns: string[],
) {
  if (isObjectEmpty(intersections)) throw new Error('No intersections');

  const aggs: Aggregates = {};
  const degreeMap: { [key: string]: string } = {};

  const setList = Object.keys(
    intersections[Object.keys(intersections)[0]].setMembership,
  );

  for (let i = 0; i <= setList.length; ++i) {
    const id = getId('Agg', `Degree ${i}`);

    const agg: Aggregate = {
      id,
      elementName: `Degree ${i}`,
      items: [],
      size: 0,
      type: 'Aggregate',
      setMembership: {},
      deviation: 0,
      aggregateBy: 'Degree',
      level,
      description: i === 0 ? 'in no set' : `${i} set intersection`,
      attributes: {},
    };

    degreeMap[i] = id;
    aggs[id] = agg;
  }

  objectForEach(intersections, (intersections) => {
    const degree = getDegreeFromSetMembership(intersections.setMembership);

    const relevantAggregate = aggs[degreeMap[degree]];

    relevantAggregate.items.push(intersections.id);
    relevantAggregate.size += intersections.size;
    relevantAggregate.deviation += intersections.deviation;
  });

  objectForEach(aggs, (aggregate: Aggregate) => {
    aggregate.attributes = getFiveNumberSummary(
      items,
      aggregate.items,
      attributeColumns,
    );
  });

  return aggs;
}

function aggregateBySets(
  intersections: Intersections,
  sets: Sets,
  level: number,
  items: Items,
  attributeColumns: string[],
) {
  if (isObjectEmpty(intersections)) throw new Error('No intersections');

  const aggs: Aggregates = {};

  const setMap: { [k: string]: string } = {};
  const setList = Object.keys(
    intersections[Object.keys(intersections)[0]].setMembership,
  );

  const setMembership: { [key: string]: SetMembershipStatus } = {};
  const setMembershipNone: { [key: string]: SetMembershipStatus } = {};

  setList.forEach((d) => {
    setMembership[d] = 'May';
    setMembershipNone[d] = 'No';
  });

  setList.unshift(UNINCLUDED);

  setList.forEach((set) => {
    const elementName = sets[set]?.elementName || 'No Set';
    const id = getId('Agg', elementName);

    const agg: Aggregate = {
      id,
      elementName,
      items: [],
      size: 0,
      type: 'Aggregate',
      setMembership:
        set === UNINCLUDED
          ? { ...setMembershipNone }
          : { ...setMembership, [set]: 'Yes' },
      deviation: 0,
      aggregateBy: 'Sets',
      level,
      description: elementName,
      attributes: {},
    };

    setMap[set] = id;
    aggs[id] = agg;
  });

  objectForEach(intersections, (intersection) => {
    const belongingSets = getBelongingSetsFromSetMembership(
      intersection.setMembership,
    );

    if (belongingSets.length === 0) {
      const relevantAggregate = aggs[setMap[UNINCLUDED]];

      relevantAggregate.items.push(intersection.id);
      relevantAggregate.size += intersection.size;
      relevantAggregate.deviation += intersection.deviation;
    }
    belongingSets.forEach((set) => {
      const relevantAggregate = aggs[setMap[set]];

      relevantAggregate.items.push(intersection.id);
      relevantAggregate.size += intersection.size;
      relevantAggregate.deviation += intersection.deviation;
    });
  });

  objectForEach(aggs, (aggregate: Aggregate) => {
    aggregate.attributes = getFiveNumberSummary(
      items,
      aggregate.items,
      attributeColumns,
    );
  });

  return aggs;
}

function aggregateByDeviation(
  intersections: Intersections,
  level: number,
  items: Items,
  attributeColumns: string[],
) {
  if (isObjectEmpty(intersections)) throw new Error('No intersections');

  const aggs: Aggregates = {};

  const deviationMap: { [key: string]: string } = {};
  const deviationTypes = {
    pos: {
      elementName: 'Positive',
      description: 'Positive Expected Value',
    },
    neg: {
      elementName: 'Negative',
      description: 'Negative Expected Value',
    },
  };

  Object.entries(deviationTypes).forEach(([type, val]) => {
    const { elementName, description } = val;

    const id = getId('Agg', elementName);

    const agg: Aggregate = {
      id,
      elementName,
      description,
      items: [],
      size: 0,
      type: 'Aggregate',
      setMembership: {},
      deviation: 0,
      aggregateBy: 'Deviations',
      level,
      attributes: {},
    };

    deviationMap[type] = id;
    aggs[id] = agg;
  });

  objectForEach(intersections, (intersection) => {
    const deviationType = intersection.deviation >= 0 ? 'pos' : 'neg';

    const relevantAggregate = aggs[deviationMap[deviationType]];

    relevantAggregate.items.push(intersection.id);
    relevantAggregate.size += intersection.size;
    relevantAggregate.deviation += intersection.deviation;
  });

  objectForEach(aggs, (aggregate) => {
    aggregate.attributes = getFiveNumberSummary(
      items,
      aggregate.items,
      attributeColumns,
    );
  });

  return aggs;
}

function aggregateByOverlaps(
  intersections: Intersections,
  sets: Sets,
  degree: number,
  level: number,
  items: Items,
  attributeColumns: string[],
) {
  if (isObjectEmpty(intersections)) throw new Error('No intersections');

  const aggs: Aggregates = {};

  const setMembership: { [key: string]: SetMembershipStatus } = {};

  const setList = Object.keys(
    intersections[Object.keys(intersections)[0]].setMembership,
  );
  const combinations: string[] = combinationsFromArray(setList, degree).map(
    (combo: string[]) => combo.sort().join(','),
  );

  const overlapAggMap: { [key: string]: string } = {};

  setList.forEach((d) => {
    setMembership[d] = 'May';
  });

  combinations.forEach((combo) => {
    const comboSets = combo.split(',');
    const setNames = comboSets.map((set) => sets[set].elementName);
    const elementName = setNames.join(' - ');

    const id = getId('Agg', elementName);

    const sm = { ...setMembership };
    comboSets.forEach((s) => {
      sm[s] = 'Yes';
    });

    const agg: Aggregate = {
      id,
      elementName,
      items: [],
      size: 0,
      type: 'Aggregate',
      aggregateBy: 'Overlaps',
      setMembership: sm,
      deviation: 0,
      level,
      description: setNames.join(' - '),
      attributes: {},
    };

    overlapAggMap[combo] = id;
    aggs[id] = agg;
  });

  objectForEach(intersections, (subset) => {
    const belongingSets = getBelongingSetsFromSetMembership(
      subset.setMembership,
    );
    const overlaps: string[] = combinationsFromArray(belongingSets, degree).map(
      (combo: string[]) => combo.sort().join(','),
    );

    overlaps.forEach((over) => {
      const relevantAgg = aggs[overlapAggMap[over]];

      relevantAgg.items.push(subset.id);
      relevantAgg.size += subset.size;
      relevantAgg.deviation += subset.deviation;
    });
  });

  objectForEach(aggs, (aggregate) => {
    aggregate.attributes = getFiveNumberSummary(
      items,
      aggregate.items,
      attributeColumns,
    );
  });

  return aggs;
}

function aggregateIntersections(
  intersections: Intersections,
  aggregateBy: AggregateBy,
  overlapDegree: number,
  sets: Sets,
  items: Items,
  attributeColumns: string[],
  level: number = 1,
) {
  switch (aggregateBy) {
    case 'Degree':
      return aggregateByDegree(intersections, level, items, attributeColumns);
    case 'Sets':
      return aggregateBySets(
        intersections,
        sets,
        level,
        items,
        attributeColumns,
      );
    case 'Deviations':
      return aggregateByDeviation(
        intersections,
        level,
        items,
        attributeColumns,
      );
    case 'Overlaps':
      return aggregateByOverlaps(
        intersections,
        sets,
        overlapDegree,
        level,
        items,
        attributeColumns,
      );
    default:
      throw new Error('Incorrect aggregateBy value');
  }
}

export function firstAggregation(
  subsets: Subsets,
  aggregateBy: AggregateBy,
  overlapDegree: number,
  sets: Sets,
  items: Items,
  attributeColumns: string[],
): Intersections {
  return aggregateIntersections(
    subsets,
    aggregateBy,
    overlapDegree,
    sets,
    items,
    attributeColumns,
  );
}

export function secondAggregation(
  aggregates: Aggregates,
  subsets: Subsets,
  aggregateBy: AggregateBy,
  overlapDegree: number,
  sets: Sets,
  items: Items,
  attributeColumns: string[],
) {
  const firstLevelAggregates: Aggregates = {};
  const secondLevelAggregates: Aggregates = {};

  objectForEach(aggregates, (aggregate) => {
    const relevantSubsets = aggregate.items
      .map((i) => subsets[i])
      .reduce(
        (acc: Subsets, curr: Subset) => ({ ...acc, [curr.id]: curr }),
        {},
      );

    const secondAggs = aggregateIntersections(
      relevantSubsets,
      aggregateBy,
      overlapDegree,
      sets,
      items,
      attributeColumns,
      2,
    );

    objectForEach(secondAggs, (secondAgg) => {
      if (secondLevelAggregates[secondAgg.id])
        throw new Error(
          'Duplicate aggregate. Please check second aggregation method.',
        );
      secondLevelAggregates[secondAgg.id] = secondAgg;
    });

    aggregate.items = Object.keys(secondAggs);
    firstLevelAggregates[aggregate.id] = aggregate;
  });

  return { firstLevelAggregates, secondLevelAggregates };
}
