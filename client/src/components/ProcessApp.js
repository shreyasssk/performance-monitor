import React from 'react';
import { Container, Row, Col } from 'shards-react';

import './utilities/process-components/processList.css';
import ProcessDetail from './utilities/process-components/ProcessDetail';
import ProcessCpuGraph from './utilities/process-components/ProcessCpuGraph';
import ProcessMemGraph from './utilities/process-components/ProcessMemGraph';
import socket from '../socket/socketConnection';

class ProcessApp extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			selectedProcess: {},
			processData: [],
		};
	}

	// change onClick()
	componentDidMount() {
		this._fetchData = true;
		const { macA } = this.props;

		socket.on(macA, (data) => {
			if (this._fetchData) {
				this.setState({
					processData: data,
				});
			}
		});
	}

	componentWillUnmount() {
		this._fetchData = false;
	}

	renderTable = () => {
		const { processData } = this.state;

		return processData.map((i) => (
			<tr key={i.pid}>
				<th className="col-3">{i.name}</th>
				<td className="col-3">{i.cpu}</td>
				<td className="col-3">{i.pmem}</td>
				<td className="col-3">
					{i.pid}
					<button
						className="btn table-button btn-dark btn-sm"
						onClick={() =>
							this.setState({ selectedProcess: i.pid })
						}
					>
						more info
					</button>
				</td>
			</tr>
		));
	};

	renderPage = () => {
		if (this.state.processData === undefined || null) {
			return (
				<div
					style={{ backgroundColor: 'rgb(255, 250, 250)' }}
					className="jumbotron card jumbotron-fluid"
				>
					<h2 className="card-title">Oops!</h2>
					<p className="card-text">Unable to fetch processes! 🚫</p>
				</div>
			);
		}

		return (
			<div>
				<div className="card">
					<div className="card-body">
						<h4>Running Process List :</h4>
						<div className="container-fluid">
							<div className="table-responsive">
								<table className="table table-fixed">
									<thead className="thead-dark">
										<tr>
											<th scope="col" className="col-3">
												name
											</th>
											<th scope="col" className="col-3">
												cpu
											</th>
											<th scope="col" className="col-3">
												memory
											</th>
											<th scope="col" className="col-3">
												pid
											</th>
										</tr>
									</thead>
									<tbody>{this.renderTable()}</tbody>
								</table>
							</div>
						</div>
					</div>
				</div>
			</div>
		);
	};

	render() {
		const { macA } = this.props;
		const { selectedProcess, processData } = this.state;
		// console.log(processData);
		if (processData === null || undefined) {
			return <div>Loading...</div>;
		}

		const processInfo = processData.filter((i) => {
			return i.pid === selectedProcess;
		});
		return (
			<Container fluid className="main-content-container px-4">
				<div style={{ padding: '5px' }}>
					<Row>
						<Col className="col-lg mb-6">{this.renderPage()}</Col>
						<Col className="col-lg-4 mb-2">
							{macA}
							<ProcessDetail macA={macA} data={processInfo} />
						</Col>
					</Row>
					<Row>
						<Col lg="6" md="6" sm="12" className="mb-4">
							<ProcessCpuGraph newData={processInfo} />
						</Col>
						<Col lg="6" md="6" sm="12" className="mb-4">
							<ProcessMemGraph newData={processInfo} />
						</Col>
					</Row>
				</div>
			</Container>
		);
	}
}

export default ProcessApp;
