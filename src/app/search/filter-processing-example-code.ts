import advancedFilters from './search-filters/advanced';
import dupeFilters from './search-filters/dupes';
import simpleRangeFilters from './search-filters/range-numeric';
import overloadedRangeFilters from './search-filters/range-overload';
import ratingsFilters from './search-filters/ratings';
import socketFilters from './search-filters/sockets';
import { FilterDefinition } from './filter-types';
import { DimItem } from 'app/inventory/item-types';
import { returnFalse, doNothing } from 'app/utils/empty';
import { D2ManifestDefinitions } from 'app/destiny2/d2-definitions';

/** a fake t that returns string[] */
function t(_key: string): string[] {
  return [];
}

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
    .flatMap((filterGroup) =>
      filterGroup.filter(
        (filter) => filter.destinyVersion === 0 || filter.destinyVersion === currentDestinyVersion
      )
    )
    .forEach((f) => {
      t(f.keywords).forEach((k) => {
        allFiltersByKeyword[k] = f;
      });
    });
}

function expandStringCombinations(stringGroups: string[][]) {
  let results = [''];
  stringGroups.forEach((stringGroup) => {
    results = results.flatMap((stem) => stringGroup.map((suffix) => `${stem}:${suffix}`));
  });
  return results;
}

const operators = ['<', '>', '<=', '>=', '='];

export function generateSuggestionsForFilter(
  defs: D2ManifestDefinitions,
  filterDefinition: FilterDefinition
) {
  const suggestions = filterDefinition.suggestionsGenerator;
  if (typeof suggestions == 'function') {
    return suggestions(defs);
  } else {
    const thisFilterKeywords = t(filterDefinition.keywords);
    const nestedSuggestions = (suggestions === undefined
      ? []
      : typeof suggestions[0] === 'string'
      ? [suggestions]
      : suggestions) as string[][];

    switch (filterDefinition.format) {
      case 'simple':
        return expandStringCombinations([['is', 'not']]);
      case 'query':
        return expandStringCombinations([thisFilterKeywords, ...nestedSuggestions]);
      case 'freeform':
        return expandStringCombinations([thisFilterKeywords, ['']]);
      case 'range':
        return expandStringCombinations([thisFilterKeywords, ...nestedSuggestions, operators]);
      case 'rangeoverload':
        return expandStringCombinations([thisFilterKeywords, ...nestedSuggestions, operators]);
      default:
        return [];
    }
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
