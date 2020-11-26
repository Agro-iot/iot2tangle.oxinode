import styled from '@emotion/styled';
import React from 'react';
import { Icon, SideNavItem } from 'react-materialize';

type IProps = {
	setstate: (newState: boolean) => void;
};

const BackgroundSideNav = React.memo(styled.div`
	background-color: #24252a;
`);

const SideNav: React.FC<IProps> = (props) => {
	const { setstate } = props;
	return (
		<ul id='slide-out' className='sidenav'>
			<li>
				<div className='user-view'>
					<BackgroundSideNav className='background' />
					<a>
						<img
							className='circle'
							src={
								'https://listimg.pinclipart.com/picdir/s/566-5668461_user-white-person-icon-clipart.png'
							}
						/>
					</a>
					<a>
						<span className='white-text name'>John Doe</span>
					</a>
					<a>
						<span className='white-text email'>jdandturk@gmail.com</span>
					</a>
				</div>
			</li>
			<li>
				<a className={'waves-effect'} onClick={() => setstate(false)}>
					<Icon>account_circle</Icon> Perfil
				</a>
			</li>
			<SideNavItem divider />
			<li>
				<a className={'waves-effect'} onClick={() => setstate(true)}>
					<Icon>cloud</Icon>Conexiones
				</a>
			</li>
			<SideNavItem divider />
			<SideNavItem waves>Third Link With Waves</SideNavItem>
		</ul>
	);
};

export default React.memo(SideNav);
