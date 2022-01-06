require('dotenv').config();
import mongoose, { Condition, CallbackError } from 'mongoose';
import { Server, Socket } from 'socket.io';
import cookieSession from 'cookie-session';

import { Machine, MachineDoc } from '../models/Machine';

const sessionMiddleware = cookieSession({
	maxAge: 30 * 24 * 60 * 60 * 1000,
	keys: [String(process.env.SECRET_KEY)],
	signed: false,
});

(async function () {
	if (!process.env.SECRET_KEY) {
		throw new Error('SECRET_KEY not defined!');
	}

	if (!process.env.MONGO_URI) {
		throw new Error('MONGO_URI not specified!');
	}

	try {
		await mongoose.connect(process.env.MONGO_URI);
		console.log('connected to MongoDB');
	} catch (err: any) {
		throw new Error(err);
	}
})();

function socketMain(io: Server, socket: Socket) {
	let macA: Condition<string>;

	console.log('Headers', socket.request.headers.cookie);
	console.log('Handshake', socket.handshake.headers.cookie);

	socket.on('clientAuth', (key) => {
		if (key === 'clientAuth') {
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