import 'reflect-metadata';
import { Arg, Ctx, Mutation, Query, Resolver } from 'type-graphql';
import ConnectionsModel from '../../Models/ConnectionsModel';
import { ConnectionType } from '../typeDefs/Connections.type';
import { Message } from '../typeDefs/User.type';

@Resolver()
class ConnectionsResolver {
	@Mutation(() => Message)
	async addConnection(
		@Arg('connectionName') connectionName: string,
		@Arg('connectAuto') connectAuto: boolean,
		@Arg('notify') notify: boolean,
		@Arg('clientId') clientId: string,
		@Ctx() { userId }: { userId: number },
	) {
		const newConnection = await ConnectionsModel.build({
			clientId,
			connectAuto,
			notify,
			password: '',
			username: '',
			connectionName,
			UserId: userId,
		});
		try {
			await newConnection.save();
			return {
				error: false,
			};
		} catch (e) {
			return {
				message: 'Hubo un error',
				error: true,
			};
		}
	}

	@Query(() => [ConnectionType])
	async getConnections(@Ctx() { userId }: { userId: number }) {
		return await ConnectionsModel.findAll({
			where: {
				UserId: userId,
			},
		});
	}
}

export default ConnectionsResolver;
