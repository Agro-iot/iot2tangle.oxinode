import { useMutation, useQuery } from '@apollo/client';
import React, { FC, useState, Fragment, useEffect } from 'react';
import { Button, Icon, Row, TextInput } from 'react-materialize';
import { SweetAlertResult } from 'sweetalert2';
import { Mutation, Query } from '../../GraphQL/QueryMutation';
import styles from '../../Pages/Settings/Settings.module.scss';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
const reactSwal = withReactContent(Swal);

type IAlertSettings = {
	token: string;
	chatId: string;
};

const SettingsTelegram: FC = () => {
	const [disabled, setDisabled] = useState<boolean>(true);
	const [setToken] = useMutation(Mutation.setToken);
	const query = useQuery(Query.getToken);
	const [data, setData] = useState({
		chatId: '',
		token: '',
	});
	const [toggleEnabled] = useMutation(Mutation.toggleEnabledTelegram);
	const enabledTelegram = useQuery(Query.getEnabledTelegram);

	useEffect(() => {
		if (query.data) {
			const newData = JSON.parse(query.data.getToken.message);
			setData({ ...newData });
		}
	}, [query]);

	useEffect(() => {
		if (enabledTelegram.data) {
			//
			setDisabled(!enabledTelegram.data.getEnabledTelegram.error);
		}
	}, [enabledTelegram.data]);

	const handleShowSettingsTelegram = async () => {
		//
		const {
			value: formValue,
		}: SweetAlertResult<IAlertSettings> = await reactSwal.fire({
			html: (
				<Fragment>
					<Row>
						<TextInput
							s={12}
							label={'Token*'}
							id={'token'}
							defaultValue={data.token}
						/>
						<TextInput
							s={12}
							label={'ChatId*'}
							id={'chatId'}
							defaultValue={data.chatId}
						/>
					</Row>
				</Fragment>
			),
			text: 'Configurar chatBot Telegram',
			showCancelButton: true,
			cancelButtonColor: 'red',
			customClass: {
				content: 'white-text',
			},
			preConfirm() {
				//
				return {
					token: (document.getElementById('token') as HTMLInputElement).value,
					chatId: (document.getElementById('chatId') as HTMLInputElement).value,
				};
			},
		});
		if (formValue) {
			await setToken({
				variables: {
					chatId: formValue.chatId,
					token: formValue.token,
				},
			});
		}
	};

	const handleDisabledTelegram = async () => {
		//
		setDisabled(!disabled);
		if (disabled) {
			// Enable
			await toggleEnabled({
				variables: {
					chatId: data.chatId,
					token: data.token,
					enabled: true,
				},
			});
		} else {
			// Disable
			await toggleEnabled({
				variables: {
					chatId: data.chatId,
					token: data.token,
					enabled: false,
				},
			});
		}
	};

	return (
		<div className={`card hoverable z-depth-3 ${styles.cardTelegram}`}>
			<div className='card-content'>
				<span className='card-title '>
					<Icon left>notifications</Icon> Telegram
				</span>
				<p>
					Configuracion de las notificaciones en tiempo real ante varias
					situaciones significativas
				</p>
				<div className={`card-action ${styles.cardTelegramActions}`}>
					<Button
						waves={'light'}
						icon={<Icon left>{disabled ? 'play_arrow' : 'pause'}</Icon>}
						onClick={handleDisabledTelegram}
					>
						{disabled ? 'Habilitar' : 'Deshabilitar'}
					</Button>
					<Button
						disabled={disabled}
						waves={'light'}
						icon={<Icon left>settings</Icon>}
						onClick={handleShowSettingsTelegram}
					>
						Configurar
					</Button>
				</div>
			</div>
		</div>
	);
};

export default SettingsTelegram;
