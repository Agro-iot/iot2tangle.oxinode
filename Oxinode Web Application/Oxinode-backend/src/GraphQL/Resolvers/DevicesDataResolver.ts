import { Arg, Ctx, Int, Mutation, Resolver } from 'type-graphql';
import DeviceDataModel from '../../Models/DeviceDataModel';
import MqttAcl from '../../Models/mqttAcl';
import { DevicesDataType } from '../typeDefs/DevicesDataType';
import { Op } from 'sequelize';
import moment from 'moment';
import 'moment/locale/es';
moment.locale('es');

@Resolver()
class DevicesDataResolver {
	@Mutation(() => [DevicesDataType]!)
	async getData(
		@Ctx() { userId }: { userId: number },
		@Arg('topic') topic: string,
		@Arg('year', () => Int!) year: number,
		@Arg('month', () => Int!) month: number,
		@Arg('day', () => Int!) day: number,
		@Arg('hour', () => Int!) hour: number,
	) {
		const lastDate = new Date();
		lastDate.setUTCFullYear(year);
		lastDate.setUTCMonth(month);
		lastDate.setUTCDate(day);
		lastDate.setUTCHours(hour);
		lastDate.setUTCMinutes(0);
		lastDate.setUTCSeconds(0);
		lastDate.setUTCMilliseconds(0);
		const newDate = new Date();
		newDate.setUTCFullYear(year);
		newDate.setUTCMonth(month);
		newDate.setUTCDate(day);
		newDate.setUTCHours(hour + 1);
		newDate.setUTCMinutes(0);
		newDate.setUTCSeconds(0);
		newDate.setUTCMilliseconds(0);

		const userAcl = await MqttAcl.findOne({
			where: {
				UserId: userId,
			},
		});

		if (userAcl) {
			const baseTopic: string = userAcl.topic!.substr(
				0,
				userAcl.topic!.length - 2,
			);
			const data = await DeviceDataModel.findAll({
				where: {
					topic: {
						[Op.startsWith]: baseTopic,
					},
				},
			});
			return data.map((dat) => {
				const info = JSON.parse(dat.data);
				const iot2tangleData = info.iot2tangle[1].data;
				let value: number = 0;
				let keyValue: string = '';
				for (const d of iot2tangleData) {
					Object.keys(d).forEach((key) => {
						if (key == topic) {
							value = parseInt(d[key]);
							keyValue = key;
						}
					});
				}
				return {
					topic: keyValue,
					id: dat.id,
					createdAt: dat.createdAt,
					data: value,
				};
			});
		}
		return [];
	}
}

export default DevicesDataResolver;
