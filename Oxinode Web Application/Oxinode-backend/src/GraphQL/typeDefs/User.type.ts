import { ArgsType, Field, ObjectType } from 'type-graphql';
import 'reflect-metadata';

@ObjectType()
export class User {
	@Field()
	username!: string;

	@Field()
	password!: string;

	@Field({ nullable: true })
	isSuperuser?: 1 | 0;

	@Field({ nullable: true })
	salt?: string;
}

@ObjectType()
export class Message {
	@Field()
	error!: boolean;

	@Field({ nullable: false })
	message?: string;

	@Field({ nullable: true, defaultValue: null })
	token?: string;
}

@ArgsType()
export class UserCreateInput {
	@Field()
	name!: string;

	@Field()
	lastname!: string;

	@Field()
	email!: string;

	@Field()
	password!: string;

	@Field()
	direction!: string;
}

@ObjectType()
export class UserType {
	@Field()
	public name!: string;

	@Field()
	public lastname!: string;

	@Field()
	public email!: string;

	@Field()
	public password!: string;

	@Field({
		nullable: true,
	})
	public urlPhoto?: string;

	@Field({
		nullable: true,
	})
	public lastLogin?: string;
	@Field()
	direction!: string;
}

@ArgsType()
export class UserInput {
	@Field()
	public name!: string;

	@Field()
	public lastname!: string;

	@Field()
	public email!: string;

	@Field()
	public oldPassword?: string;

	@Field()
	public password?: string;
	@Field()
	direction!: string;
}
