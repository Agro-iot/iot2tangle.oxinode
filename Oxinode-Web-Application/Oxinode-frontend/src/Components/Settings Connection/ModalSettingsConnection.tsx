import React, { ChangeEvent, Fragment } from 'react';
import { Checkbox, Col, Row } from 'react-materialize';
import TextInput from 'react-materialize/lib/TextInput';
import { formModalValues } from './showModalSettingsConnection';

type IProps = {
	initialValues: formModalValues;
	handleChange(e: ChangeEvent<HTMLInputElement | any>): void;
};

const ModalSettingsConnection: React.FC<IProps> = (
	props,
): React.ReactElement => {
	const { initialValues, handleChange } = props;

	return (
		<Fragment>
			<Row>
				<TextInput
					s={12}
					id={'connectionName'}
					onChange={handleChange}
					label={'Connection Name'}
					defaultValue={initialValues.connectionName}
				/>
			</Row>
			<Row>
				<Col s={12} className={'input-field'}>
					<Checkbox
						id={'notify'}
						label={'Notify On Disconnect'}
						value={initialValues.notify ? 'true' : 'false'}
						onChange={handleChange}
						checked={initialValues.notify}
					/>
				</Col>
			</Row>
			<Row>
				<Col s={12} className='input-field'>
					<Checkbox
						value={initialValues.connectAuto ? 'true' : 'false'}
						id={'connectAuto'}
						onChange={handleChange}
						label={'Connect Automatically'}
						checked={initialValues.connectAuto}
					/>
				</Col>
			</Row>
		</Fragment>
	);
};

export default React.memo(ModalSettingsConnection);
