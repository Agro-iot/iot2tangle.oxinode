import { faBolt } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { FC, memo, ReactElement } from 'react';
import useGetDataDevice from '../../Hooks/useGetDataDevice';
import styles from '../../Pages/Dashboard/Dashboard.module.scss';
import { CurrentDevice } from '../../Redux/Reducers/Devices.reducer';
import FooterDevice from './FooterDevice';
import TitleDevice from './TitleDevice';

type IProps = {
	current: CurrentDevice;
	dropdown: ReactElement;
};

const Current: FC<IProps> = (props) => {
	const { current } = props;
	const [state] = useGetDataDevice(current.topic);

	return (
		<div className={`card ${styles.deviceCard} p-relative`}>
			<TitleDevice className={'p-absolute'}>{current.panelName}</TitleDevice>
			<FontAwesomeIcon
				className='p-absolute'
				style={{ left: '50%', top: '50%', transform: 'translate(-50%,-50%)' }}
				icon={faBolt}
				color={'#FFFF00'}
				size={'6x'}
			/>
			<FooterDevice className={`p-absolute`}>{state}</FooterDevice>

			{props.dropdown}
		</div>
	);
};

export default memo(Current);
