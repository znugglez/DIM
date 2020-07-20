import { DamageType, DestinyEnergyType } from 'bungie-api-ts/destiny2';
import { DimItem, DimMasterwork } from 'app/inventory/item-types';

import modSocketMetadata from 'data/d2/specialty-modslot-metadata';
import powerCapToSeason from 'data/d2/lightcap-to-season.json';
import { objectifyArray } from './util';

// damage is a mess!
// this section supports turning a destiny DamageType or EnergyType into a known english name
// mainly for most css purposes and the filter names
export const damageNamesByEnum: { [key in DamageType]: string | null } = {
  0: null,
  1: 'kinetic',
  2: 'arc',
  3: 'solar',
  4: 'void',
  5: 'raid',
};

export const energyNamesByEnum: { [key in DestinyEnergyType]: string } = {
  [DestinyEnergyType.Any]: 'any',
  [DestinyEnergyType.Arc]: 'arc',
  [DestinyEnergyType.Thermal]: 'solar',
  [DestinyEnergyType.Void]: 'void',
};

export const getItemDamageShortName = (item: DimItem): string | undefined =>
  item.isDestiny2() && item.energy
    ? energyNamesByEnum[item.element?.enumValue ?? -1]
    : damageNamesByEnum[item.element?.enumValue ?? -1];

// these are helpers for identifying SpecialtySockets (seasonal mods).
// i would like this file to be the only one that interfaces with
// data/d2/specialty-modslot-metadata.json
// process its data here and export it to thing that needs it

const modMetadataBySocketTypeHash = objectifyArray(modSocketMetadata, 'socketTypeHash');

const modMetadataByPlugCategoryHash = objectifyArray(modSocketMetadata, 'plugCategoryHashes');

/** i.e. ['outlaw', 'forge', 'opulent', etc] */
export const modSlotTags = modSocketMetadata.map((m) => m.tag);

// kind of silly but we are using a list of known mod hashes to identify specialty mod slots below
export const specialtySocketTypeHashes = modSocketMetadata.map(
  (modMetadata) => modMetadata.socketTypeHash
);

export const specialtyModPlugCategoryHashes = modSocketMetadata
  .map((modMetadata) => modMetadata.compatiblePlugCategoryHashes)
  .flat();

/** verifies an item is d2 armor and has a specialty mod slot, which is returned */
export const getSpecialtySocket = (item: DimItem) => {
  if (item.isDestiny2() && item.bucket.inArmor) {
    return item.sockets?.sockets.find((socket) =>
      specialtySocketTypeHashes.includes(socket.socketDefinition.socketTypeHash)
    );
  }
};

/** returns ModMetadata if the item has a specialty mod slot */
export const getSpecialtySocketMetadata = (item: DimItem) =>
  modMetadataBySocketTypeHash[
    getSpecialtySocket(item)?.socketDefinition.socketTypeHash || -99999999
  ];

/**
 * returns ModMetadata if the plugCategoryHash (from a mod definition's .plug) is known
 *
 * if you use this you can only trust the returned season, tag, and emptyModSocketHash
 */
export const getSpecialtySocketMetadataByPlugCategoryHash = (plugCategoryHash: number) =>
  modMetadataByPlugCategoryHash[plugCategoryHash];

/**
 * this always returns a string for easy printing purposes
 *
 * `''` if not found, so you can let it stay blank or `||` it
 */
export const getItemSpecialtyModSlotDisplayName = (item: DimItem) =>
  getSpecialtySocket(item)?.plug?.plugItem.itemTypeDisplayName || '';

/** given item, get the final season it will be relevant (able to hit max power level) */
export const getItemPowerCapFinalSeason = (item: DimItem): number | undefined =>
  item.isDestiny2() ? powerCapToSeason[item.powerCap ?? -99999999] : undefined;

/** accepts a DimMasterwork or lack thereof, & always returns a string */
export function getMasterworkStatNames(mw: DimMasterwork | null) {
  return (
    mw?.stats
      ?.map((stat) => stat.name)
      .filter(Boolean)
      .join(', ') ?? ''
  );
}
