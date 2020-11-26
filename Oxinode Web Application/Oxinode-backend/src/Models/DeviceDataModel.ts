import moment from 'moment';
import { Model, Optional, DataTypes } from 'sequelize';
import sequelize from '../DB/configDB';
import DevicesModel from './DevicesModel';

interface IDeviceDataModel {
	id: number;
	data: string;
	createdAt?: Date;
	topic: string;
}

interface IDeviceDataModelOption
	extends Optional<IDeviceDataModel, 'id' | 'createdAt'> {}

class DeviceDataModel
	extends Model<IDeviceDataModel, IDeviceDataModelOption>
	implements IDeviceDataModel {
	public id!: number;
	public data!: string;
	public topic!: string;
	public readonly createdAt!: Date;
}

DeviceDataModel.init(
	{
		id: {
			type: DataTypes.INTEGER.UNSIGNED,
			allowNull: false,
			autoIncrement: true,
			primaryKey: true,
		},
		data: {
			type: DataTypes.TEXT,
			allowNull: false,
		},
		topic: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		createdAt: {
			type: DataTypes.DATE,
			set(val: Date) {
				this.setDataValue('createdAt', moment.utc(val).toDate());
			},
		},
	},

	{
		charset: 'utf8',
		freezeTableName: true,
		tableName: 'Records',
		modelName: 'Records',
		sequelize,
		createdAt: true,
		updatedAt: false,
	},
);

DevicesModel.hasMany(DeviceDataModel, {
	onDelete: 'cascade',
});

DeviceDataModel.belongsTo(DevicesModel);

export default DeviceDataModel;
