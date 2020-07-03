import { DimItem } from 'app/inventory/item-types';
import _ from 'lodash';
import { getRating, ReviewsState, shouldShowRating } from 'app/item-review/reducer';
import { rangeStringToComparator } from './range-numeric';
import { FilterDefinition } from '../filter-types';

const ratings = {} as ReviewsState['ratings'];

const ratingsFilters: FilterDefinition[] = [
  {
    keywords: 'rating',
    hint: "item's rating",
    description: "filter by item's rating",
    format: 'range',
    destinyVersion: 0,
    filterValuePreprocessor: rangeStringToComparator,
    filterFunction: (item: DimItem, filterValue: (compare: number) => boolean) => {
      if (!$featureFlags.reviewsEnabled) return false;
      const dtrRating = getRating(item, ratings);
      const showRating = dtrRating && shouldShowRating(dtrRating) && dtrRating.overallScore;
      return (
        Boolean(showRating) &&
        dtrRating?.overallScore !== undefined &&
        filterValue(dtrRating?.overallScore)
      );
    },
  },
  {
    keywords: 'ratingcount',
    hint: "item's rating count",
    description: "filter by item's rating count",
    format: 'range',
    destinyVersion: 0,
    filterValuePreprocessor: rangeStringToComparator,
    filterFunction: (item: DimItem, filterValue: (compare: number) => boolean) => {
      if (!$featureFlags.reviewsEnabled) return false;
      const dtrRating = getRating(item, ratings);
      return dtrRating?.ratingCount !== undefined && filterValue(dtrRating?.overallScore);
    },
  },
  {
    keywords: 'hasRating',
    hint: 'item has rating',
    description: 'filter by item having rating count',
    format: 'simple',
    destinyVersion: 0,
    filterFunction: (item: DimItem) => {
      if (!$featureFlags.reviewsEnabled) return false;
      const dtrRating = getRating(item, ratings);
      return dtrRating?.overallScore !== undefined;
    },
  },
];

export default ratingsFilters;
