import { Model, DataTypes, Optional } from 'sequelize';
import sequelize from '../DB/configDB';
import UserModel from './UserModel';

interface IRules {
	id: number;
	comparison: '<=' | '>=';
	number: number;
	message: string;
	UserId: number;
	topic: string;
	state: boolean;
}

interface IRulesOptional extends Optional<IRules, 'id'> {}

class RulesModel extends Model<IRules, IRulesOptional> implements IRules {
	//
	public id!: number;
	public comparison!: '<=' | '>=';
	public number!: number;
	public UserId!: number;
	public message!: string;
	public topic!: string;
	public state!: boolean;
}

RulesModel.init(
	{
		id: {
			type: DataTypes.INTEGER.UNSIGNED,
			allowNull: false,
			autoIncrement: true,
			primaryKey: true,
		},
		message: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		topic: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		number: {
			type: DataTypes.INTEGER,
			allowNull: false,
		},
		comparison: {
			type: DataTypes.ENUM('<=', '>='),
			allowNull: false,
		},
		UserId: {
			type: DataTypes.INTEGER.UNSIGNED,
			allowNull: false,
		},
		state: {
			type: DataTypes.BOOLEAN,
			allowNull: false,
		},
	},
	{
		sequelize,
		createdAt: true,
		modelName: 'RulesModel',
		tableName: 'Rule',
		freezeTableName: true,
		updatedAt: false,
	},
);

UserModel.hasMany(RulesModel, {
	onDelete: 'cascade',
});
RulesModel.belongsTo(UserModel);

export default RulesModel;
