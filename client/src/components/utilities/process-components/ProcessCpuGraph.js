import React from 'react';
import Chart from 'react-apexcharts';

class ProcessCpuGraph extends React.Component {
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
								show: true,
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
				labels: ['CPU'],
			},
		};
	}

	render() {
		const { options } = this.state;
		const { newData } = this.props;

		if (newData.length === 0) {
			return <div></div>;
		}

		const series = Math.round(newData[0].cpu * 1000) / 1000;

		return (
			<div className="card">
				<div className="card-body">
					<h5>CPU Graph</h5>
					<Chart
						options={options}
						series={[series]}
						type="radialBar"
						height="350"
					/>
				</div>
			</div>
		);
	}
}

export default ProcessCpuGraph;
