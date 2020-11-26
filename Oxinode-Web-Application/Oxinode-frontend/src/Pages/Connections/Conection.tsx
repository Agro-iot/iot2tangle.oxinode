import M from 'materialize-css';
import React from 'react';
import SideNav from './SideNav';
import PageConnections from './PageConnections';
import UserProfile from '../Profile/UserProfile';
import { useHistory } from 'react-router-dom';

type IProps = {
	isAuth: boolean;
};

const Conection: React.FC<IProps> = (props) => {
	const history = useHistory();
	if (!props.isAuth) {
		history.push('/Iniciar-Sesion');
	}
	const [showConnections, setShowConnections] = React.useState<boolean>(true);

	React.useEffect(() => {
		M.Sidenav.init(document.getElementById('slide-out')!);
	});

	return (
		<>
			{showConnections ? <PageConnections /> : <UserProfile />}
			<SideNav setstate={setShowConnections} />
		</>
	);
};

export default React.memo(Conection);
