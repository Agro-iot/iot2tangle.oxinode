import { useMutation } from '@apollo/client';
import { Form, Formik } from 'formik';
import React, { useEffect } from 'react';
import './Register.scss';
import { Button, Col, Row } from 'react-materialize';
import { Link } from 'react-router-dom';
import M from 'materialize-css';
import InputForm from '../../Components/Inputs/InputForm';
import { Mutation } from '../../GraphQL/QueryMutation';
import showAlert from '../../Utils/Alert';
import { registerSchema } from '../../Utils/Validators';
import ImagesRegister from './ImagesRegister';
import { useHistory } from 'react-router-dom';

const Register: React.FC = (): React.ReactElement => {
	const history = useHistory();

	const [addRegisterMutation, { data }] = useMutation(Mutation.Register);
	React.useEffect(() => {
		M.CharacterCounter.init(document.getElementById('Name')!);
		M.CharacterCounter.init(document.getElementById('LastName')!);
		M.CharacterCounter.init(document.getElementById('Email')!);
		M.CharacterCounter.init(document.getElementById('Password')!);
		M.CharacterCounter.init(document.getElementById('PasswordVerify')!);
		M.CharacterCounter.init(document.getElementById('direction')!);
	});

	useEffect(() => {
		if (data) {
			const { createUser } = data;
			showAlert().fire({
				icon: createUser.error ? 'error' : 'success',
				title: createUser.error ? 'error' : 'success',
				text: createUser.error ? createUser.message : 'Usuario registrado, Sus credenciales mqtt se han enviado a su correo',
				showCancelButton: false,
				async onClose() {
					if (!createUser.error) {
						await history.push('/Iniciar-Sesion');
					}
				},
			});
		}
	}, [data, history]);

	return (
		<div className='bg-register w-100 h-100 d-flex p-fixed'>
			<div className={'register-Container h-auto'}>
				<div className={'register-Content h-auto'}>
					<Formik
						initialValues={{
							name: '',
							lastname: '',
							email: '',
							password: '',
							verifyPassword: '',
							direction: '',
						}}
						validationSchema={registerSchema}
						onSubmit={async (values, { setSubmitting }) => {
							await addRegisterMutation({
								variables: { ...values },
							});
							setSubmitting(false);
						}}
					>
						{({ isSubmitting, isValid, errors }) => (
							<Form className='form-register h-auto'>
								<h2 className='text-center text-uppercase title-register'>
									Registro
								</h2>
								<InputForm
									idInput={'name'}
									label={'Nombres'}
									characterCounter={'50'}
									colSize={'s12'}
									icon={'account_circle'}
									messageError={errors.name}
								/>
								<InputForm
									idInput={'lastname'}
									label={'Apellidos'}
									characterCounter={'50'}
									icon={'how_to_reg'}
									colSize={'s12'}
									messageError={errors.lastname}
								/>
								<InputForm
									idInput={'direction'}
									label={'Direccion'}
									characterCounter={'50'}
									icon={'location_on'}
									colSize={'s12'}
									messageError={errors.direction}
								/>
								<InputForm
									idInput={'email'}
									characterCounter={'40'}
									label={'Correo'}
									colSize={'s12'}
									icon={'email'}
									typeInput={'email'}
									messageError={errors.email}
								/>
								<InputForm
									idInput={'password'}
									label={'Contraseña'}
									characterCounter={'25'}
									colSize={'s12'}
									typeInput={'password'}
									icon={'lock'}
									messageError={errors.password}
								/>
								<InputForm
									idInput={'verifyPassword'}
									label={'Verificar Contraseña'}
									colSize={'s12'}
									characterCounter={'25'}
									typeInput={'password'}
									icon={'verified_user'}
									messageError={errors.verifyPassword}
								/>
								<Row>
									<Col s={6} offset={'s6'} className='a-already'>
										<Link to={'Iniciar-Sesion'} className={'a-already-account'}>
											Ya tiene cuenta?
										</Link>
									</Col>
								</Row>
								<Button
									disabled={isSubmitting || !isValid}
									className={'btn-register'}
								>
									Registrarme
								</Button>
							</Form>
						)}
					</Formik>
				</div>
				<div className={'image-Register'}>
					<ImagesRegister
						className={'triptico-1'}
						src={'triptico-register.svg'}
					/>
					<ImagesRegister
						className={'triptico-2'}
						src={'triptico-register-2.svg'}
					/>
				</div>
			</div>
		</div>
	);
};

export default React.memo(Register);
