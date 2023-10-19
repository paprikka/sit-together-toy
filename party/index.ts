import type * as Party from "partykit/server";
import {
  ClientMessage,
  ServerBroadcastClientMessage,
  ServerMessage,
  ServerRoomUpdateMessage,
} from "./types";

export default class Server implements Party.Server {
  constructor(readonly party: Party.Party) {}

  sendMessage(conn: Party.Connection, message: ServerMessage | ClientMessage) {
    conn.send(JSON.stringify(message));
  }

  onConnect(conn: Party.Connection, ctx: Party.ConnectionContext) {
    // A websocket just connected!
    console.log("Connected", {
      id: conn.id,
      room: this.party.id,
      url: new URL(ctx.request.url).pathname,
    });

    this.sendMessage(conn, { type: "server:join-confirmed" });
    this.party.broadcast(
      JSON.stringify({
        type: "server:room-update",
        clients: [...this.party.getConnections()].map((conn) => conn.id),
      } as ServerRoomUpdateMessage)
    );
  }

  onMessage(message: string, sender: Party.Connection) {
    // let's log the message
    console.log(`connection ${sender.id} sent message: ${message}`);
    // as well as broadcast it to all the other connections in the room...
    this.party.broadcast(
      JSON.stringify({
        type: "server:broadcast-client-message",
        message: JSON.parse(message),
      } as ServerBroadcastClientMessage),
      // []
      // ...except for the connection it came from
      [sender.id]
    );
  }

  onClose(connection: Party.Connection<unknown>): void | Promise<void> {
    console.log("Closed", connection.id);
    this.party.broadcast(
      JSON.stringify({
        type: "server:room-update",
        clients: [...this.party.getConnections()].map((conn) => conn.id),
      } as ServerRoomUpdateMessage)
    );
  }
}

Server satisfies Party.Worker;
