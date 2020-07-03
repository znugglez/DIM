import { DimItem, D2Item } from 'app/inventory/item-types';
import _ from 'lodash';
// import * as hashes from '../search-filter-values';
import { D2SeasonInfo } from 'data/d2/d2-season-info';
import { getItemPowerCapFinalSeason } from 'app/utils/item-utils';
import { FilterDefinition } from '../filter-types';
import { returnFalse } from '../load-search-filters';

/** strings representing math checks */
// const operators = ['<', '>', '<=', '>=', '='];
// const operatorsInLengthOrder = _.sortBy(operators, (s) => -s.length);
const rangeStringRegex = /^[<=>]{0,2}$/;

export function rangeStringToComparator(rangeString: string) {
  const matchedRangeString = rangeString.match(rangeStringRegex);
  if (!matchedRangeString) return returnFalse;

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
  return returnFalse;
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
    keywords: 'season',
    hint: "item's season",
    description: "filter by item's season of origin",
    format: 'range',
    destinyVersion: 2,
    filterValuePreprocessor: rangeStringToComparator,
    filterFunction: (item: D2Item, filterValue: (compare: number) => boolean) =>
      filterValue(item.season),
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
  {
    keywords: 'sunsetsafter',
    hint: "item's power limit",
    description: "filter by item's power limit",
    format: 'range',
    destinyVersion: 2,
    filterValuePreprocessor: rangeStringToComparator,
    filterFunction: (item: D2Item, filterValue: (compare: number) => boolean) => {
      const itemFinalSeason = getItemPowerCapFinalSeason(item);
      return filterValue(itemFinalSeason ?? 0);
    },
  },

  // {
  //   keywords: 'masterwork',
  //   hint: 'item\'s masterwork level',
  //   description: 'filter by item\'s masterwork level',
  //   format: 'range',
  //   destiny1: true,
  //   destiny2: true,
  //   filterValuePreprocessor: rangeStringToComparator,
  //   filterFunction: (item: D2Item, filterValue: (compare: number) => boolean) => {
  //     return item.masterworkInfo && (
  //       hashes.statHashByName[filterValue]
  //       ||
  //       filterValue(item.primStat.value));
  //   },
  // },
];

export default simpleRangeFilters;

// masterwork(item: D2Item, filterValue: string) {
//   if (!item.masterworkInfo) {
//     return false;
//   }
//   if (mathCheck.test(filterValue)) {
//     return compareByOperator(
//       item.masterworkInfo.tier && item.masterworkInfo.tier < 11
//         ? item.masterworkInfo.tier
//         : 10,
//       filterValue
//     );
//   }
//   return (
//     hashes.statHashByName[filterValue] && // make sure it exists or undefined can match undefined
//     hashes.statHashByName[filterValue] === item.masterworkInfo.statHash
//   );
// },

// energycapacity(item: D2Item, filterValue: string) {
//   if (item.energy) {
//     return (
//       (mathCheck.test(filterValue) &&
//         compareByOperator(item.energy.energyCapacity, filterValue)) ||
//       filterValue === hashes.D2Values.energyNamesByEnum[item.energy.energyType]
//     );
//   }
// },

/**
 * given a stat name, this returns a function for comparing that stat
 */
// const filterByStats = (statType: string, byBaseValue = false) => {
//   const byWhichValue = byBaseValue ? 'base' : 'value';
//   const statHashes: number[] =
//     statType === 'any' ? hashes.anyArmorStatHashes : [hashes.statHashByName[statType]];
//   return (item: DimItem, filterValue: string) => {
//     const matchingStats = item.stats?.filter(
//       (s) => statHashes.includes(s.statHash) && compareByOperator(s[byWhichValue], filterValue)
//     );
//     return matchingStats && Boolean(matchingStats.length);
//   };
// };
