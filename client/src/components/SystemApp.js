import React from 'react';
import socket from '../socket/socketConnection';

class SystemApp extends React.Component {
	constructor() {
		super();
	}

	componentDidMount() {
		console.log('hello');
		socket.on('data', (data) => {
			console.log('System data', data);
		});
	}

	render() {
		return <div>SystemApp</div>;
	}
}

export default SystemApp;
