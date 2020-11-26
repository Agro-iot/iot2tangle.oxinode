import { formModalValues } from '../../Components/Settings Connection/showModalSettingsConnection';
import { ActionsConnection } from '../Actions/Actions';

type IAddConnection = {
	type: string;
	payload: formModalValues | formModalValues[];
};

const initialValues: formModalValues = {
	connectAuto: false,
	clientId: '1222',
	username: 'Sweet',
	timeout: '60',
	password: 'Hola1234',
	keepAlive: '60',
	connectionName: 'Chuchas',
	notify: true,
	port: '9090',
	protocol: 'TCP',
	webAddress: 'www.peru-iot4.com',
	id: '1212',
};

export const ConnectionsReducer = (
	state: Array<formModalValues> = [{ ...initialValues }],
	action: IAddConnection,
): Array<formModalValues> => {
	switch (action.type) {
		case ActionsConnection.ADD:
			return [...state, { ...(action.payload as formModalValues) }];
		case ActionsConnection.REMOVE:
			return state.filter(
				// @ts-ignore
				(connection: formModalValues) => connection.id !== action.payload.id,
			);
		case ActionsConnection.EDIT:
			const newConnections = state.map((connection) => {
				// @ts-ignore
				if (connection.id === action.payload.id) {
					return action.payload;
				}
				return connection;
			});
			// @ts-ignore
			return newConnections.slice();
		case ActionsConnection.SET:
			return action.payload as formModalValues[];
		default:
			return state;
	}
};
