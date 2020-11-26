import { IDeviceState } from '../Reducers/Devices.reducer';

export const DevicesAction = {
	REMOVE: 'REMOVE_DEVICE',
	EDIT: 'EDIT_DEVICE',
	ADD: 'ADD_DEVICE',
	SET: 'SET_DEVICE',
};

export const removeDevice = (id: number) => ({
	type: DevicesAction.REMOVE,
	payload: { id },
});

export const editDevice = (device: any) => ({
	type: DevicesAction.EDIT,
	payload: device,
});

export const addDevice = (device: any) => ({
	type: DevicesAction.ADD,
	payload: device,
});

export const setDevices = (devices: IDeviceState[]) => ({
	type: DevicesAction.SET,
	payload: devices,
});
