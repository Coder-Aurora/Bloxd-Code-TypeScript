import { Async } from "../AsyncTimer";
import { txt } from "../MessageTool";

type Vector3 = [number, number, number];
declare const Math: any;

export function sphere(
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

    const loopId: number = Async.setInterval(() => {
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
            Async.clearInterval(loopId);
            txt.global(`Sphere generating complete, placed ${placed} blocks`);
        }
    }, delay);

    txt.global("Starting sphere generation...");
    return loopId;
}
