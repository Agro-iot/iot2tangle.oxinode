import React, { createContext, FC, memo } from 'react';
import io from 'socket.io-client';
import { env } from '../env';

const socket = io.connect(env.urlServer, {});

export const SocketsContext = createContext<SocketIOClient.Socket>(socket);

type SocketsProvider = {
	children: React.ReactElement;
};

const SocketsProvider: FC<SocketsProvider> = (props) => {
	return (
		<SocketsContext.Provider value={socket}>
			{props.children}
		</SocketsContext.Provider>
	);
};

export default memo(SocketsProvider);
