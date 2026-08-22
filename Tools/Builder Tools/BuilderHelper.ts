import { Async } from "../AsyncTimer";
import { txt } from "../MessageTool";

type Vector3 = [number, number, number];
type TargetBlocks = string[] | null;

declare const Math: any;

interface AgeResult {
    stop: () => boolean;
    getReplaced: () => number;
};


export const BuilderHelper = {
    line(
        pos1: Vector3,
        pos2: Vector3,
        block: string = "White Wool",
        delay: number = 50
    ): void {
        const
            [x1, y1, z1] = pos1,
            [x2, y2, z2] = pos2;

        const
            dx: number = x2 - x1,
            dy: number = y2 - y1,
            dz: number = z2 - z1;

        const maxStep: number = Math.max(Math.abs(dx), Math.abs(dy), Math.abs(dz));
        if (maxStep === 0) {
            api.setBlock(x1, y1, z1, block);
            return;
        }

        let i: number = 0;
        const loopId: number = Async.setIntervalLoop(() => {
            const
                curX: number = Math.round(x1 + (dx * i) / maxStep),
                curY: number = Math.round(y1 + (dy * i) / maxStep),
                curZ: number = Math.round(z1 + (dz * i) / maxStep);
            api.setBlock(curX, curY, curZ, block);

            ++i;
            if (i > maxStep) {
                Async.clearIntervalLoop(loopId);
            }
        }, delay);
    },

    circle(
        centre: Vector3,
        radius: number,
        block: string = "White Wool"
    ): void {
        const [cx, cy, cz] = centre;
        let
            x: number = 0,
            z: number = -radius;

        while (x < -z) {
            const mid: number = z + 0.5;

            if (x * x + mid * mid - radius * radius) z += 1;

            api.setBlock(cx + x, cy, cz + z, block);
            api.setBlock(cx + x, cy, cz - z, block);
            api.setBlock(cx - x, cy, cz + z, block);
            api.setBlock(cx - x, cy, cz - z, block);

            api.setBlock(cx + z, cy, cz + x, block);
            api.setBlock(cx + z, cy, cz - x, block);
            api.setBlock(cx - z, cy, cz + x, block);
            api.setBlock(cx - z, cy, cz - x, block);

            x += 1;
        }
    },

    sphere(
        centre: Vector3,
        radius: number,
        block: string = "Black Glass",
        isHollow: boolean = true,
        perTick: number = 5000,
        delay: number = 100
    ): number {
        const
            [cx, cy, cz] = centre,
            rSq: number = radius * radius,
            side: number = radius * 2 + 1,
            totalCells: number = side * side * side;

        let
            index: number = 0,
            placed: number = 0;

        const loopId: number = Async.setIntervalLoop(() => {
            let batch: number = 0;
            while (batch < perTick && index < totalCells) {
                const
                    dx: number = (Math.floor(index / (side * side))) - radius,
                    dy: number = (Math.floor(index / side) % side) - radius,
                    dz: number = (index % side) - radius;

                const distSq: number = dx * dx + dy * dy + dz * dz;
                let place: boolean = false;

                if (isHollow) {
                    const dist: number = Math.sqrt(distSq);
                    place = Math.abs(dist - radius) <= 0.5;
                } else {
                    place = distSq <= rSq;
                }

                if (place) {
                    api.setBlock(cx + dx, cy + dy, cz + dz, block);
                    ++placed;
                }

                ++index;
                ++batch;
            }

            if (index >= totalCells) {
                Async.clearIntervalLoop(loopId);
                txt.global(`Sphere generating complete, placed ${placed} blocks`);
            }
        }, delay);

        txt.global("Starting sphere generation...");
        return loopId;
    },

    ageBlocks(
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

        const loopId = Async.setIntervalLoop(() => {
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
                Async.clearIntervalLoop(loopId);
            }
        }, interval);

        return {
            stop: () => {
                active = false;
                return Async.clearIntervalLoop(loopId);
            },

            getReplaced: () => replaced,
        };
    },
};
