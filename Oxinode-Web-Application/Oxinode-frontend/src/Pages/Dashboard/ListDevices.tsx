import React, { FC, memo } from 'react';
import { Col, Row } from 'react-materialize';
import { connect } from 'react-redux';
import Current from '../../Components/Devices/Current';
import DropdownDevice from '../../Components/Devices/DropdownDevice';
import Graphic from '../../Components/Devices/Graphic';
import Oximeter from '../../Components/Devices/Oximeter';
import Pulsometer from '../../Components/Devices/Pulsometer';
import {
	useDownloadDevice,
	useEditDevice,
	useRemoveDevice,
} from '../../Hooks/DeviceHooks';
import useGetDevices from '../../Hooks/getDevices';
import { IDeviceState } from '../../Redux/Reducers/Devices.reducer';
import Switch from '../../Components/Devices/Switch';
import styles from './Dashboard.module.scss';

type IProps = {
	Devices: IDeviceState[];
};

export type IDeviceQuery = {
	getDevices: Array<{
		id: number;
		info: string;
	}>;
};

const ListDevices: FC<IProps> = (props) => {
	const { Devices } = props;
	useGetDevices();
	const onRemove = useRemoveDevice();
	const onEdit = useEditDevice();
	const onDownload = useDownloadDevice();

	return (
		<Row className={`${styles.listDevice}`}>
			{Devices.map((device: IDeviceState) => {
				let TemporalComponent;
				const DropDown = (
					<DropdownDevice
						idTrigger={`${device.id}`}
						handleDownload={() => onDownload(device)}
						handleRemove={() => onRemove(device)}
						handleEdit={() => onEdit(device)}
					/>
				);
				if (device.type === 'switch')
					TemporalComponent = <Switch Switch={device} dropdown={DropDown} />;
				else if (device.type === 'pulsometer')
					TemporalComponent = (
						<Pulsometer device={device} dropdown={DropDown} />
					);
				else if (device.type === 'oximeter')
					TemporalComponent = (
						<Oximeter Oximeter={device} dropdown={DropDown} />
					);
				else if (device.type === 'current')
					TemporalComponent = <Current current={device} dropdown={DropDown} />;
				else if (device.type === 'graphic')
					TemporalComponent = <Graphic graphic={device} dropdown={DropDown} />;
				if (!TemporalComponent) return null;
				return (
					<Col s={12} m={6} l={4} xl={3} key={device.id}>
						{TemporalComponent}
					</Col>
				);
			})}
		</Row>
	);
};

const mapStateToProps = (state: any) => ({
	Devices: state.DevicesReducer,
});

export default connect(mapStateToProps)(memo(ListDevices));
