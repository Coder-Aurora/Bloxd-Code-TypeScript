import { Async } from "../AsyncTimer";

type Vector3 = [number, number, number];
type TargetBlocks = string[] | null;

declare const Math: any;

interface AgeResult {
    stop: () => boolean;
    getReplaced: () => number;
};

export function ageBlocks(
    pos1: Vector3,
    pos2: Vector3,
    blocks: string[],
    targetBlocks: TargetBlocks = null,
    chunkSize: number = 30,
    density: number = 0.4,
    interval: number = 100
): AgeResult {
    const
        [minX, minY, minZ] =
            [Math.min(pos1[0], pos2[0]), Math.min(pos1[1], pos2[1]), Math.min(pos1[2], pos2[2])],
        [maxX, maxY, maxZ] =
            [Math.max(pos1[0], pos2[0]), Math.max(pos1[1], pos2[1]), Math.max(pos1[2], pos2[2])];

    let
        active: boolean = true,
        x: number = minX,
        z: number = minZ,
        replaced: number = 0;

    const loopId = Async.setInterval(() => {
        if (!active) return;

        for (let dx: number = 0; dx < chunkSize; ++dx) {
            const currentX: number = x + dx;
            if (currentX > maxX) continue;

            for (let dz: number = 0; dz < chunkSize; ++dz) {
                const currentZ = z + dz;
                if (currentZ > maxZ) continue;

                for (let y: number = minY; y <= maxY; ++y) {
                    if (targetBlocks && !targetBlocks.includes(api.getBlock(currentX, y, currentZ))) continue;

                    if (Math.random() < density) {
                        const block: string = blocks[Math.floor(Math.random() * blocks.length)];
                        api.setBlock(currentX, y, currentZ, block);
                        ++replaced;
                    }
                }
            }
        }

        x += chunkSize;
        if (x > maxX) {
            x = minX;
            z += chunkSize;
        }

        if (z > maxZ) {
            active = false;
            Async.clearInterval(loopId);
        }
    }, interval);

    return {
        stop: () => {
            active = false;
            return Async.clearInterval(loopId);
        },

        getReplaced: () => replaced,
    };
}
