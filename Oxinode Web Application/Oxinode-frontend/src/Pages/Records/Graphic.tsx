import { useMutation } from '@apollo/client';
import React, { FC, memo, useEffect, useRef, useState } from 'react';
import { Col } from 'react-materialize';
import { connect, useDispatch } from 'react-redux';
import DropdownGraphic from '../../Components/Devices/DropdownGraphic';
import { IGraphicCanvas } from '../../Components/Devices/Graphic';
import { Mutation } from '../../GraphQL/QueryMutation';
import { removeGraphic } from '../../Redux/Actions/Graphics.action';
import { IDeviceState } from '../../Redux/Reducers/Devices.reducer';
import { IGraphic } from '../../Redux/Reducers/Graphics.reducer';
import showAlert from '../../Utils/Alert';
import { shortandMonths } from '../../Utils/DateUtils';
import { IOptionRecords } from './AddRecordOptions';
import showAlertAddGraphic from './showAlertAddGraphic';
import CanvasJSReact from '../../assets/js/canvasjs.react';
const Chart = CanvasJSReact.CanvasJSChart;

type IProps = {
	graphic: IGraphic;
	Devices: IDeviceState[];
};

type IMutationRecord = {
	getData: Array<{
		data: number;
		createdAt: string;
		topic: string;
	}>;
};

const Graphic: FC<IProps> = (props) => {
	const { graphic, Devices } = props;
	const dispatch = useDispatch();
	const [graphicInfo, setGraphicInfo] = useState<IOptionRecords | null>(null);
	const [addMutationData, { data }] = useMutation<IMutationRecord>(
		Mutation.getRecordsDevice,
	);
	const chartRef = useRef(null);
	const [title, setTitle] = useState('Dispositivo no Configurado');
	const chartPoints = useRef<IGraphicCanvas[]>([]);

	const handleRemove = async () => {
		await showAlert().fire({
			icon: 'question',
			title: 'Confirmar',
			text: 'Desea eliminar esta grafica?',
			preConfirm() {
				dispatch(removeGraphic(graphic.id));
			},
		});
	};

	useEffect(() => {
		const fetchInfo = async () => {
			if (graphicInfo) {
				const id = graphicInfo.topic;
				const infodevice = Devices.filter(
					(mydevice) => mydevice.topic === id,
				)[0];

				const date = new Date();
				date.setFullYear(parseInt(graphicInfo.year));
				date.setMonth(parseInt(graphicInfo.month));
				date.setDate(parseInt(graphicInfo.day));
				date.setHours(parseInt(graphicInfo.hour));
				date.setMinutes(0);
				date.setSeconds(0);
				date.setMilliseconds(0);

				await addMutationData({
					variables: {
						topic: infodevice.topic,
						year: date.getUTCFullYear(),
						month: date.getUTCMonth(),
						day: date.getUTCDate(),
						hour: date.getUTCHours(),
					},
				});
			}
		};
		fetchInfo();
	}, [graphicInfo]);

	useEffect(() => {
		if (data)
			if (data.getData.length !== 0) {
				// Create the graphic with information
				chartPoints.current.length = 0;
				data.getData.forEach((data) => {
					chartPoints.current.push({
						x: new Date(data.createdAt),
						y: data.data,
						indexLabel: data.data.toString(),
						markerType: 'circle',
					});
				});

				console.log(data.getData);
				const device = Devices.filter(
					(deviceState) => deviceState.topic === data!.getData[0].topic,
				)[0];
				const newTitle = `Dispositivo: ${device.panelName} Fecha: ${
					graphicInfo?.year
				}/${parseInt(graphicInfo!.month) + 1}/${graphicInfo?.day}  ${
					graphicInfo?.hour
				} Hrs`;

				// Save in the Session Storage
				const prevGraphics: string = sessionStorage.getItem('graphics') || '[]';

				const newGraphic = {
					id: graphic.id,
					prevState: {
						chartPoints: chartPoints.current,
						title: newTitle,
					},
				};

				const prevGraphicsJSON: Array<any> = JSON.parse(prevGraphics);

				let found = false;
				prevGraphicsJSON.forEach((prevGraphicJSON, index) => {
					if (prevGraphicJSON.id === graphic.id) {
						prevGraphicsJSON[index] = newGraphic;
						found = true;
					}
				});
				if (!found) {
					prevGraphicsJSON.push(newGraphic);
				}
				sessionStorage.setItem('graphics', JSON.stringify(prevGraphicsJSON));
				setTitle(newTitle);
				(chartRef.current as any)?.render();
			} else {
				setTitle('Sin Registros');
				chartPoints.current.length = 0;
				(chartRef.current as any)?.render();
			}
		else {
			setGraphicInfo(null);
		}
	}, [data]);

	const handleEdit = async () => {
		const values: IOptionRecords | undefined = await showAlertAddGraphic(
			Devices,
		);
		if (values) setGraphicInfo(values);
	};

	useEffect(() => {
		// Load the prev information
		if (graphic.prevState) {
			chartPoints.current.length = 0;
			setTitle(graphic.prevState.title);
			graphic.prevState.chartPoints.forEach((data) => {
				chartPoints.current.push({
					x: new Date(data.x),
					y: data.y,
					indexLabel: data.indexLabel,
					markerType: 'circle',
				});
			});
			(chartRef.current as any)?.render();
		}
	}, []);

	return (
		<Col s={12}>
			<div
				className={`card hoverable p-relative hoverable`}
				style={{ borderRadius: '20px' }}
			>
				<div className='card-content'>
					<h6 className={'card-title text-center'}>{title}</h6>
					<div>
						<div
							style={{
								height: '50vh',
							}}
						>
							<Chart
								onRef={(ref) => (chartRef.current = ref)}
								options={{
									zoomEnabled: true,
									animationEnabled: true,
									toolTip: {
										shared: true,
										contentFormatter: (e) => {
											const date = new Date(e.entries[0].dataPoint.x);
											return `${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;
										},
									},
									axisX: {
										interval: 1,
										intervalType: 'minute',
										labelFormatter(e) {
											const date = e.value;
											const month = shortandMonths[date.getMonth()];
											const year = date.getFullYear().toString().substr(2);
											const hour = date.getHours();
											return `${date.getDate()}\\${month}\\${year} ${hour}:${date.getMinutes()}:${date.getSeconds()} `;
										},
									},
									height: '300',
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
						</div>
					</div>
				</div>

				<DropdownGraphic
					idTrigger={`graphic-${graphic.id}`}
					handleRemove={handleRemove}
					handleEdit={handleEdit}
				/>
			</div>
		</Col>
	);
};

const mapStateToProps = (state: any) => ({
	Devices: state.DevicesReducer,
});

export default connect(mapStateToProps)(memo(Graphic));
