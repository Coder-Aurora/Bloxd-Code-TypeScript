import type { Pos, BlockName } from "@bloxd";

import { setInterval, clearInterval } from "@plugins/helpers";
import type { IntervalId } from "@plugins/helpers";

/**
 * Draws a line between two positions
 * 
 * @param pos1 - The first position
 * @param pos2 - The second position
 * @param block - The block to draw the line with
 * @param delay - The delay between each block
 * @param perTick - The number of blocks to place per tick
 */
export function line(
    pos1: Pos,
    pos2: Pos,
    block: BlockName = "White Wool",
    delay: number = 50,
    perTick: number = 100
): void {
    const [x1, y1, z1] = pos1;
    const [x2, y2, z2] = pos2;
    const [dx, dy, dz] = [x2 - x1, y2 - y1, z2 - z1];
    const maxStep = Math.max(Math.abs(dx), Math.abs(dy), Math.abs(dz));
    if (maxStep === 0) {
        api.setBlock(x1, y1, z1, block);
        return;
    }

    let counter = 0;
    const loopId: IntervalId = setInterval(() => {
        for (let i = 1; i <= perTick && counter <= maxStep; ++i) {
            const [curX, curY, curZ] = [
                Math.round(x1 + (dx * counter) / maxStep),
                Math.round(y1 + (dy * counter) / maxStep),
                Math.round(z1 + (dz * counter) / maxStep)
            ];
            api.setBlock(curX, curY, curZ, block);
            ++counter;
        }

        if (counter > maxStep) {
            clearInterval(loopId);
        }
    }, delay);
}
