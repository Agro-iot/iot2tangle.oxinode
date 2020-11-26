import { useMutation } from '@apollo/client';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { env } from '../env';
import { Mutation } from '../GraphQL/QueryMutation';
import { showEdit } from '../Pages/Dashboard/ShowEditComponents';
import { editDevice, removeDevice } from '../Redux/Actions/Devices.action';
import { IDeviceState } from '../Redux/Reducers/Devices.reducer';
import showAlert from '../Utils/Alert';

export const useEditDevice = () => {
	const dispatch = useDispatch();
	const [addMutationDevice] = useMutation(Mutation.editDevice);

	return async (device: IDeviceState) => {
		const values = await showEdit(device);
		if (values) {
			await addMutationDevice({
				variables: {
					info: JSON.stringify(values),
				},
			});
			await dispatch(editDevice(values));
		}
	};
};

export const useRemoveDevice = () => {
	const dispatch = useDispatch();
	const [deleteDeviceMutation] = useMutation(Mutation.removeDevice);
	return async (device: IDeviceState) => {
		await showAlert().fire({
			cancelButtonColor: 'red',
			showCancelButton: true,
			icon: 'question',
			title: 'Confirmar',
			text: 'Desea eliminar este dispositivo?',
			async preConfirm() {
				await deleteDeviceMutation({
					variables: {
						idDB: device.idDB,
					},
				});
				await dispatch(removeDevice(device.id));
			},
		});
	};
};

export const useDownloadDevice = () => {
	return async (device: IDeviceState) => {
		await showAlert().fire({
			cancelButtonColor: 'red',
			showCancelButton: true,
			icon: 'question',
			title: 'Confirmar',
			text: 'Desea descargar los datos de este dispositivo?',
			async preConfirm() {
				const response = await axios.post(
					`${env.urlServer}/data/download`,
					{
						token: localStorage.getItem('token'),
						topic: device.topic,
						id: device.idDB,
					},
					{
						responseType: 'blob',
					},
				);
				const data = new Blob([response.data], {
					type: 'text/csv',
				});
				const csvURL = (window.URL || window.webkitURL).createObjectURL(data);
				const tempLink = document.createElement('a');
				tempLink.href = csvURL;
				tempLink.download = `${device.panelName}.csv`;
				tempLink.click();
			},
		});
	};
};
