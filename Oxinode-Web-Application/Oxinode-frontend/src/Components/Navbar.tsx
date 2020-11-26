import styled from '@emotion/styled';
import React from 'react';

type IProps = {
	title: string;
	sidenavTarget: string;
	children?: any;
};

const NavBar = styled.nav`
	background-color: #24252a;
`;

const Navbar: React.FC<IProps> = (props): React.ReactElement => {
	const { children, title, sidenavTarget } = props;
	return (
		<NavBar>
			<div className='nav-wrapper'>
				<a
					href='#'
					data-target={sidenavTarget}
					className='sidenav-trigger show-on-large'
				>
					<i className='material-icons'>menu</i>
				</a>
				<a className='brand-logo'>{title}</a>
				{children}
			</div>
		</NavBar>
	);
};

export default React.memo(Navbar);
