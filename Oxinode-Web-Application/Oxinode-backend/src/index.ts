require('dotenv').config();
import { Application } from 'express';
import configApollo from './Config/configApollo';
import sequelize from './DB/configDB';
import './Config/configCloudinary';
import './Config/configMqtt';
import { initSockets } from './Config/configMqtt';
import SocketIO, { Server } from 'socket.io';
import https from 'https';
import http from 'http';
import fs from 'fs';

(async () => {
	const server: Application = await configApollo();
	let NodeServer;
	if (process.env.ssl === 'off') {
		NodeServer = http.createServer(server);
	} else {
		// Certificate
		const key = fs.readFileSync(process.env.private_key!, 'utf8');
		const cert = fs.readFileSync(process.env.certificate!, 'utf8');
		const ca = fs.readFileSync(process.env.ca!, 'utf8');
		NodeServer = https.createServer(
			{
				key,
				cert,
				ca,
			},
			server,
		);
	}

	const io: Server = SocketIO(NodeServer, {
		handlePreflightRequest: (_server1, req, res) => {
			res.writeHead(200, {
				'Access-Control-Allow-Headers': 'Content-Type, Authorization',
				'Access-Control-Allow-Origin': req.headers.origin,
				'Access-Control-Allow-Credentials': 'true',
			});
			res.end();
		},
	});

	initSockets(io);
	try {
		await NodeServer.listen(3001);
		console.info(`Server on port ${3001}`);
	} catch (error) {
		console.error(error);
	}

	try {
		await sequelize.authenticate({ logging: false });
		await sequelize.sync({ alter: true, logging: false });
		console.info('Connection has been established successfully.');
	} catch (error) {
		console.error('Unable to connect to the database:', error);
	}
})();
