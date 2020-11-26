import 'reflect-metadata';
import { ObjectType, Field } from 'type-graphql';

@ObjectType()
export class DevicesType {
	@Field()
	id!: number;

	@Field()
	UserId!: number;

	@Field()
	info!: string;
}
