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
		this.macA = data.macA;
		macA = data.macA;
		const mongooseResponse = await checkAndAdd(data);
		console.log(mongooseResponse);
		socket.on(macA, (processData) => {
			io.to('ui').emit(macA, processData);
		});
		socket.on(`${macA}-processDetails`, (processDetailsData) => {
			// console.log(processDetailsData);
			io.to('ui').emit(`${macA}-processDetailsData`, processDetailsData);
		});
	});

	// console.log(`Mac address: ${this.macA}`);

	socket.on('perfData', (data) => {
		io.to('ui').emit('data', data);
	});

	socket.on('processData', (data) => {
		io.to('ui').emit('processData', data);
	});

	// creating a event using 'macA' so that
	// client can communicate to the system based on
	// their mac address.
	// to terminate process.
	socket.on('systemInfo', (data) => {
		// console.log(data);
		macA = `${data.macA}-client`;
		io.emit(macA, data);
	});

	socket.on('selectedProcess', (data) => {
		console.log(data);
		macA = `${data.macA}-process`;
		io.emit(macA, data);
	});

	socket.on('test', (data) => {
		io.emit('shreyas', data);
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
