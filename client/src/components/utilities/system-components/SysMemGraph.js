import React from 'react';
import Chart from 'react-apexcharts';

class MemCpuGraph extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			options: {
				chart: {
					id: 'memgraph',
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
		const { totalMem, usedMem, memUsage, freeMem, memWidgetId } =
			this.props.mem;
		const { options } = this.state;
		let memLoad = memUsage * 100;

		const totalMemInGB = Math.floor((totalMem / 1073741824) * 100) / 100;
		const usedMemInGB = Math.floor((usedMem / 1073741824) * 100) / 100;
		const freeMemInGB = Math.floor((freeMem / 1073741824) * 100) / 100;

		return (
			<div>
				<h5>Memory Graph</h5>
				<Chart
					options={options}
					series={[memLoad]}
					type="radialBar"
					height="350"
				/>
				{/* <h5>Mem Load: {memUsage}</h5> */}
				<h5>
					{memWidgetId}
					<br />
					<strong>Total Memory:</strong> {totalMemInGB}GB
					<br />
					<strong>Used Memory:</strong> {usedMemInGB}GB
					<br />
					<strong>Free Memory:</strong> {freeMemInGB}GB
				</h5>
			</div>
		);
	}
}

export default MemCpuGraph;
