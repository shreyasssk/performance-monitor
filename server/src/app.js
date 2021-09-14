const express = require('express');
const cluster = require('cluster');
const net = require('net');
const socketio = require('socket.io');
const io_redis = require('socket.io-redis');
const farmhash = require('farmhash');
const socketMain = require('./socketMain');

const PORT = 4000;
const num_processes = require('os').cpus().length;

if (cluster.isMaster) {
	// This stores our workers. We need to keep them to be able to reference
	// them based on source IP address. It's also useful for auto-restart,
	// for example.
	let workers = [];

	// Helper function for spawning worker at index 'i'.
	let spawn = (i) => {
		workers[i] = cluster.fork();

		// Optional: Restart worker on exit
		workers[i].on('exit', (code, signal) => {
			console.log('respawning worker', i);
			spawn(i);
		});
	};

	// Spawn workers.
	for (var i = 0; i < num_processes; i++) {
		spawn(i);
	}

	const worker_index = (ip, len) => {
		return farmhash.fingerprint32(ip) % len;
	};

	const server = net.createServer({ pauseOnConnect: true }, (connection) => {
		// We received a connection and need to pass it to the appropriate
		// worker. Get the worker for this connection's source IP and pass
		// it the connection.
		let worker =
			workers[worker_index(connection.remoteAddress, num_processes)];
		worker.send('sticky-session:connection', connection);
	});

	server.listen(PORT, () => {
		console.log(`Master listenting on port: ${PORT}`);
	});
} else {
	// We don't need a port here because Master processes the requests.
	let app = express();

	// Don't expose internal server to outside world.
	const server = app.listen(0, 'localhost');
	const io = socketio(server, {
		cors: {
			origin: '*',
		},
	});

	// Tell Socket.IO to use the redis adapter. By default, the redis
	// server is assumed to be on localhost:6379. You don't have to
	// specify them explicitly unless you want to change them.
	// redis-cli monitor.
	io.adapter(io_redis({ host: 'localhost', port: 6379 }));

	io.on('connection', (socket) => {
		socketMain(io, socket);
		console.log(`Connected to worker: ${cluster.worker.id}`);
	});

	// Listen to messages sent from master only.
	// Ignore everything else.
	process.on('message', (message, connection) => {
		if (message !== 'sticky-session:connection') {
			return;
		}

		server.emit('connection', connection);
		connection.resume();
	});
}
