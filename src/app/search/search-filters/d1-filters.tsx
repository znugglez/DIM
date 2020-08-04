import { D1Item } from 'app/inventory/item-types';
import { FilterDefinition } from '../filter-types';
import * as D1Values from '../d1-known-values';
import { rangeStringToComparator } from './range-numeric';

// these just check an attribute found on DimItem
const simpleFilters: FilterDefinition[] = [
  {
    keywords: 'sublime',
    hint: 'sublime',
    description: 'sublime',
    format: 'simple',
    destinyVersion: 1,
    filterFunction: (item: D1Item) => D1Values.sublimeEngrams.includes(item.hash),
  },
  {
    // Upgraded will show items that have enough XP to unlock all
    // their nodes and only need the nodes to be purchased.
    keywords: 'upgraded',
    hint: 'upgraded',
    description: 'upgraded',
    format: 'simple',
    destinyVersion: 1,
    filterFunction: (item: D1Item) => item.talentGrid?.xpComplete && !item.complete,
  },
  {
    // Complete shows items that are fully leveled.
    keywords: 'complete',
    hint: 'complete',
    description: 'complete',
    format: 'simple',
    destinyVersion: 1,
    filterFunction: (item: D1Item) => item.complete,
  },
  {
    // Incomplete will show items that are not fully leveled.
    keywords: 'incomplete',
    hint: 'incomplete',
    description: 'incomplete',
    format: 'simple',
    destinyVersion: 1,
    filterFunction: (item: D1Item) => item.talentGrid && !item.complete,
  },
  {
    keywords: 'xpcomplete',
    hint: 'xpcomplete',
    description: 'xpcomplete',
    format: 'simple',
    destinyVersion: 1,
    filterFunction: (item: D1Item) => item.talentGrid?.xpComplete,
  },
  {
    keywords: 'xpincomplete',
    hint: 'xpincomplete',
    description: 'xpincomplete',
    format: 'simple',
    destinyVersion: 1,
    filterFunction: (item: D1Item) => item.talentGrid && !item.talentGrid.xpComplete,
  },

  {
    keywords: 'ascended',
    hint: 'ascended',
    description: 'ascended',
    format: 'simple',
    destinyVersion: 1,
    filterFunction: (item: D1Item) => item.talentGrid?.hasAscendNode && item.talentGrid.ascended,
  },
  {
    keywords: 'unascended',
    hint: 'unascended',
    description: 'unascended',
    format: 'simple',
    destinyVersion: 1,
    filterFunction: (item: D1Item) => item.talentGrid?.hasAscendNode && !item.talentGrid.ascended,
  },
  {
    keywords: 'tracked',
    hint: 'tracked',
    description: 'tracked',
    format: 'simple',
    destinyVersion: 1,
    filterFunction: (item: D1Item) => item.trackable && item.tracked,
  },
  {
    keywords: 'untracked',
    hint: 'untracked',
    description: 'untracked',
    format: 'simple',
    destinyVersion: 1,
    filterFunction: (item: D1Item) => item.trackable && !item.tracked,
  },
  {
    keywords: 'reforgeable',
    hint: 'reforgeable',
    description: 'reforgeable',
    format: 'simple',
    destinyVersion: 1,
    filterFunction: (item: D1Item) => item.talentGrid?.nodes.some((n) => n.hash === 617082448),
  },
  {
    keywords: 'engram',
    hint: 'engram',
    description: 'engram',
    format: 'simple',
    destinyVersion: 1,
    filterFunction: (item: D1Item) => item.isEngram,
  },
  {
    keywords: 'stattype',
    hint: 'stattype',
    description: 'stattype',
    format: 'simple',
    destinyVersion: 1,
    filterFunction: (item: D1Item, filterValue: string) =>
      item.stats?.some((s) =>
        Boolean(s.displayProperties.name.toLowerCase() === filterValue && s.value > 0)
      ),
  },
  {
    keywords: 'stattype',
    hint: 'stattype',
    description: 'stattype',
    format: 'query',
    destinyVersion: 1,
    filterFunction: (item: D1Item, filterValue: string) => {
      switch (filterValue) {
        case 'glimmerboost':
          return D1Values.boosts.includes(item.hash);
        case 'glimmersupply':
          return D1Values.supplies.includes(item.hash);
        case 'glimmeritem':
          return D1Values.boosts.includes(item.hash) || D1Values.supplies.includes(item.hash);
      }
      return false;
    },
  },
  {
    keywords: 'ornament',
    hint: 'ornament',
    description: 'ornament',
    format: 'query',
    destinyVersion: 1,
    filterFunction: (item: D1Item, filterValue: string) => {
      const complete = item.talentGrid?.nodes.some((n) => n.ornament);
      const missing = item.talentGrid?.nodes.some((n) => !n.ornament);

      if (filterValue === 'ornamentunlocked') {
        return complete;
      } else if (filterValue === 'ornamentmissing') {
        return missing;
      } else {
        return complete || missing;
      }
    },
  },
  {
    keywords: 'quality',
    hint: "item's quality",
    description: "filter by item's quality",
    format: 'range',
    destinyVersion: 1,
    filterValuePreprocessor: rangeStringToComparator,
    filterFunction: (item: D1Item, filterValue: (compare: number) => boolean) => {
      if (!item.quality) {
        return false;
      }
      return filterValue(item.quality.min);
    },
  },
  {
    keywords: 'vendor',
    hint: 'vendor',
    description: 'vendor',
    format: 'query',
    destinyVersion: 1,
    filterFunction: (item: D1Item, filterValue: string) => {
      if (D1Values.vendorHashes.restricted[filterValue]) {
        return (
          D1Values.vendorHashes.required[filterValue].some((vendorHash) =>
            item.sourceHashes.includes(vendorHash)
          ) &&
          !D1Values.vendorHashes.restricted[filterValue].some((vendorHash) =>
            item.sourceHashes.includes(vendorHash)
          )
        );
      } else {
        return D1Values.vendorHashes.required[filterValue].some((vendorHash) =>
          item.sourceHashes.includes(vendorHash)
        );
      }
    },
  },
  {
    keywords: 'activity',
    hint: 'activity',
    description: 'activity',
    format: 'query',
    destinyVersion: 1,
    filterFunction: (item: D1Item, filterValue: string) => {
      if (filterValue === 'vanilla') {
        return item.year === 1;
      } else if (D1Values.D1ActivityHashes.restricted[filterValue]) {
        return (
          D1Values.D1ActivityHashes.required[filterValue].some((sourceHash) =>
            item.sourceHashes.includes(sourceHash)
          ) &&
          !D1Values.D1ActivityHashes.restricted[filterValue].some((sourceHash) =>
            item.sourceHashes.includes(sourceHash)
          )
        );
      } else {
        return D1Values.D1ActivityHashes.required[filterValue].some((sourceHash) =>
          item.sourceHashes.includes(sourceHash)
        );
      }
    },
  },
];

export default simpleFilters;
