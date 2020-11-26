import { IGraphicCanvas } from '../../Components/Devices/Graphic';
import GraphicsActions from '../Actions/Graphics.action';

export type IGraphic = {
	id: number;
	prevState?: {
		chartPoints: Array<IGraphicCanvas>;
		title: string;
	};
};

type IAction = {
	payload: IGraphic;
	type: string;
};

const GraphicsReducer = (
	state: IGraphic[] = [],
	action: IAction,
): IGraphic[] => {
	//
	switch (action.type) {
		case GraphicsActions.ADD:
			return [...state, action.payload];
		case GraphicsActions.REMOVE:
			const graphicsSession: Array<IGraphic> = JSON.parse(
				sessionStorage.getItem('graphics') || '[]',
			);
			const newGraphicsSession = graphicsSession.filter(
				(graph) => graph.id != action.payload.id,
			);
			sessionStorage.setItem('graphics', JSON.stringify(newGraphicsSession));
			return state.filter((value) => value.id !== action.payload.id);
		case GraphicsActions.EDIT:
			return state.map((value) => {
				if (value.id === action.payload.id) return action.payload;
				return value;
			});
		default:
			return state;
	}
};

export default GraphicsReducer;
