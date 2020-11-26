import {
	faBolt,
	faChartLine,
	faHeartbeat,
	faLungs,
	faToggleOn,
} from '@fortawesome/free-solid-svg-icons';
import M from 'materialize-css';
import Waves from 'node-waves';
import React, { memo, useContext, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import Fab from '../../Components/Buttons/FAB';
import FabFullscreen from '../../Components/Buttons/FabFullscreen';
import Navbar from '../../Components/Navbar';
import { SocketsContext } from '../../Hooks/SocketsProvider';
import { addDevice } from '../../Redux/Actions/Devices.action';
import { IDeviceState } from '../../Redux/Reducers/Devices.reducer';
import { Toast } from '../../Utils/Toast';
import ListDevices from './ListDevices';
import ModalFabOption from './ModalFABOption';
import { showEdit } from './ShowEditComponents';
import SideNavDashboard from './SideNavDashboard';

const ReactSwal = withReactContent(Swal);

const Dashboard: React.FC = (): React.ReactElement => {
	useEffect(() => {
		M.Sidenav.init(document.querySelectorAll('.sidenav'));
		Waves.attach('.waves-effect', ['waves-effect', 'waves-light']);
	}, []);
	const [stateConnection, setStateConnection] = useState<boolean>(false);
	const dispatch = useDispatch();
	const io = useContext(SocketsContext);

	const setConnection = React.useCallback(() => {
		setStateConnection(!stateConnection);
		Toast.fire({
			title: !stateConnection ? 'Conectado' : 'Desconectado',
			position: 'top-left',
		});
	}, [stateConnection]);

	useEffect(() => {
		const addDeviceHandler = (data) => {
			if (data.error) {
				Toast.fire({
					title: 'Ha ocurrido un error',
					position: 'top-left',
				});
			} else {
				Toast.fire({
					title: 'Dispositivo agregado',
					position: 'top-left',
				});
				console.log(data);
				dispatch(addDevice(data.data));
			}
		};
		io.on('responseAddDevice', addDeviceHandler);

		return () => {
			io.removeListener('responseAddDevice', addDeviceHandler);
		};
	}, [dispatch, io]);

	const handleAddDevice = async (
		type: 'oximeter' | 'pulsometer' | 'switch' | 'current' | 'graphic',
	) => {
		const newDevice = await showEdit({ type } as IDeviceState);
		if (newDevice) {
			io.emit('addDevice', {
				token: localStorage.getItem('token'),
				info: newDevice,
			});
		}
	};

	const handleClickFAB = async () => {
		await ReactSwal.fire({
			html: (
				<div className={'white-text'}>
					<ModalFabOption
						label={'Switch'}
						icon={faToggleOn}
						handleClick={() => handleAddDevice('switch')}
					/>
					<ModalFabOption
						label={'Pulsimetro'}
						icon={faHeartbeat}
						handleClick={() => handleAddDevice('pulsometer')}
					/>
					<ModalFabOption
						label={'Oximetro'}
						icon={faLungs}
						handleClick={() => handleAddDevice('oximeter')}
					/>
					<ModalFabOption
						label={'Grafica'}
						icon={faChartLine}
						handleClick={() => handleAddDevice('graphic')}
					/>
					<ModalFabOption
						label={'Corriente'}
						icon={faBolt}
						handleClick={() => handleAddDevice('current')}
					/>
				</div>
			),
			title: <p className={'white-text'}>Seleccionar panel para añadir</p>,
			onOpen() {
				Waves.attach('.waves-effect', ['waves-effect', 'waves-light']);
			},
		});
	};

	return (
		<div style={{ backgroundColor: '#f2faf5' }} className={'w-100 h-100'}>
			<div className='navbar-fixed'>
				<Navbar title={'Dispositivos'} sidenavTarget={'slide-dashboard'}>
					<ul id='nav-mobile' className='right hide-on-med-and-down'>
						<li>
							<Fab
								icon={stateConnection ? 'cloud' : 'cloud_off'}
								className={'btn-large'}
								color={stateConnection ? 'green' : 'red'}
								onClick={setConnection}
							/>
						</li>
					</ul>
				</Navbar>
			</div>
			<ListDevices />
			<SideNavDashboard />
			<FabFullscreen handleClick={handleClickFAB} />
		</div>
	);
};

export default memo(Dashboard);
