import { D2Item } from 'app/inventory/item-types';
import _ from 'lodash';
import * as hashes from '../search-filter-values';
import { FilterDefinition } from '../filter-types';
import { rangeStringToComparator } from './range-numeric';

const overloadedRangeFilters: FilterDefinition[] = [
  {
    keywords: 'masterwork',
    hint: "item's masterwork level",
    description: "filter by item's masterwork level",
    format: 'range',
    destinyVersion: 0,
    filterValuePreprocessor: rangeStringToComparator,
    filterFunction: (item: D2Item, filterValue: (compare: number) => boolean) =>
      item.masterworkInfo &&
      (Boolean(hashes.statHashByName) || filterValue(item.primStat?.value ?? 0)),
  },
];

export default overloadedRangeFilters;

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
