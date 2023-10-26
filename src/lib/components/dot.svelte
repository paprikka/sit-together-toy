<script lang="ts">
	import type { DotState } from '$lib/dot-store';
	import { makeRandom } from '$lib/random';
	import { bounceOut } from 'svelte/easing';
	import { scale } from 'svelte/transition';
	import starURL from '../star.webp';
	import { createEventDispatcher } from 'svelte';

	export let isSelected = false;
	export let state: DotState;
	const { x, y, seed } = state;
	const random = makeRandom(seed);

	const dispatch = createEventDispatcher<{ click: void }>();
</script>

<!-- svelte-ignore a11y-interactive-supports-focus -->
<div
	style:--x={x}
	style:--y={y}
	style:--delay={random(0, 0.5) + 's'}
	style:--h={random(0, 360)}
	style:--scale={random(0.8, 8)}
	style:--spin-speed={random(1, 9)}
	style:--flicker-speed={random(0.1, 5)}
	style:--texture-url={`url(${starURL})`}
	class="transform-anchor"
>
	<!-- svelte-ignore a11y-click-events-have-key-events -->
	<div
		role="button"
		class="container"
		class:is-selected={isSelected}
		transition:scale={{ duration: random(1000, 2000), easing: bounceOut }}
		on:click={() => dispatch('click')}
	>
		{#if state.status === 'chirping'}
			<div class="chirp-indicator" />
		{/if}
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
		width: calc(var(--base-dimension) * var(--scale));
		height: calc(var(--base-dimension) * var(--scale));

		background-image: var(--texture-url);
		background-size: contain;

		filter: hue-rotate(calc(var(--h) * 1deg)) saturate(0.15) brightness(4);

		/* --flicker-speed: 0.11; */
		--min-opacity: 0.2;
		--max-opacity: 1;

		animation-name: flicker;
		animation-duration: calc(var(--flicker-speed) * 1s);
		animation-timing-function: linear;
		animation-iteration-count: infinite;
		animation-direction: alternate;
	}

	.container::after {
		visibility: hidden;
		opacity: 0;
		position: absolute;
		width: 100px;
		height: 100px;
		content: '';
		border-radius: 1000rem;
		border: 1px solid hsl(var(--color-text-h) var(--color-text-s) var(--color-text-l) / 0.7);
		translate: -50% -50%;
		left: 50%;
		top: 50%;
		scale: 0.8;

		transition: 0.4s visibility, 0.4s opacity, 0.4s scale;
	}

	.container.is-selected::after {
		opacity: 1;
		scale: 1;
		visibility: visible;
	}

	.chirp-indicator {
		position: absolute;
		left: 50%;
		top: 50%;
		translate: -50% -50%;
		width: 100%;
		height: 100%;
		border-radius: 1000rem;
		/* background: radial-gradient(circle, rgb(255, 255, 255) 0%, rgba(255, 255, 255, 0) 100%); */

		background: radial-gradient(
			circle,
			hsl(var(--color-text-h) var(--color-text-s) var(--color-text-l) / 0.2) 0%,
			hsl(var(--color-text-h) var(--color-text-s) var(--color-text-l) / 0) 100%
		);
		animation: chirp 100ms ease-out infinite both;
	}

	@keyframes chirp {
		from {
			opacity: 0;
			scale: 0;
		}

		30% {
			opacity: 1;
			scale: 1;
		}

		to {
			scale: 4;
			opacity: 0;
		}
	}
</style>
