<script lang="ts">
	import Dot from '$lib/components/dot.svelte';
	import type { DotState } from '$lib/dot-store';
	import { dots } from '$lib/dot-store';
	import { randomFromString } from '$lib/random-from-string';
	import { onMount } from 'svelte';
	import { fade } from 'svelte/transition';
	import type { ClientChirpMessage, ServerRoomUpdateMessage } from '../../party/types';
	import { initAudio, type Audio } from './audio';
	import { messages, sendMessage } from './socket';
	import { derived } from 'svelte/store';

	let audio: Audio | null = null;

	onMount(() => {
		initAudio().then((instance) => (audio = instance));
		return () => {
			console.log('dispose');
			if (!audio) return;
			audio.dispose();
		};
	});

	const makeDot = (clientID: string): DotState => ({
		id: clientID,
		x: 50 + (randomFromString(clientID) - 0.5) * 80,
		y: 50 + (randomFromString(clientID + 'x') - 0.5) * 80,
		status: 'entering'
	});

	const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

	messages.subscribe(($messages) => {
		const updateMessages = $messages.filter(
			(message): message is ServerRoomUpdateMessage => message.type === 'server:room-update'
		);

		if (updateMessages.length === 0) return [];

		const lastUpdate = updateMessages[updateMessages.length - 1];

		const serverClientIDs = new Set(lastUpdate.clients);
		const localClientIDs = new Set([...$dots.keys()]);

		console.log({
			serverClientIDs,
			localClientIDs
		});

		const removedClientIDs = [...localClientIDs].filter(
			(clientID) => !serverClientIDs.has(clientID)
		);

		const newClientIDs = [...serverClientIDs].filter((clientID) => !localClientIDs.has(clientID));

		const existingClientIDs = [...localClientIDs].filter((clientID) =>
			serverClientIDs.has(clientID)
		);

		dots.update(($dots) => {
			removedClientIDs.forEach(async (clientID) => {
				audio?.getSound('leave')?.play();
				await wait(300);
				$dots.delete(clientID);
			});

			newClientIDs.forEach((clientID) => {
				$dots.set(clientID, makeDot(clientID));
				audio?.getSound('enter')?.play();
			});

			return $dots;
		});
	});

	const lastMessage = derived(messages, ($messages) => {
		if ($messages.length === 0) return null;
		return $messages.at(-1);
	});

	lastMessage.subscribe(($lastMessage) => {
		if (!$lastMessage) return;
		if ($lastMessage.type !== 'server:broadcast-client-message') return;

		const { message } = $lastMessage;

		if (message.type === 'client:chirp') chirp();
	});

	let audioFadeDuration = 10000;

	const onStartClick = () => {
		isOverlayVisible = false;
		if (!audio) return;
		const bg = audio.getSound('bg');
		if (!bg) return;
		const id = bg.play();

		bg.fade(0, 0.4, audioFadeDuration, id);
	};

	let isOverlayVisible = true;

	let canChirp = true;
	const chirpCooldown = 6000;

	const chirp = () => {
		if (!audio) return;
		const chirp = audio.getSound('gong');
		if (!chirp) return;
		chirp.play();
	};

	const onChirpClick = () => {
		canChirp = false;
		setTimeout(() => {
			canChirp = true;
		}, chirpCooldown);
		sendMessage({
			type: 'client:chirp'
		} as ClientChirpMessage);
	};
</script>

<div class="dots">
	{#each [...$dots.values()] as dot (dot.id)}
		<Dot state={dot} />
	{/each}
</div>
{#if isOverlayVisible}
	<div class="overlay" transition:fade={{ duration: audioFadeDuration / 3 }}>
		<button on:click={onStartClick}>start</button>
	</div>
{/if}

<button class="chirp" disabled={!canChirp} aria-label="chirp" on:click={onChirpClick} />

<style>
	.dots {
		position: absolute;
		inset: 0;
		transform-origin: center;
		animation: spin 1000s linear infinite;
	}

	@keyframes spin {
		0% {
			transform: rotate(0deg);
		}
		100% {
			transform: rotate(360deg);
		}
	}

	.overlay {
		position: absolute;
		inset: 0;
		z-index: var(--layer-overlay);
		background-color: rgba(0, 0, 0, 0.8);
		display: grid;
		place-content: center;
		place-items: center;
		backdrop-filter: blur(0.5rem);
	}

	.overlay button {
		appearance: none;
		border: 2px solid white;
		background-color: white;
		color: black;

		border-radius: 0.25rem;
		font-family: inherit;
		text-transform: uppercase;
		opacity: 0.8;
		font-size: var(--step--1);
		padding: var(--step--2) var(--step-1);
		cursor: pointer;
	}

	@media (hover: hover) {
		.overlay button:hover {
			opacity: 1;
		}
	}

	.chirp {
		position: absolute;
		bottom: 1rem;
		left: 50%;
		translate: -50% 0;
		width: var(--step-5);
		height: var(--step-5);
		border-radius: 50%;
		background-color: white;
		border: 2px solid black;
		opacity: 0.8;
		cursor: pointer;
		animation: chirp 0.3s ease-in-out;
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
			transform: scale(1);
			opacity: 1;
		}

		75% {
			opacity: 0;
		}
		100% {
			transform: scale(5);
			opacity: 0;
		}
	}

	.chirp[disabled] {
		animation: chirp-disabled 1s ease-out both;
	}
</style>
