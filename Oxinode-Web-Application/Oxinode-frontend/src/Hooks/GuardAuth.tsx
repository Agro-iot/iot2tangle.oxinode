import React, { FC, useEffect, useState } from 'react';
import axios from 'axios';
import { useHistory } from 'react-router-dom';
import Spinner from '../Components/Spinner';
import { env } from '../env';

type IProps = {
	children: React.ReactElement;
};

const GuardAuth: FC<IProps> = (props: IProps) => {
	const { children } = props;
	const [loading, setLoading] = useState(true);
	const history = useHistory();
	useEffect(() => {
		const checkAuth = async () => {
			const token: string | null = localStorage.getItem('token');
			if (!token) {
				setLoading(false);
				history.push('/Iniciar-Sesion');
			}
			const response = await axios.post(`${env.urlServer}/user/isAuth`, {
				token,
			});
			if (response.data.auth) {
				setLoading(false);
			} else {
				history.push('/Iniciar-Sesion');
			}
		};
		checkAuth();
	}, []);

	return loading ? <Spinner /> : children;
};

export default GuardAuth;
