import { useQuery } from '@apollo/client';
import React, { FC, useEffect } from 'react';
import { Table } from 'react-materialize';
import { connect, useDispatch } from 'react-redux';
import { Query } from '../../GraphQL/QueryMutation';
import useGetDevices from '../../Hooks/getDevices';
import { addRule } from '../../Redux/Actions/RulesAction';
import { IDeviceState } from '../../Redux/Reducers/Devices.reducer';
import { IRule } from '../../Redux/Reducers/RulesReducer';
import styles from './Rule.module.scss';
import RuleRow from './RuleRow';

type IProps = {
	Devices: IDeviceState[];
	Rules: IRule[];
};

type IQuery = {
	getRules: Array<IRule>;
};

let fetch = true;

const RulesTable: FC<IProps> = (props) => {
	const { Devices, Rules } = props;
	const { data } = useQuery<IQuery>(Query.getRules);
	useGetDevices();
	const dispatch = useDispatch();
	useEffect(() => {
		if (fetch) {
			if (data) {
				console.log(data);
				data.getRules.map((rule) => {
					dispatch(addRule({ ...rule, id: Math.random() * 10000 }));
				});
				fetch = false;
			}
		}
	}, [data, dispatch]);

	return (
		<Table hoverable responsive className={`${styles.tableRules} hoverable`}>
			<thead>
				<tr>
					<th>Dispositivo</th>
					<th>Comparacion</th>
					<th>Numero</th>
					<th>Mensaje</th>
					<th />
					<th />
					<th />
				</tr>
			</thead>
			<tbody>
				{Rules.map((rule) => (
					<RuleRow Devices={Devices} Rule={rule} key={rule.id} />
				))}
			</tbody>
		</Table>
	);
};

const mapStateToProps = (state: any) => ({
	Devices: state.DevicesReducer,
	Rules: state.RulesReducer,
});

export default connect(mapStateToProps)(React.memo(RulesTable));
