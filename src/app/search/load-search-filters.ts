import advancedFilters from './search-filters/advanced';
import dupeFilters from './search-filters/dupes';
import simpleRangeFilters from './search-filters/range';
import overloadedRangeFilters from './search-filters/range-overload';
import ratingsFilters from './search-filters/ratings';
import socketFilters from './search-filters/sockets';
import { t } from 'app/i18next-t';
import { FilterDefinition } from './filter-types';
import { DimItem } from 'app/inventory/item-types';

export function returnFalse() {
  return false;
}
// eslint-disable-next-line @typescript-eslint/no-empty-function
export function doNothing() {}

const falseFilter: FilterDefinition = {
  keywords: 'false',
  hint: '',
  description: '',
  format: 'attribute',
  destinyVersion: 0,
  filterFunction: () => false,
};

const currentDestinyVersion = 2;

// const allFilters = [
//   advancedFilters,
//   dupeFilters,
//   simpleRangeFilters,
//   overloadedRangeFilters,
//   ratingsFilters,
//   socketFilters,
// ];
// const applicableFilters = allFilters.flatMap(fg=>fg.filter(f=>f.destinyVersion===0||f.destinyVersion===currentDestinyVersion));
// clear the exported arrays, wiping out any filters that didn't make it into applicableFilters
// i can't actually do this but i wish i could
// allFilters.forEach(fg=>fg.length=0);

const allFiltersByKeyword: Record<string, FilterDefinition> = {};
[
  advancedFilters,
  dupeFilters,
  simpleRangeFilters,
  overloadedRangeFilters,
  ratingsFilters,
  socketFilters,
]
  .flatMap((fg) =>
    fg.filter((f) => f.destinyVersion === 0 || f.destinyVersion === currentDestinyVersion)
  )
  .forEach((f) => {
    ((t(f.keywords) as unknown) as string[]).forEach((k) => {
      allFiltersByKeyword[k] = f;
    });
  });

// runs once per search. returns a function which is run against each DimItem
// and outputs bool-ish if the item meets the filter
function prepFilter(allItems: DimItem[], keyword: string, filterValue?: string) {
  const filter = allFiltersByKeyword[keyword] ?? falseFilter;
  const contextGenerator = filter.contextGenerator ?? doNothing;
  contextGenerator(allItems);

  if (filter.filterValuePreprocessor) {
    const preprocessed = filter.filterValuePreprocessor(filterValue);
    if (typeof preprocessed === 'function' && !filter.filterFunction) {
      return preprocessed;
    }
    return (item) => filter.filterFunction(item, preprocessed);
  }
  return (item) => filter.filterFunction(item, filterValue);
}
