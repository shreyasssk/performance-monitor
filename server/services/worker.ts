import express from 'express';
import cluster, { Cluster } from 'cluster';
import { Socket } from 'net';
import { Server } from 'socket.io';
import { createClient } from 'redis';
import { createAdapter } from '@socket.io/redis-adapter';
import morgan from 'morgan';

import socketMain from './socketMain';

export default function isWorker() {
	// We don't need a port here because Master processes the requests.
	let app = express();
	app.use(morgan('combined'));
	// const redisOption: RedisClientType = {};
	const pubClient = createClient();
	const subClient = pubClient.duplicate();

	// createClient({
	// 	url: 'redis://alice:foobared@awesome.redis.server:6380',
	// 	password: ''
	// });

	// Don't expose internal server to outside world.
	const server = app.listen(0, 'localhost');
	const io = new Server(server, {
		cors: {
			origin: '*',
		},
	});

	io.adapter(createAdapter(pubClient, subClient));

	Promise.all([pubClient.connect(), subClient.connect()]).then(() => {
		io.listen(0);
	});

	io.on('connection', (socket) => {
		socketMain(io, socket);
		console.log(`Connected to worker: ${cluster.worker?.id}`);
	});

	// Listen to messages sent from master only.
	// Ignore everything else.
	process.on('message', (msg, connection: Socket) => {
		if (msg !== 'sticky-session:connection') {
			return;
		}

		// Emulate a connection event on the server by emitting the
		// event with the connection the master sent us.
		server.emit('connection', connection);
		connection.resume();
	});
}
