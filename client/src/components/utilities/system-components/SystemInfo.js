import moment from 'moment';

const SystemInfo = (props) => {
	const { osType, upTime, cpuModel, numCores, cpuSpeed } = props.info;
	// console.log(props);

	return (
		<div>
			<h5>
				<strong>Platform:</strong> {osType}
				<br />
				<strong>Time Online:</strong>{' '}
				{moment.duration(upTime, 'seconds').humanize()}
				<br />
				<strong>Processor Information</strong>
				<br />
				<p style={{ fontSize: 17 }}>
					<strong>Type:</strong> {cpuModel}
					<br />
					<strong>Number of Cores:</strong> {numCores}
					<br />
					<strong>Clock Speed:</strong> {cpuSpeed}
				</p>
			</h5>
		</div>
	);
};

export default SystemInfo;
