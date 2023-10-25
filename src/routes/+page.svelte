<script lang="ts">
	import ChirpButton from '$lib/components/chirp-button.svelte';
	import Dots from '$lib/components/dots.svelte';
	import { dots, makeDot, selectedDot } from '$lib/dot-store';
	import { featureToggles } from '$lib/feature-toggles';
	import { onMount } from 'svelte';
	import { derived } from 'svelte/store';
	import { fade } from 'svelte/transition';
	import type { ClientChirpMessage, ServerRoomUpdateMessage } from '../../party/types';
	import { initAudio, type Audio } from './audio';
	import { messages, sendMessage } from './socket';

	let audioFadeDuration = 7000;
	let overlayFadeDuration = 2000;
	let isOverlayVisible = true;
	let canChirp = true;
	let chirpCooldown = 3000;

	let audio: Audio | null = null;

	onMount(() => {
		initAudio($featureToggles).then((instance) => (audio = instance));
		if ($featureToggles.debugQuickOverlay) {
			audioFadeDuration = 100;
			overlayFadeDuration = 100;
			chirpCooldown = 100;
		}

		return () => {
			console.log('dispose');
			if (!audio) return;
			audio.dispose();
		};
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

	const onStartClick = () => {
		isOverlayVisible = false;
		if (!audio) return;
		const bg = audio.getSound('bg');
		if (!bg) return;
		const id = bg.play();

		bg.fade(0, 0.4, audioFadeDuration, id);
	};

	const chirp = () => {
		if (!audio) return;
		const chirp = audio.getSound('gong');
		if (!chirp) return;
		chirp.play();
	};

	const onChirpClick = () => {
		canChirp = false;

		audio?.getSound('gong')?.play();

		setTimeout(() => {
			canChirp = true;
		}, chirpCooldown);
		sendMessage({
			type: 'client:chirp'
		} as ClientChirpMessage);
	};

	const playKey = (_key: string) => {
		audio?.getSound('chirp')?.play();
	};
</script>

<Dots />

{#if $selectedDot}
	<div class="selectedDot">
		<p transition:fade>
			[ {$selectedDot.id.split('-')[0]} ]
		</p>
		<ul>
			<li
				transition:fade={{
					delay: 100
				}}
			>
				<button on:click={() => playKey('c')}>c</button>
			</li>
			<li
				transition:fade={{
					delay: 120
				}}
			>
				<button on:click={() => playKey('d')}>d</button>
			</li>
			<li
				transition:fade={{
					delay: 140
				}}
			>
				<button on:click={() => playKey('e')}>e</button>
			</li>
			<li
				transition:fade={{
					delay: 160
				}}
			>
				<button on:click={() => playKey('f')}>f</button>
			</li>
			<li
				transition:fade={{
					delay: 180
				}}
			>
				<button on:click={() => playKey('g')}>g</button>
			</li>
			<li
				transition:fade={{
					delay: 200
				}}
			>
				<button on:click={() => playKey('a')}>a</button>
			</li>
			<li
				transition:fade={{
					delay: 220
				}}
			>
				<button on:click={() => playKey('h')}>h</button>
			</li>
			<li
				transition:fade={{
					delay: 240
				}}
			>
				<button on:click={() => playKey('c')}>c</button>
			</li>
		</ul>
		<p transition:fade><button on:click={() => ($selectedDot = null)}>close</button></p>
	</div>
{/if}

{#if isOverlayVisible}
	<div class="overlay" transition:fade={{ duration: overlayFadeDuration }}>
		<button on:click={onStartClick}>start</button>
	</div>
{/if}

<ChirpButton cooldownDuration={`${chirpCooldown}ms`} on:click={onChirpClick} disabled={!canChirp} />

<style>
	.selectedDot {
		position: absolute;
		top: 1rem;
		right: 1rem;
		left: 1rem;
		text-align: center;
		font-family: monospace;
	}

	.selectedDot ul {
		list-style: none;
		padding: 0;
		display: block;
	}

	.selectedDot li {
		display: inline-block;
	}

	.selectedDot button {
		appearance: none;
		font-family: inherit;
		background-color: var(--color-text);
		color: var(--color-bg);
		border: none;
		border-radius: 0.25em;
		font-size: var(--step--2);
		padding: 0.1em 0.5ch;
		cursor: pointer;
	}

	.selectedDot button:hover {
		opacity: 0.8;
	}

	.overlay {
		position: absolute;
		inset: 0;
		z-index: var(--layer-overlay);
		background-color: rgba(0, 0, 0, 0.8);
		display: grid;
		place-content: center;
		place-items: center;
	}

	.overlay button {
		--color: var(--color-text);

		appearance: none;
		border: 2px solid var(--color);
		background-color: transparent;
		color: var(--color);
		font-weight: 600;

		border-radius: 0.4rem;
		font-family: inherit;
		text-transform: uppercase;
		font-size: var(--step--1);
		padding: var(--step--2) var(--step-1);
		cursor: pointer;
	}

	@media (hover: hover) {
		.overlay button:hover {
			background-color: var(--color);
			color: black;
		}
	}

	.overlay button:active {
		scale: 0.97;
	}
</style>
