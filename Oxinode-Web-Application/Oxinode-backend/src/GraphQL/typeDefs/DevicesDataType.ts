import { Field, ID, Int, ObjectType } from 'type-graphql';

@ObjectType()
export class DevicesDataType {
	@Field(() => ID!)
	id!: number;
	@Field(() => Int!)
	data!: number;
	@Field()
	createdAt!: Date;
	@Field()
	topic!: string;
}
