import React from 'react';
import Chart from 'react-apexcharts';

class ProcessMemGraph extends React.Component {
	options = {
		chart: {
			id: 'memgraph',
			height: 280,
			type: 'radialBar',
		},
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
						fontSize: '20px',
					},
					value: {
						fontSize: '16px',
						label: 'Memory',
						show: true,
						formatter: function (val) {
							return val + ' MB';
						},
					},
				},
			},
		},
		labels: ['Virtual Memory'],
	};

	render() {
		const { newData } = this.props;

		if (newData.length === 0) {
			return <div></div>;
		}

		// var phyMem = parseInt(
		// 	Math.floor(Math.log(newData[0].pmem) / Math.log(1024))
		// );
		// var PhyMemInMB = Math.round(
		// 	newData[0].pmem / Math.pow(1024, phyMem),
		// 	2
		// );
		var virMem = parseInt(
			Math.floor(Math.log(newData[0].vmem) / Math.log(1024))
		);
		var VirMemInMB = Math.round(
			newData[0].vmem / Math.pow(1024, virMem),
			2
		);

		return (
			<div className="card">
				<div className="card-body">
					<h5>Memory Graph</h5>
					<Chart
						options={this.options}
						series={[VirMemInMB]}
						type="radialBar"
						height="350"
					/>
				</div>
			</div>
		);
	}
}

export default ProcessMemGraph;
