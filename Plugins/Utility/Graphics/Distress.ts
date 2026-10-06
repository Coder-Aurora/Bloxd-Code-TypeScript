import type { BlockName, Pos } from "@bloxd";

import { setInterval, clearInterval } from "@plugins/helpers";
import type { IntervalId } from "@plugins/helpers";

type TargetBlocks = BlockName[] | null;

/**
 * Distresses a region of blocks
 * 
 * @param pos1 - The first position
 * @param pos2 - - The second position
 * @param blocks - The blocks to distress
 * @param targetBlocks - The blocks to target
 * @param chunkSize - The size of the chunk to distress
 * @param density - The density of the distressing
 * @param interval - The interval between each distressing
*/
export function distress(
    pos1: Pos,
    pos2: Pos,
    blocks: BlockName[],
    targetBlocks: TargetBlocks = null,
    chunkSize: number = 50,
    density: number = 0.4,
    interval: number = 100,
): void {
    const [minX, minY, minZ] = [
        Math.min(pos1[0], pos2[0]), Math.min(pos1[1], pos2[1]), Math.min(pos1[2], pos2[2])
    ];
    const [maxX, maxY, maxZ] = [
        Math.max(pos1[0], pos2[0]), Math.max(pos1[1], pos2[1]), Math.max(pos1[2], pos2[2])
    ];

    let x = minX;
    let z = minZ;

    const loopId: IntervalId = setInterval(() => {
        for (let dx = 0; dx < chunkSize; ++dx) {
            const currentX = x + dx;
            if (currentX > maxX) continue;

            for (let dz = 0; dz < chunkSize; ++dz) {
                const currentZ = z + dz;
                if (currentZ > maxZ) continue;

                for (let y = minY; y <= maxY; ++y) {
                    if (targetBlocks &&
                        !targetBlocks.includes(api.getBlock(currentX, y, currentZ))) continue;

                    if (Math.random() < density) {
                        const block = blocks[Math.floor(Math.random() * blocks.length)];
                        api.setBlock(currentX, y, currentZ, block);
                    }
                }
            }
        }

        z += chunkSize;
        if (z > maxZ) {
            z = minZ;
            x += chunkSize;
        }

        if (x > maxX) {
            clearInterval(loopId);
        }
    }, interval);
}
