// eslint-disable-next-line max-classes-per-file
import 'reflect-metadata';
import { Field, ArgsType, ObjectType } from 'type-graphql';

@ArgsType()
export class ConnectionsArgs {
	@Field()
	connectionName!: string;

	@Field()
	connectAuto!: boolean;

	@Field()
	notify!: boolean;
}

@ObjectType()
export class ConnectionType {
	@Field()
	connectionName?: string;

	@Field()
	connectAuto?: boolean;

	@Field()
	notify?: boolean;

	@Field()
	id!: number;
}
