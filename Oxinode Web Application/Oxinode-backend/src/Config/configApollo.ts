import express, { Application } from 'express';
import { ApolloServer } from 'apollo-server-express';
import { GraphQLSchema } from 'graphql';
import { buildSchema } from 'type-graphql';
import jwt from 'jsonwebtoken';
import ConnectionsResolver from '../GraphQL/Resolvers/Connections.resolver';
import DevicesResolver from '../GraphQL/Resolvers/Devices.resolver';
import DevicesDataResolver from '../GraphQL/Resolvers/DevicesDataResolver';
import RulesResolver from '../GraphQL/Resolvers/RulesResolver';
import UserResolver from '../GraphQL/Resolvers/User.resolver';
import configExpress from './configExpress';

async function configApollo(): Promise<Application> {
	const schema: GraphQLSchema = await buildSchema({
		resolvers: [
			UserResolver,
			ConnectionsResolver,
			DevicesResolver,
			DevicesDataResolver,
			RulesResolver,
		],
	});
	const app = configExpress(express());
	const server = new ApolloServer({
		schema,
		context: async ({ req, res }) => {
			const token = req.headers.token as string;
			if (token) {
				const { userId }: any = await jwt.decode(token);
				return { res, req, userId };
			}
			return { res, req };
		},
	});

	server.applyMiddleware({ app });
	return app;
}

export default configApollo;
