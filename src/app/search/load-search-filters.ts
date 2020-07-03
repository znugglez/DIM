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
  format: 'simple',
  destinyVersion: 0,
  filterFunction: returnFalse,
};

const allFiltersByKeyword: Record<string, FilterDefinition> = {};

export function populateFilters(currentDestinyVersion: 1 | 2) {
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
      // FIX THIS UNKNOWN once array-returning t() is worked out
      ((t(f.keywords) as unknown) as string[]).forEach((k) => {
        allFiltersByKeyword[k] = f;
      });
    });
}

export function generateSuggestionsForFilter(filterDefinition: FilterDefinition) {
  switch (filterDefinition.format) {
    case 'query':
      break;
    case 'simple':
      break;
    case 'freeform':
      break;
    case 'range':
      break;
    case 'rangeoverload':
      break;
  }
}

// runs once per search.
// returns a function to be run against each DimItem.
// that function outputs bool-ish (boolean | null | undefined)
// if the item meets the conditions of that filter
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
