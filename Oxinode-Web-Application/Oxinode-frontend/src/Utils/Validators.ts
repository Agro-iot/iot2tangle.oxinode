import * as yup from 'yup';

export const loginSchema = yup.object().shape({
	email: yup
		.string()
		.min(5, 'Muy corto')
		.max(50, 'Muy larg')
		.email('Email no valido')
		.required('Es Requerido'),
	password: yup
		.string()
		.min(8, 'Muy corta')
		.max(50, 'Muy larga')
		.required('Es requerida'),
});

export const registerSchema = loginSchema.shape({
	name: yup
		.string()
		.min(2, 'Muy corto')
		.max(50, 'Muy largo')
		.required('Es requerido'),
	lastname: yup
		.string()
		.min(2, 'Muy corto')
		.max(50, 'Muy largo')
		.required('Es requerido'),
	verifyPassword: yup
		.string()
		.min(8, 'Muy corta')
		.max(50, 'Muy larga')
		.oneOf([yup.ref('password'), undefined], 'Las contraseñas no coinciden')
		.required('Es requerida'),
});
