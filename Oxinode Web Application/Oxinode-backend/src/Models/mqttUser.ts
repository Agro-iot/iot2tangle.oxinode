import { Model, DataTypes, Optional } from 'sequelize';
import sequelize from '../DB/configDB';
import UserModel from './UserModel';

interface IMqttUser {
	id: number;
	password_hash?: string;
	username?: string;
	salt?: string;
	is_superuser?: number;
	created?: Date;
	UserId: number;
}

interface IMqttCreation extends Optional<IMqttUser, 'id'> {}

class MqttUserModel extends Model<IMqttUser, IMqttCreation>
	implements IMqttUser {
	public id!: number;
	public password_hash?: string;
	public username?: string;
	public salt?: string;
	public is_superuser?: number;
	public created?: Date;
	public UserId!: number;
}

MqttUserModel.init(
	{
		id: {
			type: DataTypes.INTEGER.UNSIGNED,
			allowNull: false,
			autoIncrement: true,
			primaryKey: true,
		},
		username: {
			type: DataTypes.STRING(50),
			allowNull: false,
		},
		password_hash: {
			type: DataTypes.STRING(100),
			allowNull: true,
			defaultValue: null,
		},
		salt: {
			type: DataTypes.STRING(30),
			allowNull: true,
			defaultValue: null,
		},
		is_superuser: {
			type: DataTypes.INTEGER({ length: 1 }),
			allowNull: true,
			defaultValue: 0,
		},
		created: {
			type: DataTypes.DATE,
			allowNull: true,
			defaultValue: null,
		},
		UserId: {
			type: DataTypes.INTEGER.UNSIGNED,
			allowNull: false,
		},
	},
	{
		timestamps: false,
		sequelize,
		modelName: 'mqtt_user',
		tableName: 'mqtt_user',
		freezeTableName: true,
	},
);

UserModel.hasOne(MqttUserModel, {
	onDelete: 'cascade',
	as: 'mqtt_user',
});

export default MqttUserModel;
