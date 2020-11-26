import { DataTypes, Model } from 'sequelize';
import sequelize from '../DB/configDB';
import UserModel from './UserModel';

interface IMqttAcl {
	id?: number;
	allow?: number;
	ipaddr?: string;
	username?: string;
	clientid?: string;
	access?: number;
	topic?: string;
	UserId: number;
}

class MqttAcl extends Model<IMqttAcl> implements IMqttAcl {
	public id?: number;
	public allow?: number;
	public ipaddr?: string;
	public username?: string;
	public clientid?: string;
	public access?: number;
	public topic?: string;
	public UserId!: number;
}

MqttAcl.init(
	{
		id: {
			type: DataTypes.INTEGER.UNSIGNED,
			allowNull: false,
			autoIncrement: true,
			primaryKey: true,
		},
		allow: {
			type: DataTypes.INTEGER({ length: 1 }),
			allowNull: true,
			defaultValue: 1,
			comment: '0: Deny, 1: Allow',
		},
		ipaddr: {
			type: DataTypes.STRING(60),
			allowNull: true,
			defaultValue: null,
			comment: 'ipAdress',
		},
		username: {
			type: DataTypes.STRING(100),
			allowNull: true,
			defaultValue: true,
			comment: 'Username',
		},
		clientid: {
			type: DataTypes.STRING(100),
			allowNull: true,
			defaultValue: null,
			comment: 'Client ID',
			unique: true,
		},
		access: {
			type: DataTypes.INTEGER({ length: 2 }),
			allowNull: false,
			comment: '1: Subscribe, 2: Publish, 3: Pubsub',
		},
		topic: {
			type: DataTypes.STRING(100),
			allowNull: false,
			defaultValue: '',
			comment: 'Topic Filter',
			unique: true,
		},
		UserId: {
			type: DataTypes.INTEGER.UNSIGNED,
			allowNull: false,
		},
	},
	{
		freezeTableName: true,
		timestamps: false,
		tableName: 'mqtt_acl',
		modelName: 'mqttAcl',
		sequelize,
	},
);

UserModel.hasOne(MqttAcl, {
	onDelete: 'cascade',
	as: 'mqtt_acl',
});

MqttAcl.belongsTo(UserModel, {});

export default MqttAcl;
