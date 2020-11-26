import { IRule } from '../Reducers/RulesReducer';

const RulesAction = {
	ADD: 'ADD_RULES',
	REMOVE: 'REMOVE_RULES',
	EDIT: 'EDIT_RULES',
};

export default RulesAction;

export const addRule = (rule: IRule) => ({
	type: RulesAction.ADD,
	payload: rule,
});

export const removeRule = (rule: IRule) => ({
	type: RulesAction.REMOVE,
	payload: rule,
});

export const editRule = (rule: IRule) => ({
	type: RulesAction.EDIT,
	payload: rule,
});
