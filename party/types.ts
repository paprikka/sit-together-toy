export type ClientJoinedMessage = {
	type: 'client:joined';
	//   clientID: string;
};

export type ClientLeftMessage = {
	type: 'client:left';
	//   clientID: string;
};

export type ClientChirpMessage = {
	type: 'client:gong';
	//   clientID: string;
};

export type ClientMessage = ClientJoinedMessage | ClientLeftMessage | ClientChirpMessage;

export type ServerErrorMessage = {
	type: 'server:error';
	error: string;
};

export type ServerRoomUpdateMessage = {
	type: 'server:room-update';
	clients: string[];
};
export type ServerJoinConfirmedMessage = {
	type: 'server:join-confirmed';
};

export type ServerBroadcastClientMessage = {
	type: 'server:broadcast-client-message';
	message: ClientMessage;
};

export type ServerMessage =
	| ServerErrorMessage
	| ServerJoinConfirmedMessage
	| ServerBroadcastClientMessage
	| ServerRoomUpdateMessage;
