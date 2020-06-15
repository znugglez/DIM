import { FilterDefinition, startWordRegexp } from '../search-filter';
import { DimItem } from 'app/inventory/item-types';
import _ from 'lodash';

/** strings representing math checks */
// const operators = ['<', '>', '<=', '>=', '='];
// const operatorsInLengthOrder = _.sortBy(operators, (s) => -s.length);

const rangeStringRegex = /^[<=>]{0,2}$/;

function rangeStringToComparator(rangeString: string) {
  const matchedRangeString = rangeString.match(rangeStringRegex);
  if (!matchedRangeString) {
    return () => false;
  }
  const [, operator, comparisonValueString] = matchedRangeString;
  const comparisonValue = parseFloat(comparisonValueString);

  switch (operator) {
    case 'none':
    case '=':
      return (compare: number) => compare === comparisonValue;
    case '<':
      return (compare: number) => compare < comparisonValue;
    case '<=':
      return (compare: number) => compare <= comparisonValue;
    case '>':
      return (compare: number) => compare > comparisonValue;
    case '>=':
      return (compare: number) => compare >= comparisonValue;
  }
  return () => false;
}

const rangeFilters: FilterDefinition[] = [
  {
    keywords: 'perk',
    hint: 'perk free-text search (any part)',
    description: 'find an item by perk',
    format: 'freeform',
    destiny1: true,
    destiny2: true,
    filterValuePreprocessor: (filterValue: string) => rangeStringToComparator(filterValue),
    filterFunction: (item: DimItem, filterValue: (compare: number) => boolean) => {
      return true;
    },
  },
];

export default rangeFilters;
