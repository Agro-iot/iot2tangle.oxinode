import React, { useCallback, useState } from 'react';
import { Button, Card, Col, Icon } from 'react-materialize';
import { connect, useDispatch } from 'react-redux';
import ShowModalSettingsConnection, {
	formModalValues,
} from '../../Components/Settings Connection/showModalSettingsConnection';
import showAlert from '../../Utils/Alert';
import { Toast } from '../../Utils/Toast';
import { useHistory } from 'react-router-dom';

type IProps = {
	username: string;
	nameConnection: string;
	idConnection: string;
	Connections: Array<formModalValues>;
};

const CardConnection: React.FC<IProps> = (props): React.ReactElement => {
	const { nameConnection, username, idConnection, Connections } = props;
	const [stateConnection, setStateConnection] = useState<boolean>(false);
	const dispatch = useDispatch();
	const history = useHistory();

	const setConnection = React.useCallback(() => {
		setStateConnection(!stateConnection);
		Toast.fire({
			title: !stateConnection ? 'Conectado' : 'Desconectado',
		});
	}, [stateConnection]);

	const showAlertDelete = React.useCallback(() => {
		showAlert().fire({
			title: 'Confirmar',
			icon: 'question',
			text: '¿Desea eliminar esta conexión?',
			preConfirm() {
				dispatch({
					type: 'REMOVE',
					payload: { id: idConnection },
				});
			},
		});
	}, [idConnection, dispatch]);

	const showSettings = useCallback(() => {
		const settingConnections = async () => {
			const actualConnection = Connections.filter(
				(connection) => connection.id === idConnection,
			)[0];
			const newValues = await ShowModalSettingsConnection({
				...actualConnection,
			});
			if (newValues) {
				dispatch({
					type: 'EDIT',
					payload: newValues,
				});
			}
		};
		settingConnections();
	}, [Connections, dispatch, idConnection]);

	const cardActions = [
		<Button
			key={1}
			waves={'light'}
			onClick={() => {
				history.push('/Dashboard');
			}}
		>
			<Icon>arrow_forward</Icon>
		</Button>,

		<Button key={2} onClick={showSettings} waves={'light'}>
			<Icon>settings</Icon>
		</Button>,
		<Button key={3} onClick={setConnection} waves={'light'}>
			<Icon>{stateConnection ? 'cloud' : 'cloud_off'}</Icon>
		</Button>,
		<Button key={4} onClick={showAlertDelete} waves={'light'}>
			<Icon>delete</Icon>
		</Button>,
		// <Fab
		// 	icon={'settings'}
		// 	onClick={showSettings}
		// 	id={'fab-settings'}
		// 	color={'blue-grey darken-2'}
		// />,
		// <Fab
		// 	icon={stateConnection ? 'cloud' : 'cloud_off'}
		// 	onClick={setConnection}
		// 	id={'fab-cloud'}
		// 	color={stateConnection ? 'green' : 'red'}
		// />,
		// <Fab
		// 	icon={'delete'}
		// 	id={'fab-delete-connection'}
		// 	onClick={showAlertDelete}
		// 	color={'red darken-2'}
		// />,
		// <Link key={2} to={'/Dashboard'} className='black-text' id={'linkDashboard'}>
		// 	Ir al dashboard
		// </Link>,
	];

	return (
		<Col s={12} m={4} l={3} xl={3}>
			<Card
				className='wrapper-link-dashboard'
				actions={cardActions}
				title={nameConnection}
			>
				<pre>
					Usuario : <span>{username}</span>
				</pre>
				<pre>
					Conexion:{' '}
					<span className={stateConnection ? 'green-text' : 'red-text'}>
						{stateConnection ? 'Conectado' : 'Desconectado'}
					</span>
				</pre>
			</Card>
		</Col>
	);
};

const mapStateToProps = (state: any) => ({
	Connections: state.ConnectionsReducer,
});

export default connect(mapStateToProps)(React.memo(CardConnection));
