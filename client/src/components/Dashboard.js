import React from 'react';
import { Container, Row, Col } from 'shards-react';
import { TabContent, TabPane, Nav, NavItem, NavLink } from 'reactstrap';
import classnames from 'classnames';

import SystemApp from './SystemApp';
import ProcessApp from './ProcessApp';
import socket from '../socket/socketConnection';

class Dashboard extends React.Component {
	constructor() {
		super();
		this.state = {
			selected: 'System',
			processData: {},
		};
	}

	componentDidMount() {
		this._fetchData = true;

		if (this._fetchData) {
			socket.on('processData', (data) => {
				this.setState({
					processData: data,
				});
			});
		}
	}

	componentWillUnmount() {
		this._fetchData = false;
	}

	toggle = (tab) => {
		if (this.state.selected !== tab) this.setState({ selected: tab });
	};

	render() {
		const {
			freeMem,
			totalMem,
			usedMem,
			memUsage,
			osType,
			upTime,
			cpuModel,
			numCores,
			cpuSpeed,
			cpuLoad,
			macA,
			isActive,
		} = this.props.data;

		const cpuWidgetId = `cpu-widget-${macA}`;
		const memWidgetId = `mem-widget-${macA}`;

		const cpu = { cpuLoad, cpuWidgetId };
		const mem = { totalMem, usedMem, memUsage, freeMem, memWidgetId };
		const info = {
			macA,
			osType,
			cpuModel,
			upTime,
			numCores,
			cpuSpeed,
			isActive,
		};

		function renderPage() {
			if (!isActive) {
				return (
					<div
						style={{ backgroundColor: 'rgb(255, 250, 250)' }}
						className="jumbotron card jumbotron-fluid"
					>
						<h2 className="card-title">Systems Offline...</h2>
						<p className="card-text">
							Oops! Lost connection to the server. 🚫
						</p>
					</div>
				);
			}
			return (
				<div style={{ padding: '5px' }}>
					<div className="card-body">
						<SystemApp
							infoData={info}
							cpuData={cpu}
							memData={mem}
						/>
					</div>
				</div>
			);
		}

		let processWidget = [];
		const data = this.state.processData;
		Object.entries(data).forEach(([key, value]) => {
			if (key === macA) {
				processWidget.push(
					<ProcessApp keyValue={key} key={key} data={value} />
				);
			}
		});

		return (
			<Container fluid className="main-content-container px-4">
				<Row>
					<Col className="col-lg mb-4">
						<div style={{ padding: '5px' }}>
							<div className="card">
								<div className="card-body">
									<Nav tabs justified>
										<NavItem>
											<NavLink
												className={classnames({
													active:
														this.state.selected ===
														'System',
												})}
												onClick={() => {
													this.toggle('System');
												}}
											>
												System
											</NavLink>
										</NavItem>
										<NavItem>
											<NavLink
												className={classnames({
													active:
														this.state.selected ===
														'Process',
												})}
												onClick={() => {
													this.toggle('Process');
												}}
											>
												Process
											</NavLink>
										</NavItem>
									</Nav>
									<TabContent activeTab={this.state.selected}>
										<TabPane tabId="System">
											{/* <SystemApp
												infoData={info}
												cpuData={cpu}
												memData={mem}
											/> */}
											{renderPage()}
										</TabPane>
										<TabPane tabId="Process">
											{processWidget}
										</TabPane>
									</TabContent>
								</div>
							</div>
						</div>
					</Col>
				</Row>
			</Container>
		);
	}
}

// {<SystemApp infoData={info} />}

export default Dashboard;
