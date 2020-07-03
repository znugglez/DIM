import { DimItem, D2Item } from 'app/inventory/item-types';
import { FilterDefinition } from '../filter-types';
import { getItemDamageShortName } from 'app/utils/item-utils';
import * as D2Values from '../d2-known-values';
import { DestinyAmmunitionType } from 'bungie-api-ts/destiny2';
import { cosmeticTypes, lightStats } from '../search-filter-values';
import { D2EventPredicateLookup } from 'data/d2/d2-event-info';
import D2Sources from 'data/d2/source-info';
import missingSources from 'data/d2/missing-source-info';

const tierMap = {
  white: 'common',
  green: 'uncommon',
  blue: 'rare',
  purple: 'legendary',
  yellow: 'exotic',
};
const d2AmmoTypes = {
  primary: DestinyAmmunitionType.Primary,
  special: DestinyAmmunitionType.Special,
  heavy: DestinyAmmunitionType.Heavy,
};
const classes = ['titan', 'hunter', 'warlock'];

// filters relying on curated known values
const knownValuesFilters: FilterDefinition[] = [
  {
    keywords: 'tier',
    hint: 'tier',
    description: 'tier',
    format: 'attribute',
    destinyVersion: 0,
    filterFunction: (item: DimItem, filterValue: string) =>
      item.tier.toLowerCase() === (tierMap[filterValue] || filterValue),
  },
  {
    keywords: 'ammotype',
    hint: 'ammotype',
    description: 'ammotype',
    format: 'attribute',
    destinyVersion: 2,
    filterFunction: (item: D2Item, filterValue: string) =>
      item.ammoType === d2AmmoTypes[filterValue],
  },
  {
    keywords: 'classtype',
    hint: 'classtype',
    description: 'classtype',
    format: 'attribute',
    destinyVersion: 0,
    filterFunction: (item: DimItem, filterValue: string) =>
      !item.classified && item.classType === classes.indexOf(filterValue),
  },
  {
    keywords: 'cosmetic',
    hint: 'cosmetic',
    description: 'cosmetic',
    format: 'attribute',
    destinyVersion: 0,
    filterFunction: (item: DimItem) => cosmeticTypes.includes(item.type),
  },
  {
    keywords: 'haslight',
    hint: 'haslight',
    description: 'haslight',
    format: 'attribute',
    destinyVersion: 0,
    filterFunction: (item: DimItem) => item.primStat && lightStats.includes(item.primStat.statHash),
  },

  {
    keywords: 'breaker',
    hint: 'breaker',
    description: 'breaker',
    format: 'attribute',
    destinyVersion: 2,
    filterFunction: (item: D2Item, filterValue: string) =>
      item.breakerType && D2Values.breakerTypes[filterValue] === item.breakerType.hash,
  },
  {
    keywords: 'dmg',
    hint: 'dmg',
    description: 'dmg',
    format: 'attribute',
    destinyVersion: 0,
    filterFunction: (item: DimItem, filterValue: string) =>
      getItemDamageShortName(item) === filterValue,
  },
  {
    keywords: 'source',
    hint: 'source',
    description: 'source',
    format: 'attribute',
    destinyVersion: 2,
    filterFunction: (item: D2Item, filterValue: string) => {
      if (!item && (!D2Sources[filterValue] || !D2EventPredicateLookup[filterValue])) {
        return false;
      }
      if (D2Sources[filterValue]) {
        return (
          (item.source && D2Sources[filterValue].sourceHashes.includes(item.source)) ||
          D2Sources[filterValue].itemHashes.includes(item.hash) ||
          missingSources[filterValue]?.includes(item.hash)
        );
      } else if (D2EventPredicateLookup[filterValue]) {
        return D2EventPredicateLookup[filterValue] === item?.event;
      }
      return false;
    },
  },
];

export default knownValuesFilters;
