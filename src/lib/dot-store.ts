import { writable } from 'svelte/store';
import { random } from './random';

export type DotStatus = 'entering' | 'idle' | 'leaving' | 'chirp';

export type DotState = {
	seed: number;
	id: string;
	x: number;
	y: number;
	status: DotStatus;
};

export const dots = writable<Map<string, DotState>>(new Map());

export const removeDot = (id: string) => {
	dots.update((value) => {
		value.delete(id);
		return value;
	});
};

export const addDot = (dot: DotState) => {
	dots.update((value) => {
		value.set(dot.id, dot);
		return value;
	});
};

export const updateDot = (dot: DotState) => {
	dots.update((value) => {
		value.set(dot.id, dot);
		return value;
	});
};

export const updateDots = (dots: DotState[]) => {
	dots.forEach((dot) => {
		updateDot(dot);
	});
};

const idToNumber = (id: string) => {
	return id
		.split('-')
		.map((_) => parseInt(_, 16))
		.reduce((sum, _) => sum + _, 0);
};

const polarToCartesian = (r: number, theta: number) => {
	return [r * Math.cos(theta), r * Math.sin(theta)];
};

export const makeDot = (clientID: string): DotState => {
	const seed = idToNumber(clientID);
	const r = random(seed, 0, 30);
	console.log(r);
	const theta = random(seed + 1) * Math.PI * 2;

	const [x, y] = polarToCartesian(r, theta);

	return {
		id: clientID,
		x: x,
		y: y,
		status: 'entering',
		seed
	};
};
