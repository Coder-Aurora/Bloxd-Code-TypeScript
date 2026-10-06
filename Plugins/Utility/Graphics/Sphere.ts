import type { Pos, BlockName } from "@bloxd";

import { setInterval, clearInterval } from "@plugins/helpers";
import type { IntervalId } from "@plugins/helpers";

/**
 * Generates a sphere of blocks in the world
 * 
 * @param centre - The centre of the sphere
 * @param radius - The radius of the sphere
 * @param block - The block to place
 * @param isHollow - Whether the sphere is hollow
 * @param perTick - The number of blocks to place per tick
 * @param interval - The interval between ticks
 */
export function sphere(
    radius: number,
    centre: Pos,
    block: BlockName = "Black Glass",
    isHollow: boolean = true,
    perTick: number = 5000,
    interval: number = 100,
): void {
    const [cx, cy, cz] = centre;
    const rSq = radius * radius;
    const side = radius * 2 + 1;
    const totalCells = side * side * side;

    let index = 0;
    let placed = 0;

    const loopId: IntervalId = setInterval(() => {
        let batch = 0;

        while (batch < perTick && index < totalCells) {
            const [dx, dy, dz] = [
                Math.floor(index / (side * side)) - radius,
                Math.floor(index / side) % side - radius,
                index % side - radius,
            ];

            const distSq = dx * dx + dy * dy + dz * dz;
            let place = false;

            if (isHollow) {
                const dist = Math.sqrt(distSq);
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
            clearInterval(loopId);
        }
    }, interval);
}
