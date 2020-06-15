import { FilterDefinition, startWordRegexp } from '../search-filter';
import { DimItem } from 'app/inventory/item-types';

/**
 * feed in an object with a `name` and a `description` property,
 * to get an array of just those strings
 */
function getStringsFromDisplayProperties<T extends { name: string; description: string }>(
  displayProperties?: T,
  includeDescription = true
) {
  if (!displayProperties) return [];
  return [displayProperties.name, includeDescription && displayProperties.description].filter(
    Boolean
  ) as string[];
}

/**
 * feed in an object or objects with a `name` and a `description` property,
 * to get an array of just those strings
 */
function getStringsFromDisplayPropertiesMap<T extends { name: string; description: string }>(
  displayProperties?: T | T[],
  includeDescription = true
) {
  if (!displayProperties) return [];
  if (!Array.isArray(displayProperties)) displayProperties = [displayProperties];
  return displayProperties
    .map((d) => getStringsFromDisplayProperties(d, includeDescription))
    .flat();
}

const socketFilters: FilterDefinition[] = [
  {
    keywords: 'perk',
    hint: 'perk free-text search (any part)',
    description: 'find an item by perk',
    format: 'freeform',
    destiny1: true,
    destiny2: true,
    filterValuePreprocessor: (filterValue: string) => startWordRegexp(filterValue),
    filterFunction: (item: DimItem, filterValue: RegExp) => {
      const socketStrings =
        (item.isDestiny2() &&
          item.sockets &&
          item.sockets.sockets
            .map((socket) => {
              const plugAndPerkDisplay = socket.plugOptions.map((plug) => [
                plug.plugItem.displayProperties,
                plug.perks.map((perk) => perk.displayProperties),
              ]);
              return getStringsFromDisplayPropertiesMap(plugAndPerkDisplay.flat(2));
            })
            .flat()) ||
        [];
      const strings = [
        ...getStringsFromDisplayPropertiesMap(item.talentGrid?.nodes),
        ...socketStrings,
      ];
      return strings.some((s) => filterValue.test(s));
    },
  },
  {
    keywords: 'perkname',
    hint: 'perk free-text search (by name)',
    description: 'find an item by perkname',
    format: 'freeform',
    destiny1: true,
    destiny2: true,
    filterValuePreprocessor: (filterValue: string) => startWordRegexp(filterValue),
    filterFunction: (item: DimItem, filterValue: RegExp) => {
      const socketStrings =
        (item.isDestiny2() &&
          item.sockets &&
          item.sockets.sockets
            .map((socket) => {
              const plugAndPerkDisplay = socket.plugOptions.map((plug) => [
                plug.plugItem.displayProperties,
                plug.perks.map((perk) => perk.displayProperties),
              ]);
              return getStringsFromDisplayPropertiesMap(plugAndPerkDisplay.flat(2));
            })
            .flat()) ||
        [];
      const strings = [
        ...getStringsFromDisplayPropertiesMap(item.talentGrid?.nodes),
        ...socketStrings,
      ];
      return strings.some((s) => filterValue.test(s));
    },
  },
];

export default socketFilters;
