<script lang="ts">
	import type { DotState } from '$lib/dot-store';
	import { random } from '$lib/random';
	import { bounceOut } from 'svelte/easing';
	import { scale } from 'svelte/transition';

	export let state: DotState;
	const { id, status, x, y, seed } = state;
</script>

<div
	style:--x={x + 'vw'}
	style:--y={y + 'vh'}
	style:--delay={random(seed, 0, 0.5) + 's'}
	style:--h={random(seed) * 360}
	style:--scale={random(seed, 0.1, 1)}
	style:--spin-speed={random(seed, 0.1, 1)}
	class="transform-anchor"
>
	<div
		class="container"
		transition:scale={{ duration: random(seed, 1000, 2000), easing: bounceOut }}
	>
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
			opacity: 1;
		}
		100% {
			opacity: 0;
		}
	}

	.transform-anchor {
		position: absolute;
		left: 50%;
		top: 50%;
		translate: -50% -50%;

		animation: spin calc(100s * var(--spin-speed)) linear infinite;
	}

	.container {
		--base-dimension: 10px;

		position: absolute;
		left: var(--x);
		top: var(--y);

		--core-blur: 0.5px;
		--halo-1-blur: 5px;
		--halo-2-blur: 10px;

		--core-flicker-speed: 0.11;
		--halo-1-flicker-speed: 0.13;
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
