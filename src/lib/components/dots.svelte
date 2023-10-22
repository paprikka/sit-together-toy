<script lang="ts">
	import { dots, makeDot } from '../dot-store';
	import Dot from './dot.svelte';

	const testDots = Array(30)
		.fill(null)
		.map((_, i) => makeDot((Math.random() * 1000000).toString()));
</script>

<div class="dots">
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
	}
</style>
