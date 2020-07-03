import {
  D2ArmorStatHashByName,
  D2WeaponStatHashByName,
  damageNamesByEnum,
  D2LightStats,
} from './d2-known-values';
import { D1LightStats } from './d1-known-values';

// ✨ magic values ✨
// this file has non-programatically decided information
// hashes, names, & enums, hand-crafted and chosen by us

// typescript doesn't understand array.filter
export const damageTypeNames = Object.values(damageNamesByEnum).filter(
  (d) => ![null, 'raid'].includes(d)
) as string[];

/**
 * these stats exist on DIM armor. the 6 originals supplemented by a sum total.
 * these are the armor stats that can be looked up by name
 */
const dimArmorStatHashByName = {
  ...D2ArmorStatHashByName,
  total: -1000,
};

/** stats names used to create armor-specific filters */
export const armorStatNames = [...Object.keys(dimArmorStatHashByName), 'any'];

/** stat hashes to check in armor "any" filters */
export const anyArmorStatHashes = Object.values(D2ArmorStatHashByName);

/** stats to check the max values of */
export const armorStatHashes = Object.values(dimArmorStatHashByName);

/** compare against DimItem.type in EN */
export const cosmeticTypes = [
  'Shader',
  'Shaders',
  'Ornaments',
  'Modifications',
  'Emote',
  'Emotes',
  'Emblem',
  'Emblems',
  'Vehicle',
  'Horn',
  'Ship',
  'Ships',
  'ClanBanners',
  'Finishers',
];

/** all-stat table, for looking up stat hashes, given a stat name */
export const statHashByName = {
  ...D2WeaponStatHashByName,
  ...dimArmorStatHashByName,
};

export const lightStats = [...D2LightStats, ...D1LightStats];

/** all-stat list, to generate filters from */
export const allWeaponArmorStatNames = [...Object.keys(statHashByName), 'any'];
