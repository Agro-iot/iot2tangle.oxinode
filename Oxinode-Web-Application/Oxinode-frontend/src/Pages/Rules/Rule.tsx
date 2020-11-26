import React, { FC, Fragment, memo, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import FabFullscreen from '../../Components/Buttons/FabFullscreen';
import Navbar from '../../Components/Navbar';
import useGetDevices from '../../Hooks/getDevices';
import { addRule } from '../../Redux/Actions/RulesAction';
import SideNavDashboard from '../Dashboard/SideNavDashboard';
import { Sidenav } from 'materialize-css';
import styles from './Rule.module.scss';
import RulesTable from './RulesTable';

const Rule: FC = () => {
	useEffect(() => {
		Sidenav.init(document.getElementById('slide-dashboard')!);
	}, []);
	useGetDevices();
	const dispatch = useDispatch();

	const handleAddRule = async () => {
		dispatch(
			addRule({
				id: Date.now(),
				number: '0',
				message: '',
				comparison: '>=',
				topic: '',
				state: false,
			}),
		);
	};

	return (
		<Fragment>
			<div className={`w-100 h-100s ${styles.bg}`}>
				<Navbar title={'Reglas'} sidenavTarget={'slide-dashboard'} />
				<RulesTable />
			</div>
			<FabFullscreen handleClick={handleAddRule} />
			<SideNavDashboard />
		</Fragment>
	);
};

export default memo(Rule);
