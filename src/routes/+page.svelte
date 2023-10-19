<script lang="ts">
	import { randomFromString } from '$lib/random-from-string';
	import type { ServerRoomUpdateMessage } from '../../party/types';

	import { messages, sendMessage } from './socket';

	import Dot from '$lib/components/dot.svelte';
	import type { DotState } from '$lib/dot-store';
	import { dots } from '$lib/dot-store';

	const makeDot = (clientID: string): DotState => ({
		id: clientID,
		x: 50 + (randomFromString(clientID) - 0.5) * 80,
		y: 50 + (randomFromString(clientID + 'x') - 0.5) * 80,
		status: 'entering'
	});

	messages.subscribe(($messages) => {
		const updateMessages = $messages.filter(
			(message): message is ServerRoomUpdateMessage => message.type === 'server:room-update'
		);

		if (updateMessages.length === 0) return [];

		const lastUpdate = updateMessages[updateMessages.length - 1];

		const serverClientIDs = new Set(lastUpdate.clients);
		const localClientIDs = new Set([...$dots.keys()]);

		const removedClientIDs = [...localClientIDs].filter(
			(clientID) => !serverClientIDs.has(clientID)
		);

		const newClientIDs = [...serverClientIDs].filter((clientID) => !localClientIDs.has(clientID));

		const existingClientIDs = [...localClientIDs].filter((clientID) =>
			serverClientIDs.has(clientID)
		);

		dots.update(($dots) => {
			removedClientIDs.forEach((clientID) => {
				$dots.delete(clientID);
			});

			newClientIDs.forEach((clientID) => {
				$dots.set(clientID, makeDot(clientID));
			});

			return $dots;
		});
	});
</script>

<div class="dots">
	{#each [...$dots.values()] as dot (dot.id)}
		<Dot state={dot} />
	{/each}
</div>

<!-- <Debug value={messages} /> -->

<style>
	.dots {
		position: absolute;
		inset: 0;
		transform-origin: center;
		/* animation: spin 1000s linear infinite; */
	}

	@keyframes spin {
		0% {
			transform: rotate(0deg);
		}
		100% {
			transform: rotate(360deg);
		}
	}
</style>
