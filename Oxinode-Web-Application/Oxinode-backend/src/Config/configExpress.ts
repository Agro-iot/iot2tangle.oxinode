import express, { Application } from 'express';
import cors from 'cors';
import DeviceDataRouter from '../Routes/DeviceData';
import userRoutes from '../Routes/User';

function configExpress(app: Application): Application {
	app.use(cors({ origin: '*' }));
	app.use(express.json());
	app.set('PORT', process.env.PORT || 3000);

	// app.get(
	// 	'/.well-known/acme-challenge/uLC8uM3pIKAzW-lDeIcjS0_atB0497f6fCkK3ChaeZE',
	// 	(_, res) => {
	// 		res.sendFile(path.join(__dirname, '../../file.txt'));
	// 	},
	// );

	app.use(userRoutes);
	app.use(DeviceDataRouter);

	return app;
}

export default configExpress;
