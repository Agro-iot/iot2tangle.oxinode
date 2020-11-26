import React, { FC, memo, useEffect } from 'react';
import { Row } from 'react-materialize';
import { connect, useDispatch } from 'react-redux';
import { addGraphic, editGraphic } from '../../Redux/Actions/Graphics.action';
import { IGraphic } from '../../Redux/Reducers/Graphics.reducer';
import Graphic from './Graphic';

type IProps = {
	Graphics: IGraphic[];
};

const ListGraphics: FC<IProps> = (props) => {
	const { Graphics } = props;
	const dispatch = useDispatch();

	useEffect(() => {
		const graphics = sessionStorage.getItem('graphics');
		if (graphics) {
			const graphicsJSON = JSON.parse(graphics);
			if (Graphics.length === 0) {
				graphicsJSON.forEach(async (graphic: IGraphic) => {
					await dispatch(
						addGraphic({
							id: graphic.id,
							prevState: graphic.prevState,
						}),
					);
				});
			} else if (Graphics.length !== 0) {
				graphicsJSON.forEach(async (graphic: IGraphic) => {
					await dispatch(editGraphic(graphic));
				});
			}
		}
	}, []);

	return (
		<Row>
			{Graphics.map((graphic) => (
				<Graphic graphic={graphic} key={graphic.id} />
			))}
		</Row>
	);
};

const mapStateToProps = (state: any) => ({
	Graphics: state.GraphicsReducer,
});

export default connect(mapStateToProps)(memo(ListGraphics));
