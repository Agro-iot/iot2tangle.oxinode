import {
	InMemoryCache,
	ApolloClient,
	HttpLink,
	ApolloLink,
} from '@apollo/client';
import { onError } from '@apollo/client/link/error';
import { env } from '../env';

const uriLink = new HttpLink({
	uri: `${env.urlServer}/graphql`,
	headers: {
		token: localStorage.getItem('token') || '',
	},
});

const errorLink = onError(({ graphQLErrors }) => {
	if (graphQLErrors)
		graphQLErrors.map(({ message, locations, path }) =>
			console.log(
				`[GraphQL Error]: Message: ${message}, Location: ${locations}, Path: ${path}`,
			),
		);
});

const client = new ApolloClient({
	link: ApolloLink.from([errorLink, uriLink]),
	cache: new InMemoryCache(),
});

export default client;
