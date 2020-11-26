import { Telegraf } from 'telegraf';
import { Arg, Args, Ctx, Int, Mutation, Query, Resolver } from 'type-graphql';
import { mqttClientMap, telegramBots } from '../../Config/configMqtt';
import MqttAcl from '../../Models/mqttAcl';
import MqttUserModel from '../../Models/mqttUser';
import RulesModel from '../../Models/RulesModel';
import UserModel from '../../Models/UserModel';
import { initBotTelegram, initConnectionMQTT } from '../../Utils/Utils';
import { RulesInput, RulesType } from '../typeDefs/RulesType';
import { Message } from '../typeDefs/User.type';
import { returnMessage } from './User.resolver';

@Resolver()
class RulesResolver {
	@Mutation(() => Message)
	async addRule(
		@Args() rulesInput: RulesInput,
		@Ctx() { userId }: { userId: number },
	) {
		try {
			if (rulesInput.idDB) {
				const updateRule = await RulesModel.findByPk(rulesInput.idDB);
				updateRule!.message = rulesInput.message;
				updateRule!.comparison = rulesInput.comparison;
				updateRule!.number = rulesInput.number;
				updateRule!.topic = rulesInput.topic;
				updateRule!.state = rulesInput.state;
				await updateRule?.save();
				return returnMessage(false, updateRule!.id.toString());
			} else {
				const newRule = await RulesModel.create({
					comparison: rulesInput.comparison,
					number: rulesInput.number,
					message: rulesInput.message,
					UserId: userId,
					topic: rulesInput.topic,
					state: rulesInput.state,
				});
				return returnMessage(false, newRule.id.toString());
			}
		} catch (e) {
			return returnMessage(false, e);
		}
	}

	@Query(() => [RulesType!]!)
	async getRules(@Ctx() { userId }: { userId: number }) {
		try {
			const rulesModels = await RulesModel.findAll({
				where: {
					UserId: userId,
				},
			});
			return rulesModels.map((rule) => ({
				idDB: rule.id,
				topic: rule.topic,
				comparison: rule.comparison,
				number: rule.number,
				message: rule.message,
				state: rule.state,
			}));
		} catch (e) {
			console.log(e);
			return [];
		}
	}

	@Mutation(() => Message)
	async deleteRule(
		@Ctx() { userId }: { userId: number },
		@Arg('idDB', () => Int!) idDB: number,
	) {
		await RulesModel.destroy({
			where: {
				UserId: userId,
				id: idDB,
			},
		});
		return returnMessage(false, '');
	}

	@Mutation(() => Message)
	async addToken(
		@Ctx() { userId }: { userId: number },
		@Arg('token') token: string,
		@Arg('chatId') chatId: string,
	) {
		const user = await UserModel.findByPk(userId);
		if (user) {
			// Actualizar token
			user.botToken = token;
			user.chatId = chatId;
			user.enabledBot = true;
			await user.save();
			const mqttAcl = await MqttAcl.findOne({
				where: {
					UserId: userId,
				},
			});
			const mqttUser = await MqttUserModel.findOne({
				where: {
					UserId: userId,
				},
			});
			try {
				telegramBots.set(userId, new Telegraf(token));
				telegramBots.get(userId)?.launch();
				mqttClientMap.get(userId)?.removeAllListeners('message');

				initConnectionMQTT({
					username: mqttUser!.username!,
					topic: mqttAcl!.topic!,
					password: mqttUser!.password_hash!,
					idUser: userId,
				});
				await initBotTelegram(user.id, chatId);
			} catch {}
			console.log(chatId);
		}
		return returnMessage(false, '');
	}

	@Query(() => Message)
	async getToken(@Ctx() { userId }: { userId: number }) {
		const user = await UserModel.findByPk(userId);
		if (user) {
			return returnMessage(
				false,
				JSON.stringify({
					token: user.botToken,
					chatId: user.chatId,
				}),
			);
		}
		return returnMessage(true, '{}');
	}

	@Mutation(() => Message)
	async toggleEnabledTelegram(
		@Ctx() { userId }: { userId: number },
		@Arg('enabled', { nullable: true }) enabled: boolean,
		@Arg('token', { nullable: true }) token: string,
		@Arg('chatId', { nullable: true }) chatId: string,
	) {
		const user = await UserModel.findByPk(userId);
		if (user) {
			user.enabledBot = enabled;
			await user.save();
			const mqttAcl = await MqttAcl.findOne({
				where: {
					UserId: userId,
				},
			});
			const mqttUser = await MqttUserModel.findOne({
				where: {
					UserId: userId,
				},
			});
			try {
				if (enabled) {
					telegramBots.get(userId)?.stop();
					telegramBots.delete(userId);
					telegramBots.set(userId, new Telegraf(token));
					telegramBots.get(userId)?.launch();
				}
				mqttClientMap.get(userId)?.removeAllListeners('message');

				initConnectionMQTT({
					username: mqttUser!.username!,
					topic: mqttAcl!.topic!,
					password: mqttUser!.password_hash!,
					idUser: userId,
				});
				if (enabled) {
					await initBotTelegram(user.id, chatId);
				}
			} catch {}
			console.log(chatId);
		}
		return returnMessage(false, '');
	}

	@Query(() => Message)
	async getEnabledTelegram(@Ctx() { userId }: { userId: number }) {
		const user = await UserModel.findByPk(userId);
		return returnMessage(user?.enabledBot || false, '');
	}
}

export default RulesResolver;
