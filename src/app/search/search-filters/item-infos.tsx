import { DimItem } from 'app/inventory/item-types';
import { FilterDefinition } from '../filter-types';
import { getTag, getNotes, ItemInfos } from 'app/inventory/dim-item-info';

const itemInfos: ItemInfos = {};

// simple checks against check an attribute found on DimItem
const simpleFilters: FilterDefinition[] = [
  {
    keywords: 'tagged',
    hint: 'tagged',
    description: 'tagged',
    format: 'attribute',
    destinyVersion: 0,
    filterFunction: (item: DimItem) => Boolean(getTag(item, itemInfos)),
  },
  {
    keywords: 'tag',
    hint: 'tag',
    description: 'tag',
    format: 'attribute',
    destinyVersion: 0,
    filterFunction: (item: DimItem, filterValue: string) =>
      (getTag(item, itemInfos) || 'none') === filterValue,
  },
  {
    keywords: 'hasnotes',
    hint: 'hasnotes',
    description: 'hasnotes',
    format: 'attribute',
    destinyVersion: 0,
    filterFunction: (item: DimItem) => Boolean(getNotes(item, itemInfos)),
  },
];

export default simpleFilters;
