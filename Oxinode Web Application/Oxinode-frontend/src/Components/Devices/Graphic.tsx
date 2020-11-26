import styled from '@emotion/styled';
import React, { FC, memo, useContext, useEffect, useRef } from 'react';
import { SocketsContext } from '../../Hooks/SocketsProvider';
import styles from '../../Pages/Dashboard/Dashboard.module.scss';
import { GraphicDevice } from '../../Redux/Reducers/Devices.reducer';
import CanvasJSReact from '../../assets/js/canvasjs.react';
import TitleDevice from './TitleDevice';
const Chart = CanvasJSReact.CanvasJSChart;

type IProps = {
	graphic: GraphicDevice;
	dropdown: React.ReactElement;
};

const DivGraphic = styled.div`
	top: 60%;
	left: 50%;
	transform: translateY(-50%) translateX(-50%);
	position: relative;
`;

export type IGraphicCanvas = {
	x: any;
	y: number;
	markerType?: string;
	indexLabel?: string;
};

const Graphic: FC<IProps> = (props) => {
	const { graphic } = props;
	const io = useContext(SocketsContext);
	const ref = useRef(null);
	const chartPoints = useRef<IGraphicCanvas[]>([]);

	useEffect(() => {
		const ioListener = (data: string) => {
			const y = parseInt(data);
			if (chartPoints.current.length == 8) {
				chartPoints.current.shift();
			}
			chartPoints.current.push({
				y,
				x: new Date(),
				indexLabel: `${y}`,
				markerType: 'circle',
			});
			(ref.current as any).render();
		};
		io.addEventListener(graphic.topic, ioListener);
		chartPoints.current.length = 0;
		return () => {
			io.removeListener(graphic.topic, ioListener);
		};
	}, [graphic.topic, io]);

	return (
		<div className={`card ${styles.deviceCard} p-relative w-100 hoverable`}>
			<TitleDevice className={'p-absolute'}>{graphic.panelName}</TitleDevice>

			<DivGraphic>
				<Chart
					onRef={(refChart) => (ref.current = refChart)}
					options={{
						zoomEnabled: false,
						animationEnabled: false,
						axisX: {
							interval: 25,
							intervalType: 'second',
							labelFormatter(e) {
								const hours24 = e.value.getHours();
								const pmOam = hours24 > 12 ? 'PM' : 'AM';
								const hour = (hours24 > 12 ? hours24 - 12 : hours24)
									.toString()
									.padStart(2, '0');
								const minutes = e.value
									.getMinutes()
									.toString()
									.padStart(2, '0');
								const seconds = e.value
									.getSeconds()
									.toString()
									.padStart(2, '0');
								return `${hour}:${minutes}:${seconds} ${pmOam}`;
							},
						},
						height: '165',
						data: [
							{
								markerSize: 10,
								indexLabelFontSize: 14,
								type: 'line',
								dataPoints: chartPoints.current,
							},
						],
					}}
				/>
			</DivGraphic>

			{props.dropdown}
		</div>
	);
};

export default memo(Graphic);
