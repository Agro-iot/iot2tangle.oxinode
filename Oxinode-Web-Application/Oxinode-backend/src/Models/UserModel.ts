import { Model, DataTypes, Optional } from 'sequelize';
import sequelize from '../DB/configDB';

interface IUserAttributes {
	id: number;
	name: string;
	lastname: string;
	email: string;
	password: string;
	urlPhoto?: string;
	lastLogin?: string;
	createdAt?: Date;
	updatedAt?: Date;
	botToken?: string;
	chatId?: string;
	enabledBot: boolean;
	direction: string;
}

interface IUserCreationAttributes
	extends Optional<IUserAttributes, 'id' | 'enabledBot'> {}

class UserModel
	extends Model<IUserAttributes, IUserCreationAttributes>
	implements IUserAttributes {
	public id!: number;
	public name!: string;
	public lastname!: string;
	public email!: string;
	public password!: string;
	public urlPhoto?: string;
	public lastLogin?: string;
	public updatedAt!: Date;
	public botToken?: string;
	public chatId?: string;
	public enabledBot!: boolean;
	public direction!: string;
	public readonly createdAt!: Date;
}

UserModel.init(
	{
		id: {
			type: DataTypes.INTEGER.UNSIGNED,
			autoIncrement: true,
			primaryKey: true,
			allowNull: false,
		},
		name: {
			type: DataTypes.STRING(50),
			allowNull: false,
		},
		lastname: {
			type: DataTypes.STRING(50),
			allowNull: false,
		},
		email: {
			type: DataTypes.STRING(40),
			allowNull: false,
			unique: true,
		},
		password: {
			type: DataTypes.STRING(100),
			allowNull: false,
		},
		lastLogin: {
			type: DataTypes.STRING,
			allowNull: true,
			defaultValue: null,
			comment: 'Fecha de ultima sesion',
		},
		urlPhoto: {
			type: DataTypes.STRING,
			allowNull: true,
			defaultValue: null,
			comment: 'Url de foto de perfil',
		},
		botToken: {
			type: DataTypes.STRING,
			allowNull: true,
			defaultValue: null,
		},
		chatId: {
			type: DataTypes.STRING,
			allowNull: true,
			defaultValue: null,
		},
		enabledBot: {
			type: DataTypes.BOOLEAN,
			allowNull: false,
			defaultValue: false,
		},
		direction: {
			type: DataTypes.STRING,
			allowNull: false,
		},
	},
	{
		charset: 'utf8',
		createdAt: true,
		updatedAt: true,
		deletedAt: false,
		modelName: 'User',
		tableName: 'user',
		sequelize,
	},
);

export default UserModel;
