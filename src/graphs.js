// Chartjs for graphs
import {
	Chart as ChartJS,
	CategoryScale,
	LinearScale,
	PointElement,
	LineElement,
	Title,
	Legend,
	Filler,
} from 'chart.js';
import { Scatter } from 'react-chartjs-2';

	ChartJS.register(
		CategoryScale,
		LinearScale,
		PointElement,
		LineElement,
		Title,
		Filler,
		Legend
	);

	export const ShowAltitudeGraph = ( { altitudeData, units, routeColour, showGraph } ) => {
		if ( !showGraph ) {
			return null;
		}
		let xAxisLabel = 'Distance (km)';
		let yAxisLabel = 'Height (m)';
		let xAxisFactor = 1000;
		let yAxisFactor = 1;
		if (units == 'imperial') {
			xAxisLabel = 'Distance (miles)';
			yAxisLabel = 'Height (ft)';
			xAxisFactor = 1609;
			yAxisFactor = 3.28;
		}
		const options = {
			responsive: true,
			showLine: true,
			maintainAspectRatio: true,
			animation: false,

			plugins: {
				legend: {
					display: false,
					position: 'top',
				},
				title: {
					display: true,
					text: 'Altitude',
				},
			},
			elements: {
				point: {
					radius: 1,
					borderWidth: 0,
				},
			},
			scales: {
				x: {
				  title: {
					display: true,
					text: xAxisLabel
				  },
				  ticks: {
                    callback: function(value, index, ticks) {
                        return (value/xAxisFactor).toFixed(2);
						}
					}

				},
				y: {
					title: {
						display: true,
						text: yAxisLabel
					},
					ticks: {
                    callback: function(value, index, ticks) {
                        return (value * yAxisFactor).toFixed(0);
						}
					}

				}
			}

		};

		const data = {
			datasets: [
				{
					data: altitudeData,
					fill: {value: -100},
					borderColor: routeColour,
					backgroundColor: routeColour,

				},
			],
		};

		return <Scatter options={ options } data={ data } height={ 75 } plugins={ [NoDataPlugin] } />;
	};


	// Plugin to show 'No Data' for empty graphs
	const NoDataPlugin = {
		afterDraw: function(chart) {
			if ( chart.data.datasets[ 0 ].data.length === 0 ) {

			  const ctx = chart.ctx;
			  const width = chart.width;
			  const height = chart.height

			  ctx.save();
			  ctx.textAlign = 'center';
			  ctx.textBaseline = 'middle';
			  ctx.fillText('No data to display', width / 2, height / 2);
			  ctx.restore();
			}
		}
	};
