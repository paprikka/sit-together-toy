export type ClientJoinedMessage = {
	type: 'client:joined';
	//   clientID: string;
};

export type ClientLeftMessage = {
	type: 'client:left';
	//   clientID: string;
};

export type ClientBroadcastGongMessage = {
	type: 'client:gong';
	//   clientID: string;
};

export type ClientSendChirpMessage = {
	type: 'client:chirp';
	to: string;
	soundID: string;
};

export type ClientMessage =
	| ClientJoinedMessage
	| ClientLeftMessage
	| ClientBroadcastGongMessage
	| ClientSendChirpMessage;

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

export type ServerChirpMessage = {
	type: 'server:chirp';
	from: string;
	soundID: string;
};

export type ServerMessage =
	| ServerErrorMessage
	| ServerJoinConfirmedMessage
	| ServerBroadcastClientMessage
	| ServerRoomUpdateMessage
	| ServerChirpMessage;
