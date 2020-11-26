import React, { ChangeEvent } from 'react';
import { SweetAlertResult } from 'sweetalert2';
import { IDeviceState } from '../../Redux/Reducers/Devices.reducer';
import AddRecordOptions, { IOptionRecords } from './AddRecordOptions';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
const reactSwal = withReactContent(Swal);

const showAlertAddGraphic = async (
	Devices: IDeviceState[],
	initialValues: IOptionRecords = {} as IOptionRecords,
): Promise<IOptionRecords | undefined> => {
	const values: IOptionRecords = { ...initialValues };
	const handleChange = (e: ChangeEvent<HTMLSelectElement>) => {
		values[e.target.id] = e.target.value;
	};

	const {
		value: formValues,
	}: SweetAlertResult<IOptionRecords> = await reactSwal.fire({
		title: 'Seleccionar dispositivo para agregar grafica',
		icon: 'question',
		customClass: {
			content: 'white-text',
		},
		showCancelButton: true,
		cancelButtonColor: 'red',
		html: (
			<AddRecordOptions
				initialValues={initialValues}
				Devices={Devices}
				onChange={handleChange}
			/>
		),
		preConfirm() {
			return values;
		},
	});
	return formValues;
};

export default showAlertAddGraphic;
