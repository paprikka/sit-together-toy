<script lang="ts">
	import { random } from '$lib/random';
	import { dots, makeDot } from '../dot-store';
	import Dot from './dot.svelte';

	const testDots = Array(300)
		.fill(null)
		.map((_, i) => makeDot((random(i * 10000) * 1000000).toString()));
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
		pointer-events: none;
	}
</style>
