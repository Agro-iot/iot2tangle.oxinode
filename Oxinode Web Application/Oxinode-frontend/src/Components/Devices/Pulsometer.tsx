import React, { FC, memo, ReactElement } from 'react';
import useGetDataDevice from '../../Hooks/useGetDataDevice';
import styles from '../../Pages/Dashboard/Dashboard.module.scss';
import { PulsometerDevice } from '../../Redux/Reducers/Devices.reducer';
import { faHeartbeat } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import FooterDevice from './FooterDevice';
import TitleDevice from './TitleDevice';

type IProps = {
	device: PulsometerDevice;
	dropdown: ReactElement;
};

const Pulsometer: FC<IProps> = (props) => {
	const { device } = props;
	const [state] = useGetDataDevice(device.topic);

	return (
		<div className={`card ${styles.deviceCard} p-relative`}>
			<TitleDevice className={'p-absolute'}>{device.panelName}</TitleDevice>
			<FontAwesomeIcon
				className='p-absolute'
				style={{ left: '50%', top: '50%', transform: 'translate(-50%,-50%)' }}
				icon={faHeartbeat}
				color={'red'}
				size={'6x'}
			/>
			<FooterDevice className={`p-absolute`}>{state}</FooterDevice>
			{props.dropdown}
		</div>
	);
};

export default memo(Pulsometer);
