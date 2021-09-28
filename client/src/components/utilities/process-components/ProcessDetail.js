import React from 'react';
import { Button } from 'shards-react';
import socket from '../../../socket/socketConnection';

class ProcessDetail extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			selectedProcess: {},
		};
	}

	componentDidMount() {
		this._fetchData = true;
		const { macA } = this.props;
		socket.on(`${macA}-processDetailsData`, (data) => {
			if (this._fetchData) {
				// console.log(data[0]);
				this.setState({
					selectedProcess: data[0],
				});
			}
		});
	}

	componentWillUnmount() {
		this._fetchData = false;
	}

	renderPage() {
		const { data, macA } = this.props;
		const { selectedProcess } = this.state;

		if (Object.keys(selectedProcess).length === 0) {
			return (
				<div>
					<h4>No process selected</h4>
					Please select a process to display info.
				</div>
			);
		}

		const onTerminate = async (e) => {
			const pidValue = parseInt(e.target.value);
			console.log(typeof pidValue, macA);
			await socket.emit('systemInfo', { macA: macA, pid: pidValue });
		};

		return (
			<div>
				<h4>Name: {selectedProcess.name}</h4>
				<p>
					OWNER: {selectedProcess.owner} <br />
					PID: {selectedProcess.pid} <br />
					PPID: {selectedProcess.ppid} <br />
					PATH: {selectedProcess.path} <br />
					THREADS: {selectedProcess.threads} <br />
					PRIORITY: {selectedProcess.priority} <br />
					CMDLINE: {selectedProcess.cmdline} <br />
					UPTIME: {selectedProcess.utime} <br />
					<span style={{ fontWeight: 'bold' }}>
						MEMORY: {Math.round(selectedProcess.pmem / 1000)}kB
						<br />
						CPU: {selectedProcess.cpu} % <br />
					</span>
				</p>
				<Button
					onClick={onTerminate}
					value={selectedProcess.pid}
					size="lg"
					theme="danger"
				>
					kill
				</Button>
			</div>
		);
	}

	render() {
		return (
			<div className="card">
				<div className="card-body">
					<h4>Process Details</h4>
					{this.renderPage()}
				</div>
			</div>
		);
	}
}

export default ProcessDetail;
