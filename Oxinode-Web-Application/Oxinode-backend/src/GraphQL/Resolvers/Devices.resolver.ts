import 'reflect-metadata';
import { Arg, Ctx, Mutation, Query, Resolver } from 'type-graphql';
import DevicesModel from '../../Models/DevicesModel';
import { DevicesType } from '../typeDefs/Devices.type';
import { Message } from '../typeDefs/User.type';
import { returnMessage } from './User.resolver';

@Resolver()
class DevicesResolver {
	@Query(() => [DevicesType!]!)
	async getDevices(@Ctx() { userId }: { userId: number }) {
		return await DevicesModel.findAll({
			where: {
				UserId: userId,
			},
		});
	}

	// @ts-ignore
	@Mutation(() => Message)
	async editDevice(
		@Ctx() { userId }: { userId: number },
		@Arg('info') info: string,
	) {
		const deviceJSON = JSON.parse(info);
		const device = await DevicesModel.findOne({
			where: {
				id: deviceJSON.idDB,
				UserId: userId,
			},
		});
		try {
			if (device) {
				device.info = info;
				await device.save({
					fields: ['info'],
				});
			}
			return returnMessage(false, 'OK');
		} catch (e) {
			return returnMessage(true, e);
		}
	}

	@Mutation(() => Message)
	async removeDevice(
		@Ctx() { userId }: { userId: number },
		@Arg('idDB') id: number,
	) {
		try {
			await DevicesModel.destroy({
				where: {
					UserId: userId,
					id,
				},
			});
			return returnMessage(false, '');
		} catch (e) {
			return returnMessage(true, e);
		}
	}
}

export default DevicesResolver;
