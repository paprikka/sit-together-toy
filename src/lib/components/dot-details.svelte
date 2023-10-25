<script lang="ts">
	import type { DotState } from '$lib/dot-store';
	import { fade } from 'svelte/transition';
	import type { Audio } from '../../routes/audio';

	const initPlanetKeys = () => {
		const keyToIDMap: Record<string, string> = {
			a: 'key_1',
			s: 'key_2',
			d: 'key_3',
			f: 'key_4',
			g: 'key_5'
		};

		const onKey = (e: KeyboardEvent) => {
			const key = e.key.toLowerCase();
			if (!(key in keyToIDMap)) return;

			audio?.getSound(keyToIDMap[key])?.play();
		};

		window.addEventListener('keydown', onKey);

		return {
			dispose: () => window.removeEventListener('keydown', onKey)
		};
	};

	export let dot: DotState;
	export let audio: Audio;
</script>

<div class="selectedDot">
	<p transition:fade>
		[ {dot.id.split('-')[0]} ]
	</p>
	<ul>
		{#each planets as planet, ind}
			<li transition:fade={{ delay: 100 + ind * 30 }}>
				<button on:click={() => playKey(planet.sound)}>{planet.symbol}{ind}</button>
			</li>
		{/each}
	</ul>
	<p transition:fade><button on:click={() => (dot = null)}>close</button></p>
</div>

<style>
	.selectedDot {
		position: absolute;
		top: 1rem;
		right: 1rem;
		left: 1rem;
		text-align: center;
		font-family: monospace;

		--_w: var(--step-3);
	}

	.selectedDot ul {
		list-style: none;
		padding: 0;
		display: flex;
		gap: 1rem;
		justify-content: center;
	}

	.selectedDot li {
		display: block;
	}

	.selectedDot ul button {
		appearance: none;
		width: var(--_w);
		height: var(--_w);
		font-family: inherit;
		background-color: var(--color-text);
		color: var(--color-bg);
		border: none;
		border-radius: 100rem;
		font-size: calc(var(--_w) * 0.6);
		padding: 0.1em 0.5ch;
		cursor: pointer;
	}

	.selectedDot button:hover {
		opacity: 0.8;
	}
</style>
