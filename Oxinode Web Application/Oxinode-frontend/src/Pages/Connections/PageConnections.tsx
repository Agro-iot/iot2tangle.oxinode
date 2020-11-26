import { useQuery } from '@apollo/client';
import React, { useCallback, useEffect } from 'react';
import { Row } from 'react-materialize';
import { connect, useDispatch } from 'react-redux';
import FabFullscreen from '../../Components/Buttons/FabFullscreen';
import Navbar from '../../Components/Navbar';
import ShowModalSettingsConnection, {
	formModalValues,
} from '../../Components/Settings Connection/showModalSettingsConnection';
import { Query } from '../../GraphQL/QueryMutation';
import { addConnection, setConnections } from '../../Redux/Actions/Actions';
import showAlert from '../../Utils/Alert';
import CardConnection from './CardConnection';
import './Connection.scss';

type IProps = {
	Connections: Array<formModalValues>;
};

const PageConnections: React.FC<IProps> = (props) => {
	const { Connections } = props;
	const dispatch = useDispatch();
	const { data } = useQuery<{ getConnections: formModalValues[] }>(
		Query.getConnections,
	);

	useEffect(() => {
		//
		if (data) {
			// console.log(data.getConnections);
			dispatch(setConnections(data.getConnections));
			setConnections(data.getConnections);
		}
	}, [data, dispatch]);

	const showConfirm = useCallback(() => {
		showAlert().fire({
			title: 'Confirmar',
			text: '¿Desea agregar una nueva conexión?',
			icon: 'question',
			async preConfirm() {
				const formValues = await ShowModalSettingsConnection();
				if (formValues) {
					dispatch(addConnection({ ...formValues }));
				}
			},
		});
	}, [dispatch]);

	return (
		<>
			<div className='bg-connection h-100 w-100 p-fixed overflow-y-auto'>
				<div className='connection-wrapper w-100 h-100 overflow-y-auto p-fixed'>
					<Navbar sidenavTarget={'slide-out'} title={'Conexiones'} />
					<Row className='card-connections'>
						{Connections.map((value: formModalValues) => (
							<CardConnection
								username={value.username}
								nameConnection={value.connectionName}
								key={value.id}
								idConnection={value.id}
							/>
						))}
					</Row>
				</div>
			</div>

			<FabFullscreen handleClick={showConfirm} id={'fab-connection'} />
		</>
	);
};

const mapStateToProps = (state: any) => ({
	Connections: state.ConnectionsReducer,
});

export default connect(mapStateToProps)(React.memo(PageConnections));
