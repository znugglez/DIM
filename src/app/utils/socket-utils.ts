import { DestinyInventoryItemDefinition, DestinySocketCategoryStyle } from 'bungie-api-ts/destiny2';
import { DimSocketCategory } from 'app/inventory/item-types';
import { DimSockets, DimSocket } from '../inventory/item-types';
import { DEFAULT_SHADER } from 'app/inventory/store/sockets';
import { emptySocketHashes } from 'app/search/search-filter-values';
import { specialtyModPlugCategoryHashes } from './item-utils';

export function getMasterworkSocketHashes(
  itemSockets: DimSockets,
  style: DestinySocketCategoryStyle
): number[] {
  const masterworkSocketCategory = itemSockets.categories.find(
    (category) => category.category.categoryStyle === style
  );

  return (masterworkSocketCategory && getPlugHashesFromCategory(masterworkSocketCategory)) || [];
}

function getPlugHashesFromCategory(category: DimSocketCategory) {
  return category.sockets
    .map((socket) => socket?.plug?.plugItem?.hash ?? NaN)
    .filter((val) => !isNaN(val));
}

export function getSocketsWithStyle(
  sockets: DimSockets,
  style: DestinySocketCategoryStyle
): DimSocket[] {
  const masterworkSocketHashes = getMasterworkSocketHashes(sockets, style);
  return sockets.sockets.filter(
    (socket) => socket.plug && masterworkSocketHashes.includes(socket.plug.plugItem.hash)
  );
}

export function getSocketsWithPlugCategoryHash(sockets: DimSockets, categoryHash: number) {
  return sockets.sockets.filter((socket) =>
    socket?.plug?.plugItem?.itemCategoryHashes?.includes(categoryHash)
  );
}

export const Armor2ModPlugCategories = {
  general: 2487827355,
  helmet: 2912171003,
  gauntlets: 3422420680,
  chest: 1526202480,
  leg: 2111701510,
  classitem: 912441879,
} as const;
const armor2PlugCategoryHashes: number[] = Object.values(Armor2ModPlugCategories);

/** feed a **mod** definition into this */
export function isArmor2Mod(item: DestinyInventoryItemDefinition): boolean {
  return (
    armor2PlugCategoryHashes.includes(item.plug.plugCategoryHash) ||
    specialtyModPlugCategoryHashes.includes(item.plug.plugCategoryHash)
  );
}

/** guns were never revamped so this covers y1 and y2 armor, and y2+ guns */
export function isY2ModSocket(socket: DimSocket) {
  return emptySocketHashes.includes(socket.socketDefinition.singleInitialItemHash);
}

/**
 * whether a socket is a mod socket in Y3 armor (armor 2.0).
 * i.e. those grey things. not perks, not reusables, not shaders.
 * uses a set list of known sockets, which is not ideal
 */
export function isY3ArmorModSocket(socket: DimSocket) {
  return socket.plug && isArmor2Mod(socket.plug.plugItem);
}

/** whether a socket is a mod socket. i.e. those grey things. not perks, not reusables, not shaders */
export function isModSocket(socket: DimSocket) {
  return isY3ArmorModSocket(socket) || isY2ModSocket(socket);
}

/** isModSocket and contains its default plug */
export function isEmptyModSocket(socket: DimSocket) {
  return (
    isModSocket(socket) &&
    socket.socketDefinition.singleInitialItemHash === socket.plug?.plugItem.hash
  );
}

/** isModSocket and contains something other than its default plug */
export function isUsedModSocket(socket: DimSocket) {
  return (
    isModSocket(socket) &&
    socket.socketDefinition.singleInitialItemHash !== socket.plug?.plugItem.hash
  );
}

/** whether a socket is a shader socket */
export function isShaderSocket(socket: DimSocket) {
  return socket.plug?.plugItem.plug.plugCategoryHash === 2973005342;
}

/** whether a socket is a shader socket and has something that isn't the "no shader" shader */
export function isUsedShaderSocket(socket: DimSocket) {
  return isShaderSocket(socket) && socket.plug!.plugItem.hash !== DEFAULT_SHADER;
}
