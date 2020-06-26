import { DimItem, D1Item, D2Item } from 'app/inventory/item-types';
import { D2ManifestDefinitions } from 'app/destiny2/d2-definitions';

type DimItemVersion = DimItem | D1Item | D2Item;

// a filter can return various bool-ish values
type ValidFilterOutput = boolean | null | undefined;

type PreprocessorFilterPair<D extends DimItemVersion, T> =
  // filterValuePreprocessor doesn't exist,
  // and filterFunction is run once per item
  | {
      filterFunction: (item: D) => ValidFilterOutput;
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
    };

// some acceptable types for filterValuePreprocessor to return
type PreprocessorFilterPairVersion<D extends DimItemVersion> =
  | PreprocessorFilterPair<D, string>
  | PreprocessorFilterPair<D, RegExp>
  | PreprocessorFilterPair<D, (a: number) => boolean>;

// this ensures
// destinyVersion and contextGenerator and filterValuePreprocessor and filterFunction
// all have the same matching destiny types
type VersionUnion =
  | ({
      destinyVersion: 0;
      contextGenerator?: (allItems: DimItem[]) => void;
    } & PreprocessorFilterPairVersion<DimItem>)
  | ({
      destinyVersion: 1;
      contextGenerator?: (allItems: D1Item[]) => void;
    } & PreprocessorFilterPairVersion<D1Item>)
  | ({
      destinyVersion: 2;
      contextGenerator?: (allItems: D2Item[]) => void;
    } & PreprocessorFilterPairVersion<D2Item>);

// the main event
export type FilterDefinition = {
  // localized keywords, which trigger the filter when typed into search bar
  keywords: string; // an i18n key. this will be t()'d
  // a very brief description to show alongside filter suggestions
  hint: string; // an i18n key. this will be t()'d
  // a full description to show in filter help
  description: string; // an i18n key. this will be t()'d
  // not sure if we want this. it would be used to generically make suggestions if suggestionsGenerator is missing
  format: 'freeform' | 'range' | 'attribute';
  // a rich element to show in fancy search bar, instead of just letters
  breadcrumb?: (filterValue?: string) => JSX.Element;
  // given the manifest, prep a set of suggestion based on, idk, perk names for instance?
  suggestionsGenerator?: (defs: D2ManifestDefinitions) => string[];
} & VersionUnion;
