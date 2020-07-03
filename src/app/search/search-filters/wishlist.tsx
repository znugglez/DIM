import { DimItem } from 'app/inventory/item-types';
import _ from 'lodash';
import { FilterDefinition } from '../filter-types';
import { InventoryWishListRoll } from 'app/wishlists/wishlists';
import { makeDupeID } from '../search-filter';
import { _duplicates, initDupes, checkIfIsDupe } from './dupes';

const inventoryWishListRolls: { [key: string]: InventoryWishListRoll } = {};

export const checkIfIsWishlist = (item: DimItem) =>
  inventoryWishListRolls[item.id] && !inventoryWishListRolls[item.id].isUndesirable;

const wishlistFilters: FilterDefinition[] = [
  {
    keywords: 'wishlist',
    hint: 'matches a wishlist entry',
    description: 'matches a wishlist entry',
    format: 'attribute',
    destinyVersion: 0,
    filterFunction: checkIfIsWishlist,
  },
  {
    keywords: 'wishlistdupe',
    hint: 'matches a wishlist entry',
    description: 'matches a wishlist entry',
    format: 'attribute',
    destinyVersion: 0,
    contextGenerator: initDupes,
    filterFunction: (item: DimItem) => {
      if (!checkIfIsDupe(item)) {
        return false;
      }
      const dupeId = makeDupeID(item);
      const itemDupes = _duplicates?.[dupeId];
      return itemDupes?.some(checkIfIsWishlist);
    },
  },
  {
    keywords: 'wishlistnotes',
    hint: 'matches a wishlist entry',
    description: 'matches a wishlist entry',
    format: 'freeform',
    destinyVersion: 0,
    filterFunction: (item: DimItem, filterValue: string) =>
      inventoryWishListRolls[item.id]?.notes?.toLocaleLowerCase().includes(filterValue),
  },
  {
    keywords: 'trashlist',
    hint: 'matches a bad wishlist entry',
    description: 'matches a bad wishlist entry',
    format: 'attribute',
    destinyVersion: 0,
    filterFunction: (item: DimItem) => inventoryWishListRolls[item.id]?.isUndesirable,
  },
];

export default wishlistFilters;
