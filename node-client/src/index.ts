import os from 'os';
import io from 'socket.io-client';
let socket = io('http://127.0.0.1:4000');

// import { snapshotType } from 'process-list';
import { performanceData } from './components/perfData';
import { processData } from './components/procData';
// import psList from 'ps-list';

type snapshot = {
	[macA: string]: string;
};
// type snapshotType = typeof snapshot;

socket.on('connect', () => {
	console.log('connected to socket server!');

	// identify machine for unique marking, use mac address.
	const nI = os.networkInterfaces();
	let macA: string;

	// loop through all the network-interfaces of this machine
	// and find non-internal mac address
	for (let key in nI) {
		if (!nI[key]![0].internal) {
			macA = nI[key]![0].mac;
			break;
		}
	}

	performanceData().then((data) => {
		data.macA = macA;
		socket.emit('initPerfData', data);
	});

	// start sending data on interval
	let perfDataInterval = setInterval(() => {
		performanceData().then((data) => {
			data.macA = macA;
			socket.emit('perfData', data);
		});
	}, 1000);

	let procData = setInterval(() => {
		processData()
			.then((data) => {
				// let systemMac: any;
				// let x = {};
				// systemMac = { ...x };
				// systemMac[macA] = data;
				socket.emit('processData', data);
			})
			.catch((err) => {
				console.log(`process-data error: ${err}`);
			});
		// psList().then((data) => {
		// 	// let systemMac: {};
		// 	// let x: {} = { macA };
		// 	// systemMac[macA] = data
		// 	socket.emit('processData', data);
		// });
	});

	socket.on('disconnect', () => {
		clearInterval(perfDataInterval);
		clearInterval(procData);
	});
});
