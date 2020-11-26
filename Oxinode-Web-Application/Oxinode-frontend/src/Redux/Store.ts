import { createStore, combineReducers } from 'redux';
import { ConnectionsReducer } from './Reducers/Connection.reducer';
import RulesReducer from './Reducers/RulesReducer';
import { userReducer } from './Reducers/User.reducer';
import DevicesReducer from './Reducers/Devices.reducer';
import GraphicsReducer from './Reducers/Graphics.reducer';

const reducers = combineReducers({
	ConnectionsReducer,
	userReducer,
	DevicesReducer,
	GraphicsReducer,
	RulesReducer,
});

export const store = createStore(
	reducers,
	// @ts-ignore
	window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__(),
);
