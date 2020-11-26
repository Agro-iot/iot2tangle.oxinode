import React, { ChangeEvent, FC, Fragment, memo, useState } from 'react';
import { Col, Row } from 'react-materialize';
import { IDeviceState } from '../../Redux/Reducers/Devices.reducer';
import { daysArray, hours, months, years } from '../../Utils/DateUtils';
import isYearBisiesto from '../../Utils/IsYearBisiesto';

export type IOptionRecords = {
	year: string;
	month: string;
	day: string;
	topic: string;
	hour: string;
	[key: string]: string;
};

type IProps = {
	Devices: IDeviceState[];
	initialValues: IOptionRecords;
	onChange?(e: ChangeEvent<HTMLSelectElement>): void;
};

const AddRecordOptions: FC<IProps> = (props) => {
	const { Devices, initialValues, onChange } = props;
	const [days, setDays] = useState<Array<number>>([]);
	const [month, setMonth] = useState(0);
	const [year, setYear] = useState(2020);

	const monthHandleChange = (e: ChangeEvent<HTMLSelectElement>) => {
		onChange?.(e);
		setMonth(parseInt(e.target.value));
		if (month === 3 || month === 5 || month === 8 || month === 10) {
			setDays(daysArray.slice(0, 30));
		} else if (month === 1) {
			setDays(daysArray.slice(0, isYearBisiesto(year) ? 29 : 28));
		} else {
			setDays(daysArray);
		}
	};

	const handleChangeYear = (e: ChangeEvent<HTMLSelectElement>) => {
		onChange?.(e);
		setYear(parseInt(e.target.value));
		if (month === 1) {
			setDays(daysArray.slice(0, isYearBisiesto(year) ? 29 : 28));
		}
	};

	return (
		<Fragment>
			<Row>
				<Col s={12}>
					<select
						id={'topic'}
						className='browser-default'
						defaultValue={initialValues.topic}
						onChange={onChange}
					>
						<option value={''} hidden>
							-- Dispositivo ---
						</option>
						{Devices.map((device: IDeviceState) => {
							if (device.type === 'graphic') {
								return null;
							}
							return (
								<option value={device.topic} key={device.idDB}>
									{device.panelName}
								</option>
							);
						})}
					</select>
				</Col>
			</Row>
			<Row>
				<Col s={6}>
					<select
						id='year'
						className={'browser-default'}
						onChange={handleChangeYear}
						defaultValue={initialValues.year}
					>
						<option value={''} hidden>
							-- Año ---
						</option>
						{years.map((year) => (
							<option value={year} key={year}>
								{year}
							</option>
						))}
					</select>
				</Col>
				<Col s={6}>
					<select
						id='month'
						className={'browser-default'}
						onChange={monthHandleChange}
						defaultValue={initialValues.month}
					>
						<option value={''} hidden>
							-- Mes ---
						</option>
						{months.map((value, index) => (
							<option value={index} key={index}>
								{value}
							</option>
						))}
					</select>
				</Col>
			</Row>
			<Row>
				<Col s={6}>
					<select
						id='day'
						className={'browser-default'}
						onChange={onChange}
						defaultValue={initialValues.day}
					>
						<option value={''} hidden>
							-- Dia ---
						</option>
						{days.map((day) => (
							<option value={day} key={day}>
								{day}
							</option>
						))}
					</select>
				</Col>
				<Col s={6}>
					<select
						id='hour'
						className={'browser-default'}
						onChange={onChange}
						defaultValue={initialValues.hour}
					>
						<option value={''} hidden>
							-- Hora ---
						</option>
						{hours.map((hour) => (
							<option value={hour} key={hour}>
								{hour} hrs
							</option>
						))}
					</select>
				</Col>
			</Row>
		</Fragment>
	);
};

export default memo(AddRecordOptions);
