import type { PlayerId } from "@bloxd";

const ADMINS = ["Coder_Aurora"];

export function isAdmin(playerId: PlayerId): boolean {
    return ADMINS.includes(api.getEntityName(playerId));
}
