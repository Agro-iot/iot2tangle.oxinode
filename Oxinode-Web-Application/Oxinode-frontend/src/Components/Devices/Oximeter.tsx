import { faLungs } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { FC, memo, ReactElement } from 'react';
import useGetDataDevice from '../../Hooks/useGetDataDevice';
import styles from '../../Pages/Dashboard/Dashboard.module.scss';
import { OximeterDevice } from '../../Redux/Reducers/Devices.reducer';
import FooterDevice from './FooterDevice';
import TitleDevice from './TitleDevice';

type IProps = {
	Oximeter: OximeterDevice;
	dropdown: ReactElement;
};

const Oximeter: FC<IProps> = (props) => {
	const { Oximeter } = props;
	const [state] = useGetDataDevice(Oximeter.topic);

	return (
		<div className={`card ${styles.deviceCard} p-relative`}>
			<TitleDevice className={'p-absolute'}>{Oximeter.panelName}</TitleDevice>
			<FontAwesomeIcon
				className='p-absolute'
				style={{ left: '50%', top: '50%', transform: 'translate(-50%,-50%)' }}
				icon={faLungs}
				color={'#EA899A'}
				size={'6x'}
			/>
			<FooterDevice className={`p-absolute`}>{state}</FooterDevice>

			{props.dropdown}
		</div>
	);
};

export default memo(Oximeter);
