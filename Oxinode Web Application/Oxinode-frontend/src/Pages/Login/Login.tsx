import styled from '@emotion/styled';
import React, { useContext, useEffect } from 'react';
import { useMutation } from '@apollo/client';
import { Form, Formik, FormikHelpers } from 'formik';
import './Login.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from '@fortawesome/free-solid-svg-icons';
import { Button, Icon } from 'react-materialize';
import M from 'materialize-css';
import InputForm from '../../Components/Inputs/InputForm';
import { Mutation } from '../../GraphQL/QueryMutation';
import { SocketsContext } from '../../Hooks/SocketsProvider';
import showAlert from '../../Utils/Alert';
import { loginSchema } from '../../Utils/Validators';
import { Link } from 'react-router-dom';

type IValuesForm = {
	email: '';
	password: '';
};

const ForgotHaveAccount = styled.ul`
	justify-content: space-between;
	margin-top: 1.5rem;

	@media (min-width: 320px) and (max-width: 600px) {
		padding-bottom: 1.5rem;
		padding-left: 1.5rem !important;
		padding-right: 1.5rem !important;
	}

	a {
		color: #999;
		&:hover {
			color: black;
		}
	}
`;

const InputContainer = styled.div`
	width: 90%;
	display: block;
	margin: auto;
`;

const Login: React.FC = (): React.ReactElement => {
	const io = useContext(SocketsContext);

	const [addloginMutation, { data }] = useMutation(Mutation.Login);
	useEffect(() => {
		M.CharacterCounter.init(document.getElementById('userName')!);
		M.CharacterCounter.init(document.getElementById('password')!);
	});

	useEffect(() => {
		if (data) {
			const { loginUser } = data;
			showAlert().fire({
				icon: loginUser.error ? 'error' : 'success',
				title: loginUser.error ? 'Error' : 'Exito',
				text: loginUser.error ? loginUser.message : `Se ha iniciado sesion.`,
				showCancelButton: false,
				async onClose() {
					if (!loginUser.error) {
						io.emit(
							'login',
							JSON.stringify({
								type: 'login',
								token: loginUser.token,
							}),
						);
						io.emit('login', {
							token: loginUser.token,
						});
						await localStorage.setItem('token', loginUser.token);
						window.location.href = window.location.origin + '/Dashboard';
					}
				},
			});
		}
	});

	const handleSubmit = async (
		values: IValuesForm,
		{ setSubmitting }: FormikHelpers<IValuesForm>,
	) => {
		await addloginMutation({
			variables: {
				email: values.email,
				password: values.password,
			},
		});
		setSubmitting(false);
	};

	return (
		<div className={'bg-login d-flex w-100 h-100 p-fixed'}>
			<div className='login-container h-auto'>
				<div className='img-login'>
					<img alt='' src={require('../../assets/img/LoginLeft.jpeg')} />
				</div>
				<div className='login-content h-auto login-responsive bg-white col s6'>
					<Formik
						initialValues={{ email: '', password: '' }}
						validationSchema={loginSchema}
						onSubmit={handleSubmit}
					>
						{({ isSubmitting, errors, isValid }) => {
							return (
								<Form className={'form-Login'} id={'formLogin'}>
									<FontAwesomeIcon
										icon={faUser}
										aria-multiselectable={false}
										className={'loginIconUser'}
									/>
									<h2 className='title text-uppercase'>Iniciar Sesion</h2>

									<InputContainer className={'d-block'}>
										<InputForm
											idInput={'email'}
											label={'Correo'}
											icon={'email'}
											typeInput={'email'}
											characterCounter={'30'}
											messageError={errors.email}
										/>

										<InputForm
											idInput={'password'}
											icon={'lock'}
											typeInput={'password'}
											characterCounter={'25'}
											label={'Contraseña'}
											messageError={errors.password}
										/>
									</InputContainer>

									<Button
										waves={'light'}
										className={'btn-login'}
										disabled={isSubmitting || !isValid}
									>
										Iniciar Sesion
										<Icon right>person</Icon>
									</Button>

									<div className={'d-block'}>
										<ForgotHaveAccount className={'w-100 d-flex'}>
											<li>
												<Link
													className={'text-decoration-none'}
													to={'Registrarse'}
												>
													¿aun no tienes cuenta?
												</Link>
											</li>
											<li>
												<Link className={'text-decoration-none'} to={'#!'}>
													¿olvidaste tu contraseña?
												</Link>
											</li>
										</ForgotHaveAccount>
									</div>
								</Form>
							);
						}}
					</Formik>
				</div>
			</div>
		</div>
	);
};

export default React.memo(Login);
