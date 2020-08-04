import { DimItem, D2Item } from 'app/inventory/item-types';
import _ from 'lodash';
import { D2SeasonInfo } from 'data/d2/d2-season-info';
import { FilterDefinition } from '../filter-types';

const rangeStringRegex = /^[<=>]{0,2}$/;

export function rangeStringToComparator(rangeString: string) {
  const matchedRangeString = rangeString.match(rangeStringRegex);
  if (!matchedRangeString) {
    return _.stubFalse;
  }

  const [, operator, comparisonValueString] = matchedRangeString;
  const comparisonValue = parseFloat(comparisonValueString);

  switch (operator) {
    case 'none':
    case '=':
      return (compare: number) => compare === comparisonValue;
    case '<':
      return (compare: number) => compare < comparisonValue;
    case '<=':
      return (compare: number) => compare <= comparisonValue;
    case '>':
      return (compare: number) => compare > comparisonValue;
    case '>=':
      return (compare: number) => compare >= comparisonValue;
  }
  return _.stubFalse;
}

const simpleRangeFilters: FilterDefinition[] = [
  {
    keywords: 'stack',
    hint: 'consumables stack size',
    description: 'filter by consumables stack size',
    format: 'range',
    destinyVersion: 0,
    filterValuePreprocessor: rangeStringToComparator,
    filterFunction: (item: DimItem, filterValue: (compare: number) => boolean) =>
      filterValue(item.amount),
  },
  {
    keywords: 'light',
    hint: "item's light level",
    description: "filter by item's light level",
    format: 'range',
    destinyVersion: 0,
    filterValuePreprocessor: rangeStringToComparator,
    filterFunction: (item: DimItem, filterValue: (compare: number) => boolean) =>
      item.primStat && filterValue(item.primStat.value),
  },
  {
    keywords: 'year',
    hint: "item's year",
    description: "filter by item's year",
    format: 'range',
    destinyVersion: 0,
    filterValuePreprocessor: rangeStringToComparator,
    filterFunction: (item: DimItem, filterValue: (compare: number) => boolean) => {
      if (item.isDestiny1()) {
        return filterValue(item.year);
      } else if (item.isDestiny2()) {
        return filterValue(D2SeasonInfo[item.season]?.year ?? 0);
      }
    },
  },
  {
    keywords: 'level',
    hint: "item's required equip level",
    description: "filter by item's required equip level",
    format: 'range',
    destinyVersion: 0,
    filterValuePreprocessor: rangeStringToComparator,
    filterFunction: (item: DimItem, filterValue: (compare: number) => boolean) =>
      filterValue(item.equipRequiredLevel),
  },
  {
    keywords: 'powerlimit',
    hint: "item's power limit",
    description: "filter by item's power limit",
    format: 'range',
    destinyVersion: 2,
    filterValuePreprocessor: rangeStringToComparator,
    filterFunction: (item: D2Item, filterValue: (compare: number) => boolean) =>
      // anything with no powerCap has no known limit, so treat it like it's 99999999
      filterValue(item.powerCap ?? 99999999),
  },
];

export default simpleRangeFilters;
