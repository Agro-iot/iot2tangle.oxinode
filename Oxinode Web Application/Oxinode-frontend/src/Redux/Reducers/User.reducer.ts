import { ActionsConnection } from '../Actions/Actions';

export const userReducer = (
	state = false,
	action: { type: string; payload: any },
) => {
	switch (action.type) {
		case ActionsConnection.SET_AUTH:
			state = action.payload;
			return state;
		default:
			return state;
	}
};
