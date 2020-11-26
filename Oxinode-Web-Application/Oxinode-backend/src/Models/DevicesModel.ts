import { DataTypes, Model } from 'sequelize';
import sequelize from '../DB/configDB';
import UserModel from './UserModel';

interface IDevicesModel {
	UserId: number;
	id?: number;
	info: string;
}

class DevicesModel extends Model<IDevicesModel> {
	public id!: number;
	public UserId!: number;
	public info!: string;
	public createdAt!: Date;
	public updatedAt!: Date;
	public deletedAt!: Date;
}

DevicesModel.init(
	{
		id: {
			type: DataTypes.INTEGER.UNSIGNED,
			autoIncrement: true,
			allowNull: false,
			primaryKey: true,
		},
		UserId: {
			type: DataTypes.INTEGER.UNSIGNED,
			allowNull: false,
		},
		info: {
			type: DataTypes.TEXT,
			allowNull: false,
		},
	},
	{
		deletedAt: true,
		createdAt: true,
		updatedAt: true,
		sequelize,
		modelName: 'Devices',
		tableName: 'Device',
		freezeTableName: true,
		charset: 'utf8',
	},
);

UserModel.hasMany(DevicesModel, {
	onDelete: 'cascade',
	onUpdate: 'cascade',
});

export default DevicesModel;

export type IDeviceBase = {
	panelName: string;
	topic: string;
	idDB: number;
	qos: string;
	id: number;
	type: string;
};
