import mqtt from 'mqtt';
import { Extra, Markup } from 'telegraf';
import { CallbackButton } from 'telegraf/typings/markup';
import { mqttClientMap, telegramBots, serverSocket} from '../Config/configMqtt';
import DeviceDataModel from '../Models/DeviceDataModel';
import DevicesModel, { IDeviceBase } from '../Models/DevicesModel';
import MqttAcl from '../Models/mqttAcl';
import RulesModel from '../Models/RulesModel';
import UserModel from '../Models/UserModel';
import { formatDate } from './formatDate';
import { Op } from 'sequelize';

type IInitConnection = {
	username: string;
	password: string;
	topic: string;
	idUser: number;
};

export const initConnectionMQTT = ({ username, password, topic, idUser}: IInitConnection) => {

	// mqtt credentials
	const mqttClient = mqtt.connect('mqtt://ipbroker', {
		port: 1883,
		host: 'ipbroker',
		clientId: 'access_control_server_' + Math.round(Math.random() * (0 - 10000) * -1),
		username: username,
		password: password,
		keepalive: 60,
		reconnectPeriod: 1000,
		protocol: 'mqtt',
		clean: true,
	});

	mqttClient.on('connect', (): void => {
		console.log('Conexión  MQTT Exitosa!');
		mqttClient?.subscribe(topic);
	});

	mqttClient.on('message', async (topic: string, payload: Buffer) => {
		const data = JSON.parse(payload.toString());
		const iot2tangleData = data.iot2tangle[1].data;
		try {
			for (const d of iot2tangleData) {
				Object.keys(d).forEach((key: string) => {
					serverSocket.emit(key, d[key]);
					console.log({
						key,
						data: d[key],
					});
				});
			}
		} catch (e) {
			console.log(e);
		}
		await DeviceDataModel.create({
			topic,
			data: payload.toString(),
		});
	});
	mqttClientMap.get(idUser)?.end(true);
	mqttClientMap.delete(idUser);
	mqttClientMap.set(idUser, mqttClient);
};

export const initBotTelegram = async (userId: number, chatId: string) => {
	const bot = telegramBots.get(userId)!;

	bot.on('callback_query', async (ctx) => {
		const callbackData = ctx.callbackQuery?.data;
		// Check if exists the data
		if (callbackData) {
			console.log(callbackData);
			const callbackDataJSON = JSON.parse(callbackData);
			const idDevice = callbackDataJSON[0];
			const topicDevice = callbackDataJSON[1];

			const userAcl = await MqttAcl.findOne({
				where: {
					UserId: userId,
				},
			});
			const topic = userAcl!.topic!;
			const device = await DevicesModel.findByPk(idDevice);
			const deviceData = await DeviceDataModel.findOne({
				where: {
					topic: {
						[Op.startsWith]: topic.substring(0, topic.length - 2),
					},
				},
				order: [['createdAt', 'DESC']],
			});

			if (deviceData && device) {
				const infoDevice = JSON.parse(device.info) as IDeviceBase;

				const date = deviceData.createdAt;
				date.setHours(date.getUTCHours() - 5);

				const iot2tangleData = JSON.parse(deviceData.data).iot2tangle[1].data;
				for (const d of iot2tangleData) {
					for (const key of Object.keys(d)) {
						if (key == topicDevice) {
							await ctx.reply(
								`El ultimo valor del dispositivo ${infoDevice.panelName} es: ${
									d[key]
								} con la fecha de ${formatDate(date)}`,
							);
						}
					}
				}
			} else {
				await ctx.reply(`Dispositivo ${topicDevice} no encontrado`);
			}
		} else {
			await ctx.reply('Ha ocurrido un error');
		}
	});

	// Command for consult info device
	bot.command('devices', async (ctx) => {
		const devices = await DevicesModel.findAll({
			where: {
				UserId: userId,
			},
		});

		const options: Array<CallbackButton> = [];
		for (const device of devices) {
			const info = JSON.parse(device.info) as IDeviceBase;
			if (info.type !== 'graphic') {
				options.push(
					Markup.callbackButton(
						info.panelName,
						`[${device.id}, "${info.topic}"]`,
					),
				);
			}
		}
		await ctx.reply(
			'Dispositivos',
			Extra.HTML().markup(Markup.inlineKeyboard(options)),
		);
	});

	// Consult the chatid
	bot.command('chatid', async (ctx) => {
		await ctx.reply(ctx.chat?.id.toString() || ':v');
	});

	// Consult the direction
	bot.command('direccion', async (ctx) => {
		const user = await UserModel.findByPk(userId);
		if (user) {
			await ctx.reply(`La direccion es: ${user.direction}`);
		} else {
			await ctx.reply('El usuario no existe');
		}
	});

	// Send Alert
	mqttClientMap
		.get(userId)
		?.addListener('message', async (_, payload: Buffer) => {
			const rules = await RulesModel.findAll({
				where: {
					UserId: userId,
				},
			});
			const dataMQTT = JSON.parse(payload.toString());
			const data = dataMQTT.iot2tangle[1].data;
			rules.forEach((rule) => {
				if (rule.state) {
					for (const dat of data) {
						Object.keys(dat).forEach((key) => {
							if (rule.topic === key) {
								// @ts-ignore
								const value = parseInt(dat[key]);
								if (rule.comparison === '>=') {
									if (value >= rule.number)
										bot.telegram.sendMessage(chatId, rule.message);
								} else if (rule.comparison === '<=') {
									if (value <= rule.number)
										bot.telegram.sendMessage(chatId, rule.message);
								}
							}
						});
					}
				}
			});
		});
};
