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
	style:--scale={random(seed, 0.5, 1)}
	style:--delay={random(seed, 0, 0.5) + 's'}
	style:--h={random(seed) * 360}
	class="container"
	transition:scale={{ duration: random(seed, 1000, 2000), easing: bounceOut }}
/>

<style>
	.container {
		--h: 0deg;
		--s: 100%;
		--l: 95%;

		--c: hsl(var(--h) var(--s) var(--l) / 0.3);
		--w: 29px;
		--base-scale: 0.4;
		--scale: 1;
		--delay: 0;

		--opacity-min: 0.95;
		--opacity-max: 1;

		position: absolute;
		left: var(--x);
		top: var(--y);
		scale: calc(var(--base-scale) * var(--scale));

		width: var(--w);
		height: var(--w);
		border-radius: 50%;
		background-image: radial-gradient(hsl(var(--h) var(--s) var(--l) / 0.3), transparent 50%);

		animation: fade-center calc(1s * var(--scale)) infinite both;
		animation-delay: calc(var(--delay));

		cursor: pointer;
	}

	.container::after {
		content: '';
		position: absolute;
		left: 50%;
		top: 50%;
		translate: -50% -50%;

		width: 15%;
		height: 15%;
		border-radius: 50%;
		background-color: var(--c);
		filter: blur(1px);

		--opacity-min: 0.5;
		--opacity-max: 0.8;
		animation: fade-center 1.1s infinite both;
	}

	.container::before {
		--c: hsl(var(--h) var(--s) var(--l) / 0.1);
		content: '';
		position: absolute;
		left: 50%;
		top: 50%;
		translate: -50% -50%;

		width: 200%;
		height: 200%;
		border-radius: 50%;
		background-color: var(--c);
		filter: blur(10px);

		--opacity-min: 0.1;
		--opacity-max: 1;
		animation: fade-center 3.4s infinite alternate;
	}

	@keyframes fade-center {
		from {
			opacity: var(--opacity-min);
		}
		to {
			opacity: var(--opacity-max);
		}
	}
</style>
