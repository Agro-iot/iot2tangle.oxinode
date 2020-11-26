import React, { ChangeEvent } from 'react';
import Swal, { SweetAlertResult } from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import EditProfile from './EditProfile';
const reactSwal = withReactContent(Swal);

export type IProfileValues = {
	name: string;
	lastname: string;
	password?: string;
	oldPassword?: string;
	direction: string;
};

export const showEditProfile = async (
	initialValues: IProfileValues = {} as IProfileValues,
): Promise<IProfileValues | undefined> => {
	//
	const values: IProfileValues = { ...initialValues };

	const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
		// @ts-ignore
		values[e.target.id] = e.target.value;
	};

	const {
		value: formValues,
	}: SweetAlertResult<IProfileValues> = await reactSwal.fire({
		title: 'Editar',
		html: <EditProfile initialValues={initialValues} onChange={handleChange} />,
		preConfirm() {
			return values;
		},
	});
	return formValues;
};
