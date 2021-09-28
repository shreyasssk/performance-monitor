import React from 'react';
import Chart from 'react-apexcharts';
import ApexCharts from 'apexcharts';
import socket from '../../../socket/socketConnection';

class ProcessCpuGraph extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			selectedProcess: {},
			options: {
				chart: {
					id: 'cpugraph',
					animations: {
						enabled: true,
						easing: 'linear',
						dynamicAnimation: {
							speed: 1000,
						},
					},
					toolbar: {
						show: false,
					},
					zoom: {
						enabled: false,
					},
				},

				dataLabels: {
					enabled: false,
				},
				stroke: {
					curve: 'smooth',
				},
				title: {
					text: 'Free CPU [%] ',
					align: 'left',
				},
				markers: {
					size: 0,
				},
				xaxis: {
					type: 'datetime',
					range: 10,
				},
				legend: {
					show: false,
				},
			},
			series: [{ name: 'freemem', data: [] }],
		};
	}

	componentDidMount() {
		this._fetchData = true;
		const { macA } = this.props;
		socket.on(`${macA}-processDetailsData`, (data) => {
			if (this._fetchData) {
				// console.log(data[0]);
				const x = Math.round(data[0].cpu).toFixed(2);
				this.updateData(x);
			}
		});
	}

	resetData = () => {
		const { data } = this.state.series[0];

		this.setState({
			series: [{ data: data.slice(data.length - 10, data.length) }],
		});
	};

	updateData = (y) => {
		const x = Math.floor(new Date().getTime() / 1000);

		let { data } = this.state.series[0];
		data.push({ x, y });

		this.setState({ series: [{ data }] }, () => {
			ApexCharts.exec('cpugraph', 'updateSeries', this.state.series);
		});

		// stop data array from leaking memory and growing too big
		if (data.length > 100) this.resetData();
	};

	render() {
		const { options, series } = this.state;
		const { newData } = this.props;

		if (newData.length === 0) {
			return <div></div>;
		}

		// const series = Math.round(newData[0].cpu * 1000) / 1000;

		return (
			<div className="card">
				<div className="card-body">
					<h5>CPU Graph</h5>
					<Chart
						options={options}
						series={series}
						type="line"
						height="350"
					/>
				</div>
			</div>
		);
	}
}

export default ProcessCpuGraph;
