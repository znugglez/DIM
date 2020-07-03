import advancedFilters from './search-filters/advanced';
import dupeFilters from './search-filters/dupes';
import simpleRangeFilters from './search-filters/range-numeric';
import overloadedRangeFilters from './search-filters/range-overload';
import ratingsFilters from './search-filters/ratings';
import socketFilters from './search-filters/sockets';
import { t } from 'app/i18next-t';
import { FilterDefinition } from './filter-types';
import { DimItem } from 'app/inventory/item-types';
import { returnFalse, doNothing } from 'app/utils/empty';

/** a placeholder filter which always returns false */
const falseFilter: FilterDefinition = {
  keywords: 'false',
  hint: '',
  description: '',
  format: 'attribute',
  destinyVersion: 0,
  filterFunction: returnFalse,
};

// obviously we don't really do this
const currentDestinyVersion = 2;

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
export function prepareFilter(allItems: DimItem[], keyword: string, filterValue: string) {
  const filter = allFiltersByKeyword[keyword] ?? falseFilter;

  // run the contextGenerator against all items if it exists. this prepares things like "maxpower" or "dupe"
  (filter.contextGenerator ?? doNothing)(allItems);

  if (filter.filterValuePreprocessor) {
    // if there is a filterValuePreprocessor, there will be a filterValue
    const preprocessedfilterValue = filter.filterValuePreprocessor(filterValue);

    // if filterValuePreprocessor returns a function, that's all we need
    if (typeof preprocessedfilterValue === 'function') {
      return preprocessedfilterValue;
    }

    // if it returns any other type, feed that into filterFunction
    return (item: DimItem) => filter.filterFunction?.(item, preprocessedfilterValue);
  }
  // if there was no preprocessor, the raw filterValue string goes into the filter function alongside each item
  return (item: DimItem) => filter.filterFunction?.(item, filterValue);
}
