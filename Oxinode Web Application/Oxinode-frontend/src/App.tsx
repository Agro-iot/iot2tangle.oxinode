import React, { lazy, memo, Suspense } from 'react';
import './App.scss';
import {
	BrowserRouter as Router,
	Switch,
	Route,
	Redirect,
} from 'react-router-dom';
import Spinner from './Components/Spinner';
import GuardAuth from './Hooks/GuardAuth';
const Login = lazy(() => import('./Pages/Login/Login'));
const Register = lazy(() => import('./Pages/Register/Register'));
const Dashboard = lazy(() => import('./Pages/Dashboard/Dashboard'));
const Records = lazy(() => import('./Pages/Records/Records'));
const Profile = lazy(() => import('./Pages/Profile/UserProfile'));
const NoMatch = lazy(() => import('./Pages/404/404'));
const Rule = lazy(() => import('./Pages/Rules/Rule'));
const Settings = lazy(() => import('./Pages/Settings/Settings'));

const App: React.FC = (): React.ReactElement => (
	<Router basename={'/'}>
		<Suspense fallback={<Spinner />}>
			<Switch>
				<Route exact={true} path={'/'}>
					<Redirect to={'/Iniciar-Sesion'} />
				</Route>
				<Route path={'/Iniciar-Sesion'}>
					<Login />
				</Route>
				<Route path={'/Registrarse'}>
					<Register />
				</Route>
				<Route path={'/Dashboard'}>
					<GuardAuth>
						<Dashboard />
					</GuardAuth>
				</Route>
				<Route path={'/Perfil'}>
					<GuardAuth>
						<Profile />
					</GuardAuth>
				</Route>
				<Route path={'/Records'}>
					<GuardAuth>
						<Records />
					</GuardAuth>
				</Route>
				<Route path={'/Reglas'}>
					<GuardAuth>
						<Rule />
					</GuardAuth>
				</Route>
				<Route path={'/Configuraciones'}>
					<GuardAuth>
						<Settings />
					</GuardAuth>
				</Route>
				<Route path={'*'}>
					<NoMatch />
				</Route>
			</Switch>
		</Suspense>
	</Router>
);

export default memo(App);
