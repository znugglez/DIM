import { DimItem, D1Item, D2Item } from 'app/inventory/item-types';
import { D2ManifestDefinitions } from 'app/destiny2/d2-definitions';

type DimItemVersion = DimItem | D1Item | D2Item;

// a filter can return various bool-ish values
type ValidFilterOutput = boolean | null | undefined;

type PreprocessorFilterPair<D extends DimItemVersion, T> =
  // filterValuePreprocessor doesn't exist,
  // filterFunction is provided filterValue and run once per item
  | {
      filterFunction: (item: D, filterValue: string) => ValidFilterOutput;
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

// this union !helps! ensure that
// destinyVersion and contextGenerator and filterValuePreprocessor and filterFunction
// have the same matching destiny types
type VersionUnion =
  // destinyVersion - 1 or 2, or if a filter applies to both, 0
  // contextGenerator - first calculates stats based on all owned items.
  //    i.e. which items have dupes, or what your highest total chest armor is
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
  // i18n key pointing to array of localized keywords, which trigger the filter when typed into search bar
  keywords: string;
  // i18n key pointing to a very brief description to show alongside filter suggestions
  hint: string;
  // i18n key pointing to a full description to show in filter help
  description: string;
  // not sure if we want this. it would be used to generically make suggestions if suggestionsGenerator is missing
  format: 'freeform' | 'range' | 'attribute';
  // a rich element to show in fancy search bar, instead of just letters
  breadcrumb?: (filterValue?: string) => JSX.Element;
  // given the manifest, prep a set of suggestion based on, idk, perk names for instance?
  suggestionsGenerator?: (defs: D2ManifestDefinitions) => string[];
} & VersionUnion;

// const exampleD1Filter: FilterDefinition = {
//   keywords: 'asdf',
//   hint: 'asdf',
//   description: 'asdf',
//   format: 'attribute',
//   destinyVersion: 0,
//   filterValuePreprocessor: () => 'asdf',
//   filterFunction: (item: D1Item, filterValue: string) => item.name === filterValue,
// };
