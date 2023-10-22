<script lang="ts">
	import type { DotState } from '$lib/dot-store';
	import { makeRandom } from '$lib/random';
	import { bounceOut } from 'svelte/easing';
	import { scale } from 'svelte/transition';

	export let state: DotState;
	const { id, status, x, y, seed } = state;
	const random = makeRandom(seed);
</script>

<div
	style:--x={x}
	style:--y={y}
	style:--delay={random(0, 0.5) + 's'}
	style:--h={random(seed) * 360}
	style:--scale={random(0.1, 1)}
	style:--spin-speed={random(1, 2)}
	style:--halo-1-flicker-speed={random(1, 3) * 130}
	class="transform-anchor"
>
	<div class="container" transition:scale={{ duration: random(1000, 2000), easing: bounceOut }}>
		<div class="halo-1" />
		<div class="halo-2" />
		<div class="core" />
	</div>
</div>

<style>
	@keyframes spin {
		0% {
			transform: rotate(0deg);
		}
		100% {
			transform: rotate(360deg);
		}
	}

	@keyframes flicker {
		0% {
			opacity: var(--max-opacity);
		}
		100% {
			opacity: var(--min-opacity);
		}
	}

	.transform-anchor {
		position: absolute;
		left: 50%;
		top: 50%;
		translate: -50% -50%;

		animation: spin calc(100s * var(--spin-speed)) linear infinite;
	}

	.transform-anchor:has(.container:hover) {
		cursor: pointer;
	}

	.container {
		--base-dimension: 10px;

		position: absolute;
		left: calc(min(1vw * var(--x), 1vh * var(--x)));
		top: calc(min(1vw * var(--y), 1vh * var(--y)));

		--core-blur: 0.5px;
		--halo-1-blur: 5px;
		--halo-2-blur: 10px;

		--core-flicker-speed: 0.11;
		/* --halo-1-flicker-speed: 0.13; */
		--halo-2-flicker-speed: 0.37;

		--core-min-opacity: 0.5;
		--core-max-opacity: 1;

		--halo-1-min-opacity: 0.25;
		--halo-1-max-opacity: 0.5;

		--halo-2-min-opacity: 0.125;
		--halo-2-max-opacity: 0.25;
	}

	.halo-1 {
		position: absolute;

		width: calc(var(--base-dimension) * var(--scale) * 4);
		height: calc(var(--base-dimension) * var(--scale) * 4);

		--base-color: hsl(calc(var(--h) * 1deg) 100% 96% / 0.25);
		background-color: var(--base-color);

		left: 50%;
		top: 50%;
		translate: -50% -50%;
		border-radius: 50%;

		filter: blur(var(--halo-1-blur));

		--min-opacity: var(--halo-1-min-opacity);
		--max-opacity: var(--halo-1-max-opacity);
		--flicker-speed: calc(1s * var(--halo-1-flicker-speed));

		animation: flicker var(--flicker-speed) linear infinite alternate;
	}

	.halo-2 {
		position: absolute;

		width: calc(var(--base-dimension) * var(--scale) * 8);
		height: calc(var(--base-dimension) * var(--scale) * 8);

		--base-color: hsl(calc(var(--h) * 1deg) 100% 96% / 0.125);
		background-color: var(--base-color);

		left: 50%;
		top: 50%;
		translate: -50% -50%;
		border-radius: 50%;

		filter: blur(var(--halo-2-blur));
	}

	.core {
		--base-color: hsl(calc(var(--h) * 1deg), 100%, 96%);

		width: calc(var(--base-dimension) * var(--scale));
		height: calc(var(--base-dimension) * var(--scale));

		border-radius: 50%;
		background-color: var(--base-color);

		filter: blur(var(--core-blur));
	}
</style>
