import { DimItem, D2Item } from 'app/inventory/item-types';
import { FilterDefinition } from '../filter-types';

const newItems: Set<string> = new Set();

// simple checks against check an attribute found on DimItem
const simpleFilters: FilterDefinition[] = [
  {
    keywords: 'hascapacity',
    hint: 'hascapacity',
    description: 'hascapacity',
    format: 'simple',
    destinyVersion: 2,
    filterFunction: (item: D2Item) => Boolean(item.energy),
  },
  {
    keywords: 'weapon',
    hint: 'weapon',
    description: 'weapon',
    format: 'simple',
    destinyVersion: 0,
    filterFunction: (item: DimItem) =>
      item.bucket?.sort === 'Weapons' &&
      item.bucket.type !== 'SeasonalArtifacts' &&
      item.bucket.type !== 'Class',
  },
  {
    keywords: 'armor',
    hint: 'armor',
    description: 'armor',
    format: 'simple',
    destinyVersion: 0,
    filterFunction: (item: DimItem) => item.bucket?.sort === 'Armor',
  },
  {
    keywords: 'equipment',
    hint: 'equipment',
    description: 'equipment',
    format: 'simple',
    destinyVersion: 0,
    filterFunction: (item: DimItem) => item.equipment,
  },
  {
    keywords: 'postmaster',
    hint: 'postmaster',
    description: 'postmaster',
    format: 'simple',
    destinyVersion: 0,
    filterFunction: (item: DimItem) => item.location?.inPostmaster,
  },
  {
    keywords: 'equipped',
    hint: 'equipped',
    description: 'equipped',
    format: 'simple',
    destinyVersion: 0,
    filterFunction: (item: DimItem) => item.equipped,
  },
  {
    keywords: 'transferable',
    hint: 'transferable',
    description: 'transferable',
    format: 'simple',
    destinyVersion: 0,
    filterFunction: (item: DimItem) => !item.notransfer,
  },
  {
    keywords: 'stackable',
    hint: 'stackable',
    description: 'stackable',
    format: 'simple',
    destinyVersion: 0,
    filterFunction: (item: DimItem) => item.maxStackSize > 1,
  },
  {
    keywords: 'infusable',
    hint: 'infusable',
    description: 'infusable',
    format: 'simple',
    destinyVersion: 0,
    filterFunction: (item: DimItem) => item.infusable,
  },
  {
    keywords: 'locked',
    hint: 'locked',
    description: 'locked',
    format: 'simple',
    destinyVersion: 0,
    filterFunction: (item: DimItem) => item.locked,
  },
  {
    keywords: 'unlocked',
    hint: 'unlocked',
    description: 'unlocked',
    format: 'simple',
    destinyVersion: 0,
    filterFunction: (item: DimItem) => !item.locked,
  },
  {
    keywords: 'masterworked',
    hint: 'masterworked',
    description: 'masterworked',
    format: 'simple',
    destinyVersion: 0,
    filterFunction: (item: DimItem) => item.masterwork,
  },
  {
    keywords: 'new',
    hint: 'new',
    description: 'new',
    format: 'simple',
    destinyVersion: 0,
    filterFunction: (item: DimItem) => newItems.has(item.id),
  },
];

export default simpleFilters;
