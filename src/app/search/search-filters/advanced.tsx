import { FilterDefinition } from '../search-filter';
import { DimItem } from 'app/inventory/item-types';

const advancedFilters: FilterDefinition[] = [
  {
    keywords: 'id',
    hint: 'id',
    description: 'find an item by id',
    format: 'freeform',
    destiny1: true,
    destiny2: true,
    filterFunction: (item: DimItem, filterValue: string) => item.id === filterValue,
  },
  {
    keywords: 'hash',
    hint: 'hash',
    description: 'find an item by hash',
    format: 'freeform',
    destiny1: true,
    destiny2: true,
    filterFunction: (item: DimItem, filterValue: string) => item.hash.toString() === filterValue,
  },
];

export default advancedFilters;
