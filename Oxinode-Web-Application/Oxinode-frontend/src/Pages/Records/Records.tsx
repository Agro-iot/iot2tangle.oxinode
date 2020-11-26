import React, { FC, memo, Fragment, useEffect } from 'react';
import { connect, useDispatch } from 'react-redux';
import FabFullscreen from '../../Components/Buttons/FabFullscreen';
import Navbar from '../../Components/Navbar';
import useGetDevices from '../../Hooks/getDevices';
import { addGraphic } from '../../Redux/Actions/Graphics.action';
import { IDeviceState } from '../../Redux/Reducers/Devices.reducer';
import showAlert from '../../Utils/Alert';
import SideNavDashboard from '../Dashboard/SideNavDashboard';
import { Sidenav } from 'materialize-css';
import ListGraphics from './ListGraphics';
import styles from './Records.module.scss';

type IProps = {
	Devices: IDeviceState[];
};

const Records: FC<IProps> = (props) => {
	const { Devices } = props;
	useGetDevices();

	useEffect(() => {
		Sidenav.init(document.getElementById('slide-dashboard')!);
	});
	const dispatch = useDispatch();

	const handleAddGraphic = async () => {
		if (Devices.length !== 0) dispatch(addGraphic({ id: Date.now() }));
		else
			await showAlert().fire({
				title: 'Agrega un Dispositivo',
				icon: 'info',
				showCancelButton: true,
			});
	};

	return (
		<Fragment>
			<div className='navbar-fixed'>
				<Navbar title={'Registros'} sidenavTarget={'slide-dashboard'} />
			</div>

			<div
				className={`w-100 h-100 ${styles.bgRecords}`}
				style={{ paddingTop: '6rem' }}
			>
				<ListGraphics />
			</div>

			<SideNavDashboard />
			<FabFullscreen handleClick={handleAddGraphic} />
		</Fragment>
	);
};

const mapStateToProps = (state: any) => ({
	Devices: state.DevicesReducer,
});

export default connect(mapStateToProps)(memo(Records));
