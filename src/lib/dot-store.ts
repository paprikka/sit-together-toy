import { writable } from 'svelte/store';

export type DotStatus = 'entering' | 'idle' | 'leaving' | 'chirp';

export type DotState = {
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
