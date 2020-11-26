import { MqttClient } from 'mqtt';
import { Server, Socket } from 'socket.io';
import jwt from 'jsonwebtoken';
import { TelegrafContext } from 'telegraf/typings/context';
import DevicesModel from '../Models/DevicesModel';
import MqttAcl from '../Models/mqttAcl';
import MqttUserModel from '../Models/mqttUser';
import UserModel from '../Models/UserModel';
import { Telegraf } from 'telegraf';
import { initConnectionMQTT } from '../Utils/Utils';

export const mqttClientMap = new Map<number, MqttClient>();
export const telegramBots = new Map<number, Telegraf<TelegrafContext>>();
export let serverSocket: Server;

export const addConnection = (id: number, connection: MqttClient) => {
	mqttClientMap.set(id, connection);
};

export const setServerSocker = (w: Server) => {
	serverSocket = w;
};

export const initSockets = (ws: Server) => {
	ws.on('connection', (socket: Socket) => {
		console.log(`Socket init`);

		socket.on('login', async (data) => {
			//
			if (data.token) {
				const { userId } = jwt.decode(data.token) as { userId: number };
				const user = await UserModel.findOne({
					where: {
						id: userId,
					},
				});
				if (user) {
					const [mqttUser, mqttAcl] = await Promise.all([
						MqttUserModel.findOne({
							where: {
								UserId: user.id,
							},
						}),
						MqttAcl.findOne({
							where: {
								UserId: user.id,
							},
						}),
					]);

					initConnectionMQTT({
						idUser: user.id,
						topic: mqttAcl!.topic || '',
						password: mqttUser!.password_hash || '',
						username: mqttUser!.username || '',
					});
					setServerSocker(ws);
				}
			}
		});

		// Add a new device
		socket.on('addDevice', async (data) => {
			const { userId } = jwt.decode(data.token) as { userId: number };
			const newDevice = await DevicesModel.create({
				UserId: userId,
				info: JSON.stringify(data.info),
			});
			socket.emit('responseAddDevice', {
				error: false,
				data: Object.assign({}, data.info, { idDB: newDevice.id }),
			});
		});
	});
};
