import React, { ChangeEvent, Fragment } from 'react';
import { Row, TextInput } from 'react-materialize';
import {
	CurrentDevice,
	GraphicDevice,
	IDeviceState,
	OximeterDevice,
	PulsometerDevice,
	SwitchDevice,
} from '../../Redux/Reducers/Devices.reducer';
import Swal, { SweetAlertResult } from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
const reactSwal = withReactContent(Swal);

const HTMLSwitch = (
	initialValues: SwitchDevice,
	handleChange: (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void,
) => {
	return (
		<Fragment>
			<Row>
				<TextInput
					s={12}
					onChange={handleChange}
					defaultValue={initialValues.panelName}
					label={'Nombre del panel'}
					id={'panelName'}
				/>
			</Row>
			<Row>
				<TextInput
					s={12}
					onChange={handleChange}
					defaultValue={initialValues.topic}
					label={'Topico'}
					id={'topic'}
				/>
			</Row>
			<Row>
				<TextInput
					s={12}
					onChange={handleChange}
					defaultValue={initialValues.subscribeTopic}
					label={'Subscribe Topic'}
					id={'subscribeTopic'}
				/>
			</Row>
			<Row>
				<TextInput
					s={12}
					onChange={handleChange}
					defaultValue={initialValues.payloadOn}
					label={'Payload On'}
					id={'payloadOn'}
				/>
			</Row>
			<Row>
				<TextInput
					s={12}
					onChange={handleChange}
					defaultValue={initialValues.payloadOff}
					label={'Payload Off'}
					id={'payloadOff'}
				/>
			</Row>
			<Row>
				<select
					onChange={handleChange}
					placeholder={'QoS'}
					id={'qos'}
					className='swal2-input swal2-select'
				>
					<option value='0'>0</option>
					<option value='1'>1</option>
					<option value='2'>2</option>
				</select>
			</Row>
		</Fragment>
	);
};

const HTMLPulsometer = (
	initialValues: PulsometerDevice,
	handleChange: (e: ChangeEvent<HTMLInputElement>) => void,
) => {
	return (
		<Fragment>
			<Row>
				<TextInput
					onChange={handleChange}
					defaultValue={initialValues.panelName}
					label={'Panel Name'}
					id={'panelName'}
					s={12}
				/>
			</Row>
			<Row>
				<TextInput
					onChange={handleChange}
					defaultValue={initialValues.topic}
					label={'Topico'}
					id={'topic'}
					s={12}
				/>
			</Row>
		</Fragment>
	);
};

const HTMLOximeter = (
	initialValues: OximeterDevice,
	handleChange: (e: ChangeEvent<HTMLInputElement>) => void,
) => {
	return (
		<Fragment>
			<Row>
				<TextInput
					onChange={handleChange}
					defaultValue={initialValues.panelName}
					label={'Panel Name'}
					id={'panelName'}
					s={12}
				/>
			</Row>
			<Row>
				<TextInput
					onChange={handleChange}
					defaultValue={initialValues.topic}
					label={'Topico'}
					id={'topic'}
					s={12}
				/>
			</Row>
		</Fragment>
	);
};

const HTMLCurrent = (
	initialValues: CurrentDevice,
	handleChange: (e: ChangeEvent<HTMLInputElement>) => void,
) => {
	return (
		<Fragment>
			<Row>
				<TextInput
					onChange={handleChange}
					defaultValue={initialValues.panelName}
					label={'Panel Name'}
					id={'panelName'}
					s={12}
				/>
			</Row>
			<Row>
				<TextInput
					onChange={handleChange}
					defaultValue={initialValues.topic}
					label={'Topico'}
					id={'topic'}
					s={12}
				/>
			</Row>
		</Fragment>
	);
};

const HTMLGraphic = (
	initialValues: GraphicDevice,
	handleChange: (e: ChangeEvent<HTMLInputElement>) => void,
) => {
	return (
		<Fragment>
			<Row>
				<TextInput
					onChange={handleChange}
					defaultValue={initialValues.panelName}
					label={'Panel Name'}
					id={'panelName'}
					s={12}
				/>
			</Row>
			<Row>
				<TextInput
					onChange={handleChange}
					defaultValue={initialValues.topic}
					label={'Topico'}
					id={'topic'}
					s={12}
				/>
			</Row>
			<Row>
				<TextInput
					onChange={handleChange}
					defaultValue={initialValues.colorGraphic}
					label={'Color'}
					id={'colorGraphic'}
					s={12}
				/>
			</Row>
		</Fragment>
	);
};

export const showEdit = async (initialValues: IDeviceState): Promise<any> => {
	//
	if (!initialValues.id) {
		initialValues.id = Date.now();
	}
	const values: IDeviceState = { ...initialValues };
	const handleChange = (
		e: ChangeEvent<HTMLInputElement | HTMLSelectElement>,
	) => {
		// eslint-disable-next-line @typescript-eslint/ban-ts-comment
		// @ts-ignore
		values[e.target.id] = e.target.value;
	};

	let TemporalComponent;
	if (values.type === 'switch')
		TemporalComponent = HTMLSwitch(initialValues as SwitchDevice, handleChange);
	else if (values.type === 'pulsometer')
		TemporalComponent = HTMLPulsometer(
			initialValues as PulsometerDevice,
			handleChange,
		);
	else if (values.type === 'oximeter')
		TemporalComponent = HTMLOximeter(
			initialValues as OximeterDevice,
			handleChange,
		);
	else if (values.type === 'current')
		TemporalComponent = HTMLCurrent(
			initialValues as CurrentDevice,
			handleChange,
		);
	else if (values.type === 'graphic')
		TemporalComponent = HTMLGraphic(
			initialValues as GraphicDevice,
			handleChange,
		);

	const { value: formValues }: SweetAlertResult = await reactSwal.fire({
		preConfirm() {
			return values;
		},
		showCancelButton: true,
		cancelButtonColor: 'red',
		html: TemporalComponent,
	});
	return formValues;
};
