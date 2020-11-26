import { DevicesAction } from '../Actions/Devices.action';

type IDeviceBase = {
	panelName: string;
	topic: string;
	idDB: number;
	qos: string;
	id: number;
};

export interface SwitchDevice extends IDeviceBase {
	subscribeTopic?: string;
	payloadOn: string;
	payloadOff: string;
	type: 'switch';
}

export interface PulsometerDevice extends IDeviceBase {
	type: 'pulsometer';
}

export interface OximeterDevice extends IDeviceBase {
	type: 'oximeter';
}

export interface CurrentDevice extends IDeviceBase {
	type: 'current';
}

export interface GraphicDevice extends IDeviceBase {
	colorGraphic: string;
	type: 'graphic';
}

export type IDeviceState =
	| SwitchDevice
	| PulsometerDevice
	| OximeterDevice
	| CurrentDevice
	| GraphicDevice;

const DevicesReducer = (
	initialState: IDeviceState[] = [],
	action: any,
): IDeviceState[] => {
	//
	switch (action.type) {
		case DevicesAction.REMOVE:
			return initialState.filter((device) => device.id !== action.payload.id);
		case DevicesAction.EDIT:
			return initialState.map((device) => {
				if (device.id === action.payload.id) return action.payload;
				return device;
			});
		case DevicesAction.ADD:
			return [...initialState, { ...action.payload }];
		case DevicesAction.SET:
			return action.payload;
		default:
			return initialState;
	}
};

export default DevicesReducer;
