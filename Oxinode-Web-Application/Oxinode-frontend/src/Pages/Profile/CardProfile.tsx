import { useMutation, useQuery } from '@apollo/client';
import React, { FC, memo, useEffect } from 'react';
import { Button, Icon } from 'react-materialize';
import Spinner from '../../Components/Spinner';
import { Mutation, Query } from '../../GraphQL/QueryMutation';
import showAlert from '../../Utils/Alert';
import PhotoProfile from './PhotoProfile';
import { showEditProfile } from './showEditProfile';
import styles from './UserProfile.module.scss';
import { useHistory } from 'react-router-dom';

type IInfo = {
	name: string;
	lastname: string;
	email: string;
	urlPhoto?: string;
	lastLogin: string;
	direction: string;
};

type IQuery = {
	getInfoUser: IInfo;
};

const CardProfile: FC = () => {
	const { data, refetch } = useQuery<IQuery>(Query.getInfoUser);
	const [addEditMutation, mutation] = useMutation(Mutation.updateProfile);
	const history = useHistory();

	useEffect(() => {
		if (mutation.data) {
			refetch();

			if (mutation.data.updateUser.error) {
				showAlert().fire({
					icon: 'info',
					title: 'Ha ocurrido un error',
					text: mutation.data.updateUser.message,
					showCancelButton: false,
				});
			}
		}
	}, [mutation.data]);

	if (!data) {
		return <Spinner />;
	}

	const fullDate = new Date(parseInt(data.getInfoUser.lastLogin));
	const date = `${fullDate.getDay()}/${fullDate.getMonth()}/${fullDate.getFullYear()}`;

	const editProfile = async () => {
		//
		const {
			getInfoUser: { name, lastname, direction },
		} = data;
		const values = await showEditProfile({
			name,
			lastname,
			direction,
		});
		if (values) {
			await addEditMutation({
				variables: {
					name: values.name,
					lastname: values.lastname,
					password: values.password,
					email: data.getInfoUser.email,
					oldPassword: values.oldPassword,
					direction: values.direction,
				},
			});
		}
	};

	const handleLogOut = async () => {
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
		<div className={`${styles.cardProfile} p-fixed`}>
			<div className={`p-relative ${styles.cardProfileImage}`}>
				<PhotoProfile url={data.getInfoUser.urlPhoto} />
			</div>
			<div className={`${styles.cardProfileInfo}`}>
				<h4>Informacion</h4>
				<pre>
					Nombre(s){''}: <span>{data.getInfoUser.name}</span>
				</pre>
				<pre>
					Apellido(s){''}: <span>{data.getInfoUser.lastname}</span>
				</pre>
				<pre>
					Direccion{'  '}: <span>{data.getInfoUser.direction}</span>
				</pre>
				<pre>
					Email{''}: <span>{data.getInfoUser.email}</span>
				</pre>
				<pre>
					Ultima Sesion{''}: <span>{date}</span>
				</pre>
				<Button
					className={`${styles.btnLogOut} red`}
					waves={'light'}
					small
					onClick={handleLogOut}
					icon={<Icon right>exit_to_app</Icon>}
				>
					Cerrar Sesion
				</Button>
				<Button
					className={`${styles.btnEdit}`}
					waves={'light'}
					small
					onClick={editProfile}
					icon={<Icon right>edit</Icon>}
				>
					Editar
				</Button>
			</div>
		</div>
	);
};

export default memo(CardProfile);
