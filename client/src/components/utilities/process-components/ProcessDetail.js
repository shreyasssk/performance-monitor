import React from 'react';
import { Button } from 'shards-react';
import socket from '../../../socket/socketConnection';

class ProcessDetail extends React.Component {
	renderPage() {
		const { data, macA } = this.props;

		if (data.length === 0) {
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
				<h4>Name: {data[0].name}</h4>
				<p>
					OWNER: {data[0].owner} <br />
					PID: {data[0].pid} <br />
					PPID: {data[0].ppid} <br />
					PATH: {data[0].path} <br />
					THREADS: {data[0].threads} <br />
					PRIORITY: {data[0].priority} <br />
					CMDLINE: {data[0].cmdline} <br />
					UPTIME: {data[0].utime} <br />
					<span style={{ fontWeight: 'bold' }}>
						MEMORY: {Math.round(data[0].pmem / 1000)}kB
						<br />
						CPU: {data[0].cpu} % <br />
					</span>
				</p>
				<Button
					onClick={onTerminate}
					value={data[0].pid}
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
