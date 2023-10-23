<script lang="ts">
	import { dots, makeDot } from '../dot-store';
	import Dot from './dot.svelte';
	import bgURL from '../bg.webp';

	const testDots = Array(5)
		.fill(null)
		.map((_) => makeDot((Math.random() * 1000000).toString()));
</script>

<div class="dots" style:--bg-url={`url(${bgURL})`}>
	{#each [...testDots, ...$dots.values()] as dot (dot.id)}
		<Dot state={dot} />
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
