import { Server, routePartykitRequest, type Connection, type ConnectionContext } from 'partyserver';
import {
	ClientMessage,
	ServerBroadcastClientMessage,
	ServerChirpMessage,
	ServerMessage,
	ServerRoomUpdateMessage
} from './types';

type Env = { Main: DurableObjectNamespace<Main> };

// Binding name `Main` becomes party `main` in the URL, which is what partysocket
// sends by default. Rename it and every client breaks.
export class Main extends Server<Env> {
	// Idle sitters keep sockets open for hours. Without hibernation each one
	// burns free-tier GB-s the whole time.
	static options = { hibernate: true };

	sendMessage(conn: Connection, message: ServerMessage | ClientMessage) {
		conn.send(JSON.stringify(message));
	}

	broadcastRoomUpdate() {
		this.broadcast(
			JSON.stringify({
				type: 'server:room-update',
				clients: [...this.getConnections()].map((conn) => conn.id)
			} as ServerRoomUpdateMessage)
		);
	}

	onConnect(conn: Connection, ctx: ConnectionContext) {
		console.log('Connected', {
			id: conn.id,
			room: this.name,
			url: new URL(ctx.request.url).pathname
		});

		this.sendMessage(conn, { type: 'server:join-confirmed' });
		this.broadcastRoomUpdate();
	}

	onMessage(sender: Connection, message: string | ArrayBuffer | ArrayBufferView) {
		if (typeof message !== 'string') return;

		console.log(`connection ${sender.id} sent message: ${message}`);

		const parsed = JSON.parse(message);

		if (parsed.type === 'client:chirp') {
			const chirp: ServerChirpMessage = {
				type: 'server:chirp',
				from: sender.id,
				soundID: parsed.soundID
			};

			const toConnection = this.getConnection(parsed.to);
			if (!toConnection) {
				console.warn(`Cannot find connection with id ${parsed.to}.`);
				return;
			}

			this.sendMessage(toConnection, chirp);
			return;
		}

		this.broadcast(
			JSON.stringify({
				type: 'server:broadcast-client-message',
				message: parsed
			} as ServerBroadcastClientMessage),
			[sender.id]
		);
	}

	onClose(connection: Connection) {
		console.log('Closed', connection.id);
		this.broadcastRoomUpdate();
	}
}

export default {
	fetch: async (req: Request, env: Env) =>
		(await routePartykitRequest(req, env)) ?? new Response('Not found', { status: 404 })
};
