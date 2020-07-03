import { DimItem } from 'app/inventory/item-types';
import { D2ManifestDefinitions } from 'app/destiny2/d2-definitions';

// a filter can return various bool-ish values
type ValidFilterOutput = boolean | null | undefined;

type PreprocessorFilterPair<T extends preprocessedValues> =
  | // filterValuePreprocessor doesn't exist
  // and filterFunction is provided filterValue and run once per item
  {
      filterValuePreprocessor?: undefined;
      filterFunction: (item: DimItem, filterValue?: string) => ValidFilterOutput;
    }
  // filterValuePreprocessor returns type T once per *search*,
  // then type T is used (as arg 2) inside filterFunction once per item
  | {
      filterValuePreprocessor: (filterValue: string) => T;
      filterFunction: (item: DimItem, filterTester: T) => ValidFilterOutput;
    }
  // filterValuePreprocessor returns a function that accepts an item,
  // and that function is used AS the filterFunction once per item
  | {
      filterValuePreprocessor: (filterValue: string) => (item: DimItem) => ValidFilterOutput;
      filterFunction?: undefined;
    };

type preprocessedValues = string | RegExp | ((a: number) => boolean);
type PreprocessorFilterPairs = PreprocessorFilterPair<preprocessedValues>;

// the main event
export type FilterDefinition = {
  /** i18n key pointing to array of localized keywords, which trigger the filter when typed into search bar */
  keywords: string;
  /** i18n key pointing to a very brief description to show alongside filter suggestions */
  hint: string;
  /** i18n key pointing to a full description to show in filter help */
  description: string;
  /**
   * not sure if we want this. it would be used to generically make suggestions if suggestionsGenerator is missing.
   *
   * simple - an 'is/not' filter. the filter itself knows everything it's looking for
   *
   * query - a starting stem and a pre-known value, like "tag:keep". a filterValue will be involved and will match a string we expect
   *
   * freeform - a starting stem and a freeform value. the filterValue will be some arbitrary string we test against other strings
   *
   * range - a starting stem and a mathlike string afterward like <=5
   *
   * rangeoverload - a starting stem like "masterwork" and then either a mathlike string or a word
   */
  format: 'simple' | 'query' | 'freeform' | 'range' | 'rangeoverload';
  /** destinyVersion - 1 or 2, or if a filter applies to both, 0 */
  destinyVersion: 0 | 1 | 2;
  /** a rich element to show in fancy search bar, instead of just letters */
  breadcrumb?: (filterValue?: string) => JSX.Element;
  /** given the manifest, prep a set of suggestion based on, idk, perk names for instance? */
  suggestionsGenerator?: (defs: D2ManifestDefinitions) => string[];
  /** is provided a list of all items. calculates some kind of stats before running the search */
  contextGenerator?: (allItems: DimItem[], filterValue?: string) => void;
} & PreprocessorFilterPairs;

/*
this may be overkill. let's skip it for now in favor of saying filter functions should accept DimItem

type DimItemVersion = DimItem | D1Item | D2Item;

type PreprocessorFilterPair<D extends DimItemVersion, T> =
  // filterValuePreprocessor doesn't exist
  // and filterFunction is provided filterValue and run once per item
  | {
      filterValuePreprocessor?: undefined;
      filterFunction: (item: D, filterValue?: string) => ValidFilterOutput;
    }
  // filterValuePreprocessor returns type T once per *search*,
  // then type T is used (as arg 2) inside filterFunction once per item
  | {
      filterValuePreprocessor: (filterValue: string) => T;
      filterFunction: (item: D, filterTester: T) => ValidFilterOutput;
    }
  // filterValuePreprocessor returns a function that accepts an item,
  // and that function is used AS the filterFunction once per item
  | {
      filterValuePreprocessor: (filterValue: string) => (item: D) => ValidFilterOutput;
      filterFunction?: undefined;
    };

// some acceptable types for filterValuePreprocessor to return
type PreprocessorFilterPairVersion<D extends DimItemVersion> =
  | PreprocessorFilterPair<D, string>
  | PreprocessorFilterPair<D, RegExp>
  | PreprocessorFilterPair<D, (a: number) => boolean>;


// this union !helps! ensure that
// destinyVersion and contextGenerator and filterValuePreprocessor and filterFunction
// have the same matching destiny types
type VersionUnion =
  // destinyVersion - 1 or 2, or if a filter applies to both, 0
  // contextGenerator - first calculates stats based on all owned items.
  //    i.e. which items have dupes, or what your highest total chest armor is
  | ({
      destinyVersion: 0;
      contextGenerator?: (allItems: DimItem[], filterValue?: string) => void;
    } & PreprocessorFilterPairVersion<DimItem>)
  | ({
      destinyVersion: 1;
      contextGenerator?: (allItems: D1Item[], filterValue?: string) => void;
    } & PreprocessorFilterPairVersion<D1Item>)
  | ({
      destinyVersion: 2;
      contextGenerator?: (allItems: D2Item[], filterValue?: string) => void;
    } & PreprocessorFilterPairVersion<D2Item>);
*/
