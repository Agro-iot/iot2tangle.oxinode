type IProps = {
	labels?: Array<string>;
	data?: Array<number>;
};

export type IGraphicState = {
	labels: Array<string>;
	datasets: Array<{
		data: Array<number>;
		fill: true;
		backgroundColor: string;
		borderColor: string;
		borderWidth: number;
	}>;
};

export const createGraphic = (props: IProps): IGraphicState => {
	return {
		labels: props.labels || [],
		datasets: [
			{
				data: props.data || [],
				fill: true,
				backgroundColor: 'rgba(255,0,0,0.4)',
				borderColor: 'rgba(255,0,0,1)',
				borderWidth: 3,
			},
		],
	};
};

export const graphicOptions = {
	plugins: {
		zoom: {
			pan: {
				enabled: false,
				mode: 'y',
				rangeMin: {
					y: 0,
				},
			},
			zoom: {
				enabled: false,
				drag: true,
				mode: 'y',
				// sensitivity: 0.0005,
				speed: 0.05,
				rangeMin: {
					y: 0,
				},
			},
		},
	},
	maintainAspectRatio: false,
	responsive: true,
	scales: {
		yAxes: [
			{
				ticks: {
					beginAtZero: true,
				},
			},
		],
	},
};
