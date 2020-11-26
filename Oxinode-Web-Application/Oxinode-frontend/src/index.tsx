import { ApolloProvider } from '@apollo/client';
import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import client from './Config/configApollo';
import { Provider } from 'react-redux';
import SocketsProvider from './Hooks/SocketsProvider';
import { store } from './Redux/Store';
import * as serviceWorker from './serviceWorker';
import M from 'materialize-css';

ReactDOM.render(
	<React.StrictMode>
		<ApolloProvider client={client}>
			<Provider store={store}>
				<SocketsProvider>
					<App />
				</SocketsProvider>
			</Provider>
		</ApolloProvider>
	</React.StrictMode>,

	document.getElementById('root'),
);

M.AutoInit();

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
