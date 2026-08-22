type Vector3 = [number, number, number];

export function circle(
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
}
