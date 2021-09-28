import React from 'react';
import { Container, Row, Col } from 'shards-react';

import socket from '../socket/socketConnection';
import Dashboard from './Dashboard';

class App extends React.Component {
	constructor() {
		super();
		this.state = {
			performanceData: {},
		};
	}

	componentDidMount() {
		this._fetchData = true;

		socket.on('data', (data) => {
			const currentState = { ...this.state.performanceData };
			currentState[data.macA] = data;
			if (this._fetchData) {
				this.setState({
					performanceData: currentState,
				});
			}
		});
	}

	componentWillUnmount() {
		this._fetchData = false;
	}

	render() {
		let widgets = [];
		const data = this.state.performanceData;
		Object.entries(data).forEach(([key, value]) => {
			widgets.push(
				<Container
					key={key}
					fluid
					className="main-content-container px-4"
				>
					<Row>
						<Col className="col-lg mb-4">
							<div style={{ padding: '5px' }}>
								<div className="card">
									<div className="card-body">
										<div className="card-title">
											<h5>System ID: {key}</h5>
										</div>
										<Dashboard key={key} data={value} />
									</div>
								</div>
							</div>
						</Col>
					</Row>
				</Container>
			);
		});
		return (
			<Container fluid className="main-content-container px-4">
				<Row>
					<Col className="col-lg mb-4">
						<div
							style={{
								backgroundColor: 'rgb(255, 250, 250)',
							}}
							className="jumbotron card jumbotron-fluid"
						>
							<h1 className="display-4">
								System Performance Metrics
							</h1>
						</div>
						<div style={{ padding: '5px' }}>{widgets}</div>
					</Col>
				</Row>
			</Container>
		);
	}
}

export default App;
