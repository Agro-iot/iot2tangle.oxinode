import { Field } from 'formik';
import React from 'react';
import { Icon, Row } from 'react-materialize';

type IProps = {
	icon?: string;
	colSize?: string;
	idInput: string;
	typeInput?: 'text' | 'password' | 'email' | 'tel';
	characterCounter: string;
	label: string;
	messageError?: string;
};

const InputForm: React.FC<IProps> = (
	props = {
		colSize: 's12',
		typeInput: 'text',
	} as IProps,
) => {
	const {
		icon,
		colSize,
		idInput,
		typeInput,
		characterCounter,
		label,
		messageError,
	} = props;
	return (
		<Row>
			<div className={`col ${colSize} input-field`}>
				{icon && <Icon className={'prefix'}>{icon}</Icon>}
				<Field
					id={idInput}
					data-length={characterCounter}
					type={typeInput}
					className={messageError ? 'invalid' : 'valid'}
					name={idInput}
				/>
				<label htmlFor={idInput} className={'active'}>
					{label}
				</label>
				{messageError && (
					<span className='helper-text text-start' data-error={messageError}>
						helper text
					</span>
				)}
			</div>
		</Row>
	);
};

export default React.memo(InputForm);
