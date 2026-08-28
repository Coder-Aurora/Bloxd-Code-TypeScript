import { Async } from "../AsyncTimer";

type Vector3 = [number, number, number];
declare const Math: any;

export function line(
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
    const loopId: number = Async.setInterval(() => {
        const
            curX: number = Math.round(x1 + (dx * i) / maxStep),
            curY: number = Math.round(y1 + (dy * i) / maxStep),
            curZ: number = Math.round(z1 + (dz * i) / maxStep);
        api.setBlock(curX, curY, curZ, block);

        ++i;
        if (i > maxStep) {
            Async.clearInterval(loopId);
        }
    }, delay);
}
