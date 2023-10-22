export function random(seed: number, min = 0, max = 1) {
	let t = (seed += 0x6d2b79f5);
	t = Math.imul(t ^ (t >>> 15), t | 1);
	t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
	const n = ((t ^ (t >>> 14)) >>> 0) / 4294967296;

	return min + n * (max - min);
}
