import React, { FC, memo, Fragment } from 'react';
import { Row } from 'react-materialize';
import TextInput from 'react-materialize/lib/TextInput';
import { IProfileValues } from './showEditProfile';

type IProps = {
	initialValues: IProfileValues;
	onChange(e: any): void;
};

const EditProfile: FC<IProps> = (props) => {
	const { initialValues, onChange } = props;
	return (
		<Fragment>
			<Row>
				<TextInput
					onChange={onChange}
					id={'name'}
					label={'Nombre(s)'}
					defaultValue={initialValues.name}
					s={12}
				/>
				<TextInput
					onChange={onChange}
					id={'lastname'}
					label={'Apellido(s)'}
					defaultValue={initialValues.lastname}
					s={12}
				/>
				<TextInput
					onChange={onChange}
					id={'direction'}
					label={'Direccion'}
					defaultValue={initialValues.direction}
					s={12}
				/>
				<TextInput
					onChange={onChange}
					id={'oldPassword'}
					label={'Antigua contraseña'}
					defaultValue={initialValues.oldPassword}
					s={12}
				/>
				<TextInput
					onChange={onChange}
					id={'password'}
					label={'Nueva contraseña'}
					defaultValue={initialValues.password}
					s={12}
				/>
			</Row>
		</Fragment>
	);
};

export default memo(EditProfile);
