import React from 'react';
import Chart from 'react-apexcharts';

class SysCpuGraph extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			options: {
				chart: {
					id: 'cpugraph',
					height: 280,
					type: 'radialBar',
				},
				colors: ['#20E647'],
				plotOptions: {
					radialBar: {
						startAngle: -135,
						endAngle: 135,
						track: {
							background: '#333',
							startAngle: -135,
							endAngle: 135,
						},
						dataLabels: {
							name: {
								show: false,
							},
							value: {
								fontSize: '30px',
								show: true,
							},
						},
					},
				},
				fill: {
					type: 'gradient',
					gradient: {
						shade: 'dark',
						type: 'horizontal',
						gradientToColors: ['#87D4F9'],
						stops: [0, 100],
					},
				},
				stroke: {
					lineCap: 'butt',
				},
				labels: ['Progress'],
			},
			series: [],
		};
	}

	render() {
		const { cpuLoad, cpuWidgetId } = this.props.cpu;
		const { options } = this.state;

		return (
			<div>
				<h5>CPU Graph</h5>
				<Chart
					options={options}
					series={[cpuLoad]}
					type="radialBar"
					height="350"
				/>
				{/* <h5>CPU Load: {cpuLoad}</h5> */}
				<h5>{cpuWidgetId}</h5>
			</div>
		);
	}
}

export default SysCpuGraph;
