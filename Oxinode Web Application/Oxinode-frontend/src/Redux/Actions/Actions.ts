import { formModalValues } from '../../Components/Settings Connection/showModalSettingsConnection';

const ADD = 'ADD_CONNECTION';
const EDIT = 'EDIT_USERXD';
const REMOVE = 'REMOVE';
const OBTAIN_IS_LOGGED = 'CHECK_IS_lOGGED';
const SET_AUTH = 'SET_AUTH';
const SET = 'SET';

export const ActionsConnection = {
	ADD,
	EDIT,
	REMOVE,
	OBTAIN_IS_LOGGED,
	SET_AUTH,
	SET,
};

type IActions = {
	type: string;
	payload: formModalValues;
};

export const addConnection = (connection: formModalValues): IActions => ({
	type: ADD,
	payload: connection,
});

export const obtainIsLogged = () => ({
	type: OBTAIN_IS_LOGGED,
});

export const setAuth = (state: boolean) => ({
	type: SET_AUTH,
	payload: state,
});

export const setConnections = (e: formModalValues[]) => ({
	type: SET,
	payload: e,
});
