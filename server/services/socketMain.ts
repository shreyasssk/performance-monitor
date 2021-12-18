require('dotenv').config();
import mongoose, { Condition, CallbackError } from 'mongoose';
import { Server, Socket } from 'socket.io';

import { Machine, MachineDoc } from '../models/Machine';

(async function () {
	if (!process.env.MONGO_URI) {
		throw new Error('MONGO_URI not specified!');
	}

	try {
		await mongoose.connect(process.env.MONGO_URI);
		console.log('connected to MongoDB');
	} catch (err) {
		console.log(err);
	}
})();

function socketMain(io: Server, socket: Socket) {
	let macA: Condition<string>;

	socket.on('clientAuth', (key) => {
		if (key === 'W7u7XZ2WCdf3U1N8T6dWLzI70Ug=') {
			// valid UI client joined
			socket.join('ui');
			console.log('React client joined!');
			Machine.find({}, (err, docs) => {
				docs.forEach((aMachine) => {
					// on load assume all machines are offline
					aMachine.isActive = false;
					io.to('ui').emit('data', aMachine);
				});
			});
		} else {
			// invalid client
			socket.disconnect(true);
		}
	});

	socket.on('disconnect', () => {
		Machine.find({ macA }, (err: CallbackError, docs) => {
			if (docs.length > 0) {
				// send one last emit to client
				docs[0].isActive = false;
				io.to('ui').emit('data', docs[0]);
			}
		});
	});

	socket.on('initPerfData', async (data: MachineDoc) => {
		macA = data.macA;
		const mongooseResponse = await checkAndAdd(data);
		console.log(mongooseResponse);
	});

	socket.on('perfData', (data) => {
		io.to('ui').emit('data', data);
	});

	socket.on('processData', (data) => {
		io.to('ui').emit('processData', data);
	});

	socket.on('selectedProcess', (data) => {
		io.emit('processInfo', data);
	});
}

function checkAndAdd(data: MachineDoc) {
	return new Promise((resolve, reject) => {
		Machine.findOne(
			{ macA: data.macA },
			(err: CallbackError, docs: MachineDoc) => {
				if (err) {
					reject(err);
				} else if (docs === null) {
					// record or machine not added to db, so add it!
					let newMachine = new Machine(data);
					newMachine.save();
					resolve('Machine registered!');
				} else {
					// record or machine already added to db, so resolve
					resolve('Already registered!');
				}
			}
		);
	});
}

export default socketMain;
