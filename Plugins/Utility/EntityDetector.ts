import type { EntityId, PlayerId, Pos, Vec3 } from "@bloxd";

type TargetInfo = { position: Pos; normal: Pos; adjacent: Pos; eid?: EntityId; };

const _dot = (a: Vec3, b: Vec3): number => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
const _len = (v: Vec3): number => Math.sqrt(v[0] * v[0] + v[1] * v[1] + v[2] * v[2]);
const _normalize = (v: Vec3): Vec3 => {
    const l = _len(v);
    if (l === 0) return [0, 0, 0];
    return [v[0] / l, v[1] / l, v[2] / l];
};

const _angleBetween = (dirA: Vec3, dirB: Vec3): number => {
    const nA = _normalize(dirA);
    const nB = _normalize(dirB);
    const cosTheta = Math.max(-1, Math.min(1, _dot(nA, nB)));
    return (Math.acos(cosTheta) * 180) / Math.PI;
};

/**
 * Detects entities within a certain angle and distance from the player
 * 
 * @param playerId The player to detect entities for
 * @param angle The angle to detect entities within, defaults to 90 degrees
 * @param distance The distance to detect entities within, defaults to 5 blocks
 * @returns An array of entity IDs
 */
export function detectEntities(playerId: PlayerId, angle: number = 90, distance: number = 5): EntityId[] {
    angle = Math.max(0, Math.min(180, angle));
    distance = Math.max(0, distance);

    const facing = api.getPlayerFacingInfo(playerId);
    if (!facing) return [];

    const [cx, cy, cz] = facing.camPos;
    const [dx, dy, dz] = facing.dir;

    if (angle === 0) {
        const targetInfo = api.getPlayerTargetInfo(playerId) as TargetInfo | null;
        if (!targetInfo) return [];

        if (targetInfo.eid) return [targetInfo.eid]; // Targeting entity

        if (targetInfo.position) {
            const [tx, ty, tz] = targetInfo.position;
            const entities = api.getEntitiesInRect(
                [tx - 0.5, ty - 0.5, tz - 0.5],
                [tx + 0.5, ty + 0.5, tz + 0.5],
            );
            return entities.filter((eid) => eid !== playerId);
        }

        return [];
    }

    const [minX, minY, minZ] = [cx - distance, cy - distance, cz - distance];
    const [maxX, maxY, maxZ] = [cx + distance, cy + distance, cz + distance];

    let entities: EntityId[] = [];
    try {
        entities = api.getEntitiesInRect([minX, minY, minZ], [maxX, maxY, maxZ]);
    } catch (e) {
        return [];
    }

    if (!entities || entities.length === 0) return [];

    const halfAngle = angle / 2;

    const results: EntityId[] = [];
    for (const eid of entities) {
        if (eid === playerId) continue;

        const pos = api.getPosition(eid);
        if (!pos) continue;

        const toTarget: Vec3 = [pos[0] - cx, pos[1] - cy, pos[2] - cz];

        const dist = _len(toTarget);
        if (dist > distance || dist < 0.1) continue;

        const angleDiff = _angleBetween([dx, dy, dz], toTarget);
        if (angleDiff > halfAngle) continue;

        results.push(eid);
    }

    return results;
}
