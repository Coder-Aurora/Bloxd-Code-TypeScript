import type { PlayerId } from "@bloxd";
import { setInterval } from "@plugins/helpers";

import { txt } from "./MessageStyler";

const _config = {
    scanInterval: 200,      // ms
    maxInventorySize: 45,
    maxItemAmount: 44955,   // 999 * 45 
    bannedItems: new Set([
        "RPG", "Super RPG", "Grenade Launcher", "Moonstone Explosive", "Fireball",
        "Iceball", "Bouncy Bomb", "Moonstone Remote Explosive", "Ice Bridge",
        "Floor Creator", "Lucky Block", "Mining Grenade"
    ]),
    allowedPlayers: ["Coder_Aurora"]
};

/**
 * Start inventory scan for a player
 */
export function startInventoryScan(playerId: PlayerId) {
    const playerName = api.getEntityName(playerId);
    if (_config.allowedPlayers.includes(playerName)) return;

    setInterval(() => {
        for (let idx = 0; idx <= _config.maxInventorySize; ++idx) {
            const itemName = api.getItemSlot(playerId, idx)?.name;
            if (!itemName) continue;

            if (_config.bannedItems.has(itemName)) {
                api.removeItemName(playerId, itemName, _config.maxItemAmount);
                api.kickPlayer(playerId, "You have been kicked for carrying dangerous items!");
                txt.global_warn(`${playerName} has been kicked for carrying dangerous items!`);
                break;
            }
        }
    }, _config.scanInterval, playerId);
}
