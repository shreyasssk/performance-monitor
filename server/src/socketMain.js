require('dotenv').config();
const mongoose = require('mongoose');
const Machine = require('./models/Machine');

const connectToDB = async () => {
	try {
		await mongoose.connect(process.env.MONGO_URI, {
			useNewUrlParser: true,
		});
		console.log('Connected to DB');
	} catch (err) {
		console.log('DB Error: ', err);
	}
};
connectToDB();

function socketMain(io, socket, worker) {
	let macA;

	socket.on('*', (packet) => {
		// console.log(packet);
		// console.log(worker);
	});

	socket.on('clientAuth', (key) => {
		if (key === '/hTF0uIyrOL4nibGP2UGQX5hGkUZKmq5Mg==') {
			// valid nodeClient
			socket.join('clients');
		} else if (key === 'W7u7XZ2WCdf3U1N8T6dWLzI70Ug=') {
			// valid ui client joined
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
		Machine.find({ macA }, (err, docs) => {
			if (docs.length > 0) {
				// send one last emit to client
				docs[0].isActive = false;
				io.to('ui').emit('data', docs[0]);
			}
		});
	});

	socket.on('initPerfData', async (data) => {
		macA = data.macA;
		const mongooseResponse = await checkAndAdd(data);
		console.log(mongooseResponse);
		socket.on(`${macA}`, (processData) => {
			io.to('ui').emit('processInfo', processData);
		});
	});

	socket.on('perfData', (data) => {
		io.to('ui').emit('data', data);
	});

	socket.on('processData', (data) => {
		io.to('ui').emit('processData', data);
	});

	// creating a event based on 'macA' so that
	// client can communicate to the system based on
	// their mac address.
	socket.on('systemInfo', (data) => {
		macA = data.macA;

		// receive process details on an event with
		// that system's 'macA'
		socket.on(`${macA}`, (processInfo) => {
			io.to('ui').emit(`${macA}`, processInfo);
		});

		// client sends data to nodeClient.
		socket.on(`${macA}-client`, (pid) => {
			io.emit(`${macA}-server`, pid);
		});
	});
}

function checkAndAdd(data) {
	return new Promise((resolve, reject) => {
		Machine.findOne({ macA: data.macA }, (err, docs) => {
			if (err) {
				throw err;
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
		});
	});
}

module.exports = socketMain;
