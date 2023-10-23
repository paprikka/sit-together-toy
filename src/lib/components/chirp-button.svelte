<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	export let disabled = true;
	export let cooldownDuration = '1s';
	const dispatch = createEventDispatcher<{ click: void }>();
</script>

<button
	class="chirp"
	on:click={() => dispatch('click')}
	{disabled}
	aria-label="chirp"
	style:--cooldown={cooldownDuration}
/>

<style>
	.chirp {
		--chirp-size: var(--step-4);
		--border-width: 2px;
		--color: var(--color-text);
		--base-rotation: -37deg;
		position: absolute;
		appearance: none;
		bottom: 1rem;
		left: 50%;
		translate: -50% 0;
		width: var(--chirp-size);
		height: var(--chirp-size);
		font-size: var(--chirp-size);
		border-radius: 50%;
		border: none;
		box-shadow: inset 0 0 0 var(--border-width) var(--color);
		background-color: transparent;
		cursor: pointer;
		transition: 0.4s box-shadow;
		rotate: var(--base-rotation);
		padding: 0;
	}

	.chirp::after {
		position: absolute;
		left: 50%;
		top: 50%;
		translate: -50% -50%;

		content: '';
		border-radius: 50%;
		background-color: var(--color);
		width: 0.15em;
		height: 0.15em;

		transition: 400ms scale, 400ms left;
	}

	@media (hover: hover) {
		.chirp:not(:disabled):hover {
			box-shadow: inset 0 0 0 4rem rgba(255, 255, 255, 0.25),
				0 0 0.25rem 0.25rem rgba(255, 255, 255, 0.125);
		}

		.chirp:not(:disabled):hover::after {
			scale: 2;
		}
	}

	@keyframes chirp {
		from {
			scale: 0;
			opacity: 0;
		}
		to {
			scale: 1;
			opacity: 1;
		}
	}
	@keyframes chirp-disabled {
		0% {
			rotate: var(--base-rotation);
		}

		10%,
		90% {
			opacity: 0.3;
		}

		100% {
			rotate: calc(var(--base-rotation) + 360deg);
		}
	}

	.chirp:disabled {
		cursor: default;
		pointer-events: none;
		animation: chirp-disabled var(--cooldown) linear infinite;
	}

	.chirp:disabled::after {
		left: calc(var(--border-width) / 2);

		/* --chirp-size: var(--step-2); */

		/* animation: chirp-disabled 1s ease-out both; */
	}
</style>
