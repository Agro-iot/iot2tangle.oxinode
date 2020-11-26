import bcryptjs from 'bcryptjs';
import cloudinary from 'cloudinary';
import { GraphQLUpload } from 'graphql-upload';
import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';
import 'reflect-metadata';
import shortid from 'shortid';
import { Arg, Args, Ctx, Mutation, Query, Resolver } from 'type-graphql';
import MqttAcl from '../../Models/mqttAcl';
import MqttUserModel from '../../Models/mqttUser';
import UserModel from '../../Models/UserModel';
import {
	Message,
	UserCreateInput,
	UserInput,
	UserType,
} from '../typeDefs/User.type';

export function returnMessage(
	error: boolean,
	message: string,
	token: string | null = null,
) {
	return {
		error,
		message,
		token,
	};
}

const generateUserHashMqtt = async (): Promise<string | void> => {
	const hashUser = shortid.generate();
	const oldUser = await MqttUserModel.findOne({
		where: {
			username: hashUser,
		},
	});
	if (!oldUser) {
		return hashUser;
	}
	await generateUserHashMqtt();
};

const generateTopicHashMqtt = async (): Promise<string | void> => {
	const hashTopic = shortid.generate();
	const oldTopic = await MqttAcl.findOne({
		where: {
			topic: hashTopic,
		},
	});
	if (!oldTopic) {
		return hashTopic;
	}
	await generateTopicHashMqtt();
};

@Resolver()
class UserResolver {
	@Mutation(() => Message)
	async createUser(
		@Args() { password, email, lastname, name, direction }: UserCreateInput,
	) {
		try {
			const oldUser = await UserModel.findOne({
				where: {
					email,
				},
			});
			if (!oldUser) {
				const password_hash = await bcryptjs.hash(password, 10);
				const newUser = UserModel.build({
					email,
					password: password_hash,
					lastname,
					name,
					direction,
				});
				const passwordMQTT = shortid.generate();
				const [userMQTT, topicMQTT] = await Promise.all([
					generateUserHashMqtt(),
					generateTopicHashMqtt(),
				]);
				const transporter = nodemailer.createTransport({
					service: 'hotmail',
					auth: {
						user: process.env.email_topicos || '',
						pass: process.env.password_email_topicos || '',
					},
				});
				const mailOptions: nodemailer.SendMailOptions = {
					from: process.env.email_topicos || '',
					to: email,
					subject: 'Cuenta en Peru-iot4.com',
					text: `Usuario MQTT: ${userMQTT} \nPassword MQTT ${passwordMQTT} \nTopico Raiz: ${topicMQTT}`,
				};
				const user = await newUser.save();

				await MqttAcl.build({
					topic: (topicMQTT as string) + '/#',
					access: 3,
					username: userMQTT as string,
					allow: 1,
					UserId: user.id,
				}).save();
				await MqttUserModel.build({
					username: userMQTT as string,
					password_hash: passwordMQTT as string,
					UserId: user.id,
				}).save();
				await transporter.sendMail(mailOptions);
				return returnMessage(false, 'Usuario registrado');
			}
			return returnMessage(true, 'Email ocupado');
		} catch (e) {
			return returnMessage(true, e);
		}
	}

	@Mutation(() => Message)
	async loginUser(
		@Arg('password') password: string,
		@Arg('email') email: string,
	) {
		const user = await UserModel.findOne({
			where: {
				email,
			},
		});
		if (user !== null) {
			const matchPasswords = await bcryptjs.compare(password, user.password);
			if (matchPasswords) {
				const token = jwt.sign(
					{ userId: user.id },
					'xctvybnimlbksdakdaskbsancasc',
				);
				user.lastLogin = Date.now().toString();
				await user.save({
					fields: ['lastLogin'],
				});

				return returnMessage(false, 'Inicio de sesionxd', token);
			}
			return returnMessage(true, 'Las credenciales estan malxd');
		}
		return returnMessage(true, 'El usuario no existe');
	}

	@Query(() => UserType)
	async getInfoUser(@Ctx() { userId }: { userId: number }) {
		return await UserModel.findOne({
			where: {
				id: userId,
			},
		});
	}

	@Mutation(() => Message)
	async updateUser(
		@Args()
		{ name, email, lastname, password, oldPassword, direction }: UserInput,
	) {
		const user = await UserModel.findOne({
			where: {
				email,
			},
		});
		if (user) {
			const passwordAreEqual = await bcryptjs.compare(
				oldPassword || '',
				user.password,
			);
			if (passwordAreEqual) {
				if (password) {
					user.password = await bcryptjs.hash(password, 10);
				}
				user.name = name;
				user.lastname = lastname;
				user.direction = direction;
				await user.save();
			} else {
				return returnMessage(true, 'La contraseña no coincide');
			}
		}
		return returnMessage(false, 'Ok');
	}

	@Mutation(() => Message)
	async uploadPerfilImage(
		@Ctx() { userId }: { userId: number },
		// @ts-ignore
		@Arg('image', (type) => GraphQLUpload) image: Upload,
	) {
		const { stream, filename, mimetype, encoding } = await image;
		console.log(stream, filename, mimetype, encoding);
		const user = await UserModel.findOne({
			where: {
				id: userId,
			},
		});
		if (user) {
			const imgCloudinary = await cloudinary.v2.uploader.upload(image);
			user.urlPhoto = imgCloudinary.public_id;
			await user.save();
			return returnMessage(false, '');
		}
		return returnMessage(true, 'Ha ocurrido un error');
	}
}

export default UserResolver;
