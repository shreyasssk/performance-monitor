import React from 'react';
import { Container, Row, Col, Card, Nav, NavItem, NavLink } from 'shards-react';

import socket from '../socket/socketConnection';
import SystemInfo from './utilities/system-components/SystemInfo';
import SysCpuGraph from './utilities/system-components/SysCpuGraph';
import MemCpuGraph from './utilities/system-components/SysMemGraph';

class SystemApp extends React.Component {
	render() {
		const { infoData, cpuData, memData } = this.props;

		return (
			<React.Fragment>
				<div style={{ padding: '5px' }}>
					<Row>
						<Col className="col-lg mb-4">
							<div className="card-body">
								<SystemInfo info={infoData} />
							</div>
						</Col>
						<Col className="col-lg mb-4">
							<div className="card-body">
								<SysCpuGraph cpu={cpuData} />
							</div>
						</Col>
						<Col className="col-lg mb-4">
							<div className="card-body">
								<MemCpuGraph mem={memData} />
							</div>
						</Col>
					</Row>
				</div>
			</React.Fragment>
		);
	}
}

export default SystemApp;
