import M from 'materialize-css';
import React, { ChangeEvent } from 'react';
import Swal, { SweetAlertResult } from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import ModalSettingsConnection from './ModalSettingsConnection';

const reactSwal = withReactContent(Swal);

export type formModalValues = {
	username: string;
	connectionName: string;
	password: string;
	connectAuto: boolean;
	notify: boolean;
	id: string;
	[key: string]: string | boolean;
};

const ShowModalSettingsConnection = async (
	initialValues: formModalValues = {
		connectionName: '',
		username: '',
		notify: false,
		password: '',
		connectAuto: false,
		id: (Math.random() * 10000).toString(),
	},
): Promise<formModalValues | undefined> => {
	const values = { ...initialValues } as formModalValues;

	const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
		if (e.target.type === 'checkbox') {
			values[e.target.id] = e.target.checked;
		} else {
			values[e.target.id] = e.target.value;
		}
	};

	const {
		value: formValues,
	}: SweetAlertResult<formModalValues> = await reactSwal.fire({
		title: <p className='white-text'>Ajustes</p>,
		html: (
			<ModalSettingsConnection
				initialValues={initialValues}
				handleChange={handleChange}
			/>
		),
		showCancelButton: true,
		confirmButtonColor: '#2BBBAD',
		cancelButtonColor: 'red',
		confirmButtonText: 'Save',
		cancelButtonText: 'Cancel',
		onOpen(): void {
			M.updateTextFields();
		},
		preConfirm(): formModalValues {
			return values;
		},
	});

	return formValues;
};

export default ShowModalSettingsConnection;
