import type { BlockName, Pos } from "@bloxd";

import { clearInterval, setInterval } from "@plugins/helpers";
import type { IntervalId } from "@plugins/helpers";

function* _generateCirclePoints(
    radius: number,
    [cx, cy, cz]: Pos,
    isHollow: boolean,
): Generator<Pos> {
    const symmetricPoints = function* (x: number, z: number): Generator<Pos> {
        yield [cx + x, cy, cz + z];

        if (z !== 0) yield [cx + x, cy, cz - z];
        if (x !== 0) yield [cx - x, cy, cz + z];
        if (x !== 0 && z !== 0) yield [cx - x, cy, cz - z];
    };

    const span = function* (z: number, halfWidth: number): Generator<Pos> {
        for (let x = -halfWidth; x <= halfWidth; x++) {
            yield [cx + x, cy, cz + z];
        }
    };

    let x = radius;
    let z = 0;
    let decision = 1 - radius;

    while (x >= z) {
        if (isHollow) {
            yield* symmetricPoints(x, z);

            if (x !== z) {
                yield* symmetricPoints(z, x);
            }
        } else {
            yield* span(z, x);

            if (z !== 0) {
                yield* span(-z, x);
            }

            if (x !== z) {
                yield* span(x, z);

                if (x !== 0) {
                    yield* span(-x, z);
                }
            }
        }

        z++;

        if (decision < 0) {
            decision += 2 * z + 1;
        } else {
            x--;
            decision += 2 * (z - x) + 1;
        }
    }
}

/**
 * Generates a circle of blocks on the horizontal XZ plane.
 *
 * @param radius - A non-negative integer radius in blocks
 * @param centre - The integer block coordinates of the circle centre
 * @param block - The block to place
 * @param isHollow - Whether to place only the circumference
 * @param perTick - Maximum number of blocks to place per interval
 * @param delay - Interval delay in milliseconds
 */
export function circle(
    radius: number,
    centre: Pos,
    block: BlockName = "Black Glass",
    isHollow = true,
    perTick = 5000,
    delay = 100,
): void {
    const points = _generateCirclePoints(radius, centre, isHollow);
    let nextPoint = points.next();
    let loopId: IntervalId;

    loopId = setInterval(() => {
        try {
            let placed = 0;

            while (placed < perTick && !nextPoint.done) {
                const [x, y, z] = nextPoint.value;
                api.setBlock(x, y, z, block);
                placed++;
                nextPoint = points.next();
            }

            if (nextPoint.done) {
                clearInterval(loopId);
            }
        } catch (error) {
            clearInterval(loopId);
            throw error;
        }
    }, delay);
}
