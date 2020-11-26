import { Router } from 'express';
import multer from 'multer';
import cloudinary from 'cloudinary';
import path from 'path';
import fs from 'fs';
import jwt from 'jsonwebtoken';
import UserModel from '../Models/UserModel';

const upload = multer({
	dest: path.join(__dirname, '../../temp/'),
});
const userRoutes = Router();

userRoutes.post(
	'/user/uploadPhoto',
	upload.single('image'),
	async (req, res) => {
		const img = req.file;
		try {
			if (img) {
				const imgUpload = await cloudinary.v2.uploader.upload(img.path);
				fs.unlink(img.path, () => {
					//
				});
				const { userId } = jwt.decode(req.body.token!) as { userId: number };
				const user = await UserModel.findByPk(userId);
				user!.urlPhoto = imgUpload.public_id;
				await user!.save();
				res.json({ error: false, message: imgUpload.public_id });
			}
			throw new Error();
		} catch (e) {
			console.log(e);
			res.json({ error: true, message: 'Hubo un error' });
		}
	},
);

userRoutes.post('/user/isAuth', async (req, res) => {
	//
	const token = req.body.token;
	try {
		const { userId } = (await jwt.decode(token)) as { userId: number };
		const user = await UserModel.findByPk(userId);
		if (user) {
			res.json({
				auth: true,
			});
		} else {
			throw new Error();
		}
	} catch {
		res.json({
			auth: false,
		});
	}
});

export default userRoutes;
