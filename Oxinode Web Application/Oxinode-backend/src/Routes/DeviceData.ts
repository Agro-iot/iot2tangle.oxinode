import { Router, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { Op } from 'sequelize';
import DeviceDataModel from '../Models/DeviceDataModel';
import { Parser } from 'json2csv';
import DevicesModel from '../Models/DevicesModel';
import MqttAcl from '../Models/mqttAcl';
import { formatDate } from '../Utils/formatDate';

const DeviceDataRouter = Router();

DeviceDataRouter.post('/data/download', async (req: Request, res: Response) => {
	const { id, token, topic } = req.body;
	if (id && token) {
		const device = await DevicesModel.findByPk(id);
		if (device) {
			const { userId } = jwt.decode(token) as { userId: number };
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
				const deviceData = await DeviceDataModel.findAll({
					where: {
						topic: {
							[Op.startsWith]: baseTopic,
						},
					},
				});
				const { panelName } = JSON.parse(device.info);

				const dataExcel: Array<{
					createdAt: string;
					data: number;
				}> = [];
				deviceData.forEach((dat) => {
					const date = new Date();
					date.setUTCFullYear(dat.createdAt.getUTCFullYear());
					date.setUTCMonth(dat.createdAt.getUTCMonth());
					date.setUTCDate(dat.createdAt.getUTCDate());
					date.setUTCHours(dat.createdAt.getUTCHours() - 5);
					date.setUTCSeconds(dat.createdAt.getUTCSeconds());

					const info = JSON.parse(dat.data);
					const iot2tangleData = info.iot2tangle[1].data;
					for (const d of iot2tangleData) {
						Object.keys(d).forEach((key) => {
							if (key == topic) {
								dataExcel.push({
									createdAt: formatDate(date),
									// data: dat.data,
									data: parseInt(d[key]),
								});
							}
						});
					}
				});

				const json2csv = new Parser({
					fields: [
						{
							label: 'Creado en',
							value: 'createdAt',
						},
						{
							label: 'data',
							value: 'data',
						},
					],
				});

				const csv = json2csv.parse(dataExcel);
				res.header('Content-Type', 'text/csv');
				res.header('name', panelName);
				res.attachment('Data.csv');
				res.send(csv);
			}
		} else {
			res.json({
				error: true,
				msg: 'El dispositivo no existe',
			});
		}
	} else {
		res.json({
			error: true,
			msg: 'El dispositivo no existe',
		});
	}
});

export default DeviceDataRouter;
