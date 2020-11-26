import { ArgsType, Field, Int, ObjectType } from 'type-graphql';

@ArgsType()
export class RulesInput {
	@Field()
	public topic!: string;

	@Field(() => String!)
	public comparison!: '>=' | '<=';

	@Field(() => Int!)
	public number!: number;

	@Field()
	public message!: string;

	@Field(() => Int, {
		nullable: true,
	})
	public idDB?: number;

	@Field()
	public state!: boolean;
}

@ObjectType()
export class RulesType {
	@Field({
		nullable: true,
	})
	public idDB?: number;

	@Field(() => String!)
	public comparison!: string;

	@Field(() => Int!)
	public number!: number;

	@Field()
	public topic!: string;

	@Field()
	public message!: string;

	@Field()
	public state!: boolean;
}
