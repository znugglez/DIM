import { D2Item } from 'app/inventory/item-types';
import { FilterDefinition } from '../filter-types';
import * as D2Values from '../d2-known-values';
import {
  DEFAULT_SHADER,
  DEFAULT_ORNAMENTS,
  DEFAULT_GLOW,
  DEFAULT_GLOW_CATEGORY,
} from 'app/inventory/store/sockets';
import { DestinyItemSubType } from 'bungie-api-ts/destiny2';
import { getSpecialtySocketMetadata } from 'app/utils/item-utils';

const socketFilters: FilterDefinition[] = [
  {
    keywords: 'randomroll',
    hint: 'randomroll',
    description: 'randomroll',
    format: 'attribute',
    destinyVersion: 2,
    filterFunction: (item: D2Item) =>
      Boolean(item.energy) || item.sockets?.sockets.some((s) => s.hasRandomizedPlugItems),
  },
  {
    keywords: 'curated',
    hint: 'curated',
    description: 'curated',
    format: 'attribute',
    destinyVersion: 2,
    filterFunction: (item: D2Item) => {
      if (!item) {
        return false;
      }

      // TODO: remove if there are no false positives, as this precludes maintaining a list for curatedNonMasterwork
      // const masterWork = item.masterworkInfo?.statValue === 10;
      // const curatedNonMasterwork = [792755504, 3356526253, 2034817450].includes(item.hash); // Nightshade, Wishbringer, Distant Relation

      const legendaryWeapon =
        item.bucket?.sort === 'Weapons' && item.tier.toLowerCase() === 'legendary';

      const oneSocketPerPlug = item.sockets?.sockets
        .filter((socket) =>
          D2Values.curatedPlugsAllowList.includes(
            socket?.plug?.plugItem?.plug?.plugCategoryHash || 0
          )
        )
        .every((socket) => socket?.plugOptions.length === 1);

      return (
        legendaryWeapon &&
        // (masterWork || curatedNonMasterwork) && // checks for masterWork(10) or on curatedNonMasterWork list
        oneSocketPerPlug
      );
    },
  },
  {
    keywords: 'hasshader',
    hint: 'hasshader',
    description: 'hasshader',
    format: 'attribute',
    destinyVersion: 2,
    filterFunction: (item: D2Item) =>
      item.sockets?.sockets.some((socket) =>
        Boolean(
          socket.plug?.plugItem.plug &&
            socket.plug.plugItem.plug.plugCategoryHash === D2Values.shaderBucket &&
            socket.plug.plugItem.hash !== DEFAULT_SHADER
        )
      ),
  },
  {
    keywords: 'hasornament',
    hint: 'hasornament',
    description: 'hasornament',
    format: 'attribute',
    destinyVersion: 2,
    filterFunction: (item: D2Item) =>
      item.sockets?.sockets.some((socket) =>
        Boolean(
          socket.plug &&
            socket.plug.plugItem.itemSubType === DestinyItemSubType.Ornament &&
            socket.plug.plugItem.hash !== DEFAULT_GLOW &&
            !DEFAULT_ORNAMENTS.includes(socket.plug.plugItem.hash) &&
            !socket.plug.plugItem.itemCategoryHashes?.includes(DEFAULT_GLOW_CATEGORY)
        )
      ),
  },
  {
    keywords: 'hasmod',
    hint: 'hasmod',
    description: 'hasmod',
    format: 'attribute',
    destinyVersion: 2,
    filterFunction: (item: D2Item) =>
      item.sockets?.sockets.some((socket) =>
        Boolean(
          socket.plug &&
            !D2Values.emptySocketHashes.includes(socket.plug.plugItem.hash) &&
            socket.plug.plugItem.plug &&
            socket.plug.plugItem.plug.plugCategoryIdentifier.match(
              /(v400.weapon.mod_(guns|damage|magazine)|enhancements.)/
            ) &&
            // enforce that this provides a perk (excludes empty slots)
            socket.plug.plugItem.perks.length &&
            // enforce that this doesn't have an energy cost (y3 reusables)
            !socket.plug.plugItem.plug.energyCost
        )
      ),
  },
  {
    keywords: 'modded',
    hint: 'modded',
    description: 'modded',
    format: 'attribute',
    destinyVersion: 2,
    filterFunction: (item: D2Item) =>
      Boolean(item.energy) &&
      item.sockets &&
      item.sockets.sockets.some((socket) =>
        Boolean(
          socket.plug &&
            !D2Values.emptySocketHashes.includes(socket.plug.plugItem.hash) &&
            socket.plug.plugItem.plug &&
            socket.plug.plugItem.plug.plugCategoryIdentifier.match(
              /(v400.weapon.mod_(guns|damage|magazine)|enhancements.)/
            ) &&
            // enforce that this provides a perk (excludes empty slots)
            socket.plug.plugItem.perks.length
        )
      ),
  },
  {
    keywords: 'modslot',
    hint: 'modslot',
    description: 'modslot',
    format: 'attribute',
    destinyVersion: 2,
    filterFunction: (item: D2Item, filterValue: string) => {
      const modSocketTypeHash = getSpecialtySocketMetadata(item);
      return (
        (filterValue === 'none' && !modSocketTypeHash) ||
        (modSocketTypeHash && (filterValue === 'any' || modSocketTypeHash.tag === filterValue))
      );
    },
  },
  {
    keywords: 'holdsmod',
    hint: 'holdsmod',
    description: 'holdsmod',
    format: 'attribute',
    destinyVersion: 2,
    filterFunction: (item: D2Item, filterValue: string) => {
      const modSocketTypeHash = getSpecialtySocketMetadata(item);
      return (
        (filterValue === 'none' && !modSocketTypeHash) ||
        (modSocketTypeHash &&
          (filterValue === 'any' || modSocketTypeHash.compatibleTags.includes(filterValue)))
      );
    },
  },
];

export default socketFilters;
