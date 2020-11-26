import { useQuery } from '@apollo/client';
import { useEffect } from 'react';
import { Query } from '../GraphQL/QueryMutation';
import { IDeviceQuery } from '../Pages/Dashboard/ListDevices';
import { setDevices } from '../Redux/Actions/Devices.action';
import { useDispatch } from 'react-redux';
import { IDeviceState } from '../Redux/Reducers/Devices.reducer';

const useGetDevices = (): void => {
	const { data } = useQuery<IDeviceQuery>(Query.getDevices);
	const dispatch = useDispatch();
	useEffect(() => {
		if (data) {
			setDevices([]);
			const allDevices: IDeviceState[] = [];
			for (const device of data.getDevices) {
				const temporalDevice = JSON.parse(device.info);
				temporalDevice.idDB = device.id;
				allDevices.push(temporalDevice);
			}
			dispatch(setDevices(allDevices));
		}
	}, [data, dispatch]);
};

export default useGetDevices;
