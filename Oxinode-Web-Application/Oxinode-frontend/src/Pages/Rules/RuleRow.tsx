import { useMutation } from '@apollo/client';
import React, { ChangeEvent, FC, useEffect, useState } from 'react';
import { Button, Icon } from 'react-materialize';
import { useDispatch } from 'react-redux';
import { Mutation } from '../../GraphQL/QueryMutation';
import { editRule, removeRule } from '../../Redux/Actions/RulesAction';
import { IDeviceState } from '../../Redux/Reducers/Devices.reducer';
import { IRule } from '../../Redux/Reducers/RulesReducer';
import showAlert from '../../Utils/Alert';
import styles from './Rule.module.scss';
import { FormSelect } from 'materialize-css';

type IProps = {
	Devices: IDeviceState[];
	Rule: IRule;
};

const RuleRow: FC<IProps> = (props) => {
	const { Devices, Rule } = props;
	const [valid, setValid] = useState(false);
	const dispatch = useDispatch();
	const [addRule, { data }] = useMutation(Mutation.addRule);
	const [values, setValues] = useState<IRule>({ ...Rule });
	const [removeRuleMut] = useMutation(Mutation.removeRule);

	const handleChange = (
		e: ChangeEvent<HTMLInputElement | HTMLSelectElement>,
	) => {
		setValues({
			...values,
			[e.target.id]: e.target.value,
		});
	};

	const onEdit = async () => {
		if (valid) {
			await showAlert().fire({
				title: 'Confirmar',
				icon: 'question',
				text: 'Desea guardar los cambios',
				async preConfirm() {
					try {
						await addRule({
							variables: {
								topic: values.topic,
								comparison: values.comparison,
								number: parseInt(values.number),
								msg: values.message,
								idDB: values.idDB,
								state: values.state,
							},
						});
					} catch (e) {}
					setValid(!valid);
				},
			});
		} else {
			setValid(!valid);
		}
	};

	useEffect(() => {
		if (data) {
			dispatch(editRule({ ...Rule, idDB: parseInt(data.addRule.message) }));
		}
	}, [data]);

	useEffect(() => {
		FormSelect.init(document.querySelectorAll('select'));
	});

	const handleRemove = async () => {
		await showAlert().fire({
			title: 'Confirmar',
			icon: 'question',
			text: 'Desea eliminar esta regla?',
			preConfirm() {
				//
				removeRuleMut({
					variables: {
						id: Rule.idDB,
					},
				});
				dispatch(removeRule(Rule));
			},
		});
	};

	const handleSwitch = () => {
		setValues({ ...values, state: !values.state });
	};

	return (
		<tr>
			<th>
				<div className={`input-field ${styles.inputsTable}`}>
					<select
						disabled={!valid}
						id={'topic'}
						defaultValue={Rule.topic}
						onChange={handleChange}
					>
						<option value=''>-- Dispositivo --</option>
						{Devices.map((device) => (
							<option value={device.topic} key={device.idDB}>
								{device.panelName}
							</option>
						))}
					</select>
				</div>
			</th>
			<th>
				<div className={`input-field ${styles.inputsTable}`}>
					<select
						disabled={!valid}
						id={'comparison'}
						defaultValue={Rule.comparison}
						onChange={handleChange}
					>
						<option value='<='>{'<='}</option>
						<option value='>='>{'>='}</option>
					</select>
				</div>
			</th>
			<th>
				<div className={`input-field ${styles.inputsTable}`}>
					<input
						type='number'
						id='number'
						defaultValue={Rule.number}
						disabled={!valid}
						onChange={handleChange}
					/>
				</div>
			</th>
			<th>
				<div className={`input-field ${styles.inputsTable}`}>
					<input
						type='text'
						id='message'
						defaultValue={Rule.message}
						disabled={!valid}
						onChange={handleChange}
					/>
				</div>
			</th>
			<th>
				<Button
					onClick={onEdit}
					small
					waves={'light'}
					icon={<Icon>{valid ? 'check' : 'settings'}</Icon>}
				>
					Editar
				</Button>
			</th>
			<th>
				<Button
					waves={'light'}
					className={'red darken-3'}
					small
					onClick={handleRemove}
					icon={<Icon>close</Icon>}
				>
					Eliminar
				</Button>
			</th>
			<th>
				<div className='switch'>
					<label>
						<input
							disabled={!valid}
							type='checkbox'
							id={'state'}
							defaultChecked={Rule.state}
						/>
						<span className='lever' onClick={handleSwitch} />
					</label>
				</div>
			</th>
		</tr>
	);
};

export default RuleRow;
