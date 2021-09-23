const os = require('os');
const io = require('socket.io-client');
let socket = io('https://socket-server-pm.herokuapp.com');
const performanceData = require('./components/performanceData');
const processData = require('./components/processData');
const processTerminate = require('./components/terminateProcess');

// identify machine for unique marking, use mac address.
const nI = os.networkInterfaces();
let macA;

// loop through all the network-interfaces of this machine
// and find non-internal mac address
for (let key in nI) {
	if (!nI[key][0].internal) {
		macA = nI[key][0].mac;
		break;
	}
}

socket.on('connect', () => {
	console.log('Connected to socket server!');

	performanceData().then((data) => {
		data.macA = macA;
		socket.emit('initPerfData', data);
	});

	// start sending over data on interval
	let perfDataInterval = setInterval(() => {
		// System Metrics
		performanceData().then((data) => {
			data.macA = macA;
			let x = {};
			let systemMac = { ...x };
			systemMac[data.macA] = data;
			socket.emit('perfData', data);
		});

		// 00123: {
		// 	systemd: 'sdfs',
		// 	dsfsdfs: 'dsfdsfs'
		// }

		// Process Metrics
		processData().then((data) => {
			let x = {};
			let systemMac = { ...x };
			systemMac[macA] = data;
			socket.emit('processData', data);
		});

		processData().then((data) => {
			socket.emit(macA, data);
		});
	}, 1000);

	socket.on('disconnect', () => {
		clearInterval(perfDataInterval);
	});
});

const macB = `${macA}-client`;
socket.on(macB, (data) => {
	console.log(`Received process terminate request from: ${data.macA}`);
	processTerminate(data.pid);
});
