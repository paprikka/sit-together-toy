import PartySocket from 'partysocket';
import { writable } from 'svelte/store';
import type { ClientMessage, ServerMessage } from '../../party/types';

const socket = new PartySocket({
	host: 'localhost:1999',
	room: 'shared'
});

export const messages = writable<ServerMessage[]>([]);

socket.onmessage = (event) => {
	try {
		const data: ServerMessage = JSON.parse(event.data);
		messages.update((value) => [...value, data]);
	} catch {
		console.warn('invalid message', event.data);
	}
};

export const sendMessage = (message: ClientMessage) => {
	socket.send(JSON.stringify(message));
};
