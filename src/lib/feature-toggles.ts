import { readable } from 'svelte/store';
import { browser } from '$app/environment';

export type FeatureToggles = {
	debugDotCount: number;
	debugQuickOverlay: boolean;
	volume: number;
};

const defaults = {
	debugDotCount: 0,
	debugQuickOverlay: false,
	volume: 1
};

export const featureToggles = readable<FeatureToggles>(defaults, (set) => {
	if (!browser) return;
	const params = new URLSearchParams(window.location.search);
	const overrides: FeatureToggles = {
		debugDotCount: parseInt(params.get('debug-dot-count') ?? '0'),
		debugQuickOverlay: params.has('debug-skip-overlay'),
		volume: parseFloat(params.get('volume') ?? '1')
	};

	set(overrides);
});
