import React, { FC, memo, ReactElement, useState } from 'react';
import { Button } from 'react-materialize';
import { SwitchDevice } from '../../Redux/Reducers/Devices.reducer';
import styles from '../../Pages/Dashboard/Dashboard.module.scss';
import FooterDevice from './FooterDevice';
import TitleDevice from './TitleDevice';

type IProps = {
	Switch: SwitchDevice;
	dropdown: ReactElement;
};

const Switch: FC<IProps> = (props) => {
	const { Switch } = props;
	const [on, setOn] = useState(false);

	const handleClick = () => {
		setOn(!on);
	};

	return (
		<div className={`card ${styles.deviceCard} p-relative`}>
			<TitleDevice className={'p-absolute'}>{Switch.panelName}</TitleDevice>
			<Button
				onClick={handleClick}
				waves={'light'}
				floating
				className={`${styles.switchButton} ${
					on ? '' : styles.colorPerla
				} p-absolute`}
			>
				<i
					className={`material-icons`}
					style={{
						color: on ? 'white' : 'red',
					}}
				>
					power_settings_new
				</i>
			</Button>
			<FooterDevice className={`p-absolute`}>On</FooterDevice>

			{props.dropdown}
		</div>
	);
};

export default memo(Switch);
