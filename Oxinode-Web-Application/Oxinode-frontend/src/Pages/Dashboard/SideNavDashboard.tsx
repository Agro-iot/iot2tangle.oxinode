import styled from '@emotion/styled';
import React, { FC, memo, useRef } from 'react';
import { Icon, SideNavItem } from 'react-materialize';
import { Link } from 'react-router-dom';
import { Sidenav } from 'materialize-css';
import showAlert from '../../Utils/Alert';
import { useHistory } from 'react-router-dom';

const TitleSidenav = styled.h3`
	margin: 0;
	padding-bottom: 2rem;
`;

const SideNavDashboard: FC = () => {
	const sideNavRef = useRef<HTMLUListElement>(null);
	const history = useHistory();

	const handleClose = () => {
		if (sideNavRef.current) {
			Sidenav.getInstance(sideNavRef.current).close();
		}
	};

	const handleLogOut = async () => {
		handleClose();
		await showAlert().fire({
			icon: 'question',
			title: 'Confirmar',
			text: 'Desea cerrar sesion?',
			preConfirm() {
				localStorage.removeItem('token');
				sessionStorage.removeItem('graphics');
				history.push('/Iniciar-Sesion');
			},
		});
	};

	return (
		<ul className={'sidenav'} id={'slide-dashboard'} ref={sideNavRef}>
			<li style={{ backgroundColor: '#24252a' }}>
				<div className='user-view d-flex align-items-center'>
					<TitleSidenav className='white-text'>Peru IoT4</TitleSidenav>
				</div>
			</li>
			<li>
				<Link
					to={'/Dashboard'}
					className={'waves-effect'}
					onClick={handleClose}
				>
					<Icon className={'prefix'}>memory</Icon>
					Dispositivos
				</Link>
			</li>
			<SideNavItem divider />
			<li>
				<Link to={'/Perfil'} className={'waves-effect'} onClick={handleClose}>
					<Icon className={'prefix'}>person</Icon>
					Perfil
				</Link>
			</li>
			<SideNavItem divider />
			<li>
				<Link to={'/Reglas'} className={'waves-effect'} onClick={handleClose}>
					<Icon className={'prefix'}>library_books</Icon>
					Reglas
				</Link>
			</li>
			<SideNavItem divider />
			<li>
				<Link to={'/Records'} className={'waves-effect'} onClick={handleClose}>
					<Icon className={'prefix'}>insert_chart_outline</Icon>
					Registros
				</Link>
			</li>
			<SideNavItem divider />
			<li>
				<Link
					to={'/Configuraciones'}
					className={'waves-effect'}
					onClick={handleClose}
				>
					<Icon className={'prefix'}>settings</Icon>
					Ajustes
				</Link>
			</li>
			<SideNavItem divider />
			<li>
				<Link
					to={'/Iniciar-Sesion'}
					className={'waves-effect'}
					onClick={handleLogOut}
				>
					<Icon className={'prefix'}>exit_to_app</Icon>
					Cerrar Sesion
				</Link>
			</li>

			<SideNavItem divider />
		</ul>
	);
};

export default memo(SideNavDashboard);
