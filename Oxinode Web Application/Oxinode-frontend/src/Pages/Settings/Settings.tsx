import { Sidenav } from 'materialize-css';
import React, { FC, Fragment, memo, useEffect } from 'react';
import Navbar from '../../Components/Navbar';
import SettingsTelegram from '../../Components/Settings/SettingsTelegram';
import SideNavDashboard from '../Dashboard/SideNavDashboard';
import styles from './Settings.module.scss';

const Settings: FC = () => {
	useEffect(() => {
		Sidenav.init(document.getElementById('slide-dashboard')!);
	}, []);

	return (
		<Fragment>
			<div className={`w-100 h-100s ${styles.bg}`}>
				<Navbar title={'Configuraciones'} sidenavTarget={'slide-dashboard'} />
				<SettingsTelegram />
			</div>
			<SideNavDashboard />
		</Fragment>
	);
};

export default memo(Settings);
