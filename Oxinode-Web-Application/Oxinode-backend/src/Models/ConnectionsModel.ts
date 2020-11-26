import { Model, DataTypes } from 'sequelize';
import sequelize from '../DB/configDB';
import UserModel from './UserModel';

interface IConnectionsModel {
	id?: number;
	connectionName: string;
	clientId: string;
	username: string;
	password: string;
	notify: boolean;
	connectAuto: boolean;
	UserId: number;
}

class ConnectionsModel extends Model<IConnectionsModel> {
	public id?: number;

	public connectionName!: string;

	public clientId!: string;

	public username!: string;

	public password!: string;

	public notify!: boolean;

	public connectAuto!: boolean;

	public UserId!: number;

	public createdAt!: Date;

	public updatedAt!: Date;

	public deletedAt!: Date;
}

ConnectionsModel.init(
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
		password: {
			type: DataTypes.STRING(100),
			allowNull: false,
		},
		clientId: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		connectAuto: {
			type: DataTypes.BOOLEAN,
			allowNull: false,
		},
		connectionName: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		notify: {
			type: DataTypes.BOOLEAN,
			allowNull: false,
		},
		UserId: {
			type: DataTypes.INTEGER.UNSIGNED,
			allowNull: false,
		},
	},
	{
		timestamps: false,
		sequelize,
		modelName: 'connection',
		tableName: 'connection',
		freezeTableName: true,
	},
);

UserModel.hasMany(ConnectionsModel, {
	onDelete: 'cascade',
});

export default ConnectionsModel;
