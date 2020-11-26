import { IGraphic } from '../Reducers/Graphics.reducer';

const GraphicsActions = {
	ADD: 'ADD_GRAPHIC_RECORDS',
	REMOVE: 'REMOVE_GRAPHIC_RECORDS',
	EDIT: 'EDIT_GRAPHIC_RECORDS',
};

export const addGraphic = (graphic: IGraphic) => ({
	type: GraphicsActions.ADD,
	payload: graphic,
});

export const removeGraphic = (id: number) => ({
	type: GraphicsActions.REMOVE,
	payload: { id },
});

export const editGraphic = (graphic: IGraphic) => ({
	type: GraphicsActions.EDIT,
	payload: graphic,
});

export default GraphicsActions;
