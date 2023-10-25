<script lang="ts">
	import { dots, makeDot, selectedDot, type DotState } from '../dot-store';
	import Dot from './dot.svelte';
	import bgURL from '../bg.webp';
	import { onMount } from 'svelte';
	import { writable } from 'svelte/store';
	import { featureToggles } from '$lib/feature-toggles';

	const testDots = writable<DotState[]>([]);

	onMount(() => {
		testDots.set(
			Array($featureToggles.debugDotCount)
				.fill(null)
				.map(() => {
					const id = Math.floor(Math.random() * 1_000_000).toString();
					return makeDot(id);
				})
		);
	});
</script>

<div class="dots" style:--bg-url={`url(${bgURL})`}>
	{#each [...$testDots, ...$dots.values()] as dot (dot.id)}
		<Dot
			state={dot}
			isSelected={$selectedDot?.id === dot.id}
			on:click={(e) => selectedDot.set(dot)}
		/>
	{/each}
</div>

<style>
	.dots {
		position: absolute;
		left: 0;
		top: 0;
		width: 100vw;
		height: 100vh;

		background: linear-gradient(rgba(0, 0, 0, 0.95), rgba(0, 0, 0, 0.95)), var(--bg-url);
	}
</style>
