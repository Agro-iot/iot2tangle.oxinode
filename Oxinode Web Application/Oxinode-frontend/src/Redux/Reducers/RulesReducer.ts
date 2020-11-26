import RulesAction from '../Actions/RulesAction';

export type IRule = {
	topic: string;
	comparison: '<=' | '>=';
	number: string;
	message: string;
	id: number;
	idDB?: number;
	state: boolean;
	[key: string]: string | number | undefined | boolean;
};

const RulesReducer = (state: IRule[] = [], action: any) => {
	//
	switch (action.type) {
		case RulesAction.ADD:
			let found = false;
			const oldRule = state.filter((rule) => rule.id === action.payload.id);
			found = oldRule.length !== 0;
			if (found) {
				return state.map((rule) => {
					if (rule.id === action.payload.id) return action.payload;
					return rule;
				});
			} else {
				return [...state, action.payload];
			}
		case RulesAction.REMOVE:
			return state.filter((rule) => rule.id !== action.payload.id);
		case RulesAction.EDIT:
			return state.map((rule) => {
				if (rule.id === action.payload.id) return action.payload;
				return rule;
			});
		default:
			return state;
	}
};

export default RulesReducer;
