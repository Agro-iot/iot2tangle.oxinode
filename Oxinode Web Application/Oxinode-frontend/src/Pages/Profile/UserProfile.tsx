import React, { FC, memo, Fragment, useEffect } from 'react';
import Navbar from '../../Components/Navbar';
import SideNavDashboard from '../Dashboard/SideNavDashboard';
import CardProfile from './CardProfile';
import styles from './UserProfile.module.scss';
import imgGirl from '../../assets/img/PageLoginImg2.svg';
import imgBoy from '../../assets/img/PageLoginImg1.svg';
import { Sidenav } from 'materialize-css';

const UserProfile: FC = (): React.ReactElement => {
	useEffect(() => {
		Sidenav.init(document.querySelector('#slide-dashboard')!);
	});

	return (
		<Fragment>
			<div className={`w-100 h-100 ${styles.container}`}>
				<div className={'p-absolute w-100'}>
					<Navbar title={'Perfil'} sidenavTarget={'slide-dashboard'} />
				</div>

				<div className={`w-100 h-100`}>
					<div className='w-100 h-100 p-relative d-flex'>
						<img src={imgBoy} className={`${styles.imgBoy} p-fixed`} alt='' />
						<img src={imgGirl} className={`${styles.imgGirl} p-fixed`} alt='' />
						<CardProfile />
					</div>
				</div>
			</div>
			<SideNavDashboard />
		</Fragment>
	);
};

export default memo(UserProfile);
