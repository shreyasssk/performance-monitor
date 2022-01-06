import express, { Request, Response, NextFunction } from 'express';
import cluster from 'cluster';
import { Socket } from 'net';
import { Server, Socket as socketIo } from 'socket.io';
import { createClient } from 'redis';
import Redis from 'ioredis';
import { createAdapter } from '@socket.io/redis-adapter';
import session from 'express-session';
import RedisStore from 'connect-redis';
import cors from 'cors';
import { errorHandler, NotFoundError } from '@ssktickets/common';
import passport from 'passport';
import morgan from 'morgan';
import helmet from 'helmet';

const redisStore = RedisStore(session);

import socketMain from './socketMain';

// Require 'service/auth' to make passport use it's config.
require('../services/passport');

// Auth imports
import { signupRouter } from '../routes/auth/signup';
import { signinRouter } from '../routes/auth/signin';
import { signoutRouter } from '../routes/auth/signout';
import { currentUserRouter } from '../routes/auth/current-user';
import { googleAuthRouter } from '../routes/auth/google-auth';

import { protectedUserRouter } from '../routes/Machine/protectedUser';

// const sessionMiddleware = cookieSession({
// 	maxAge: 30 * 24 * 60 * 60 * 1000,
// 	keys: [String(process.env.SECRET_KEY)],
// 	signed: false,
// });

export default function isWorker() {
	const redisClient = createClient();

	const sessionMiddleware = session({
		name: 'auth',
		secret: String(process.env.SECRET_KEY),
		resave: false,
		saveUninitialized: false,
		store: new redisStore({ client: redisClient }),
		cookie: {
			secure: false,
			maxAge: 30 * 24 * 60 * 60 * 1000,
		},
	});

	// We don't need a port here because Master processes the requests.
	const app = express();
	app.use(express.json());
	app.use(
		cors({
			origin: true,
			allowedHeaders: ['Allow-Origin-With-Credentials', 'Content-Type'],
			credentials: true,
		})
	);
	app.use(sessionMiddleware);
	app.use(passport.initialize());
	app.use(passport.session());
	app.use(helmet());
	app.use(morgan('combined'));

	app.get('/test', (req: Request, res: Response) => {
		res.send('Hello world!');
	});

	// Auth Routes
	app.use(signupRouter);
	app.use(signinRouter);
	app.use(googleAuthRouter);
	app.use(signoutRouter);
	app.use(currentUserRouter);

	app.use(protectedUserRouter);

	// app.all('*', async () => {
	// 	throw new NotFoundError();
	// });

	app.use(errorHandler);

	// const redisOption: RedisClientType = {};
	const pubClient = redisClient;
	pubClient.on('connect', () => console.log('connected to Redis Server'));
	pubClient.on('error', (err) =>
		console.log("Couldn't establish connection to redis server")
	);
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

	// convert a connect middleware to a Socket.IO middleware
	const wrap = (middleware: any) => (socket: any, next: any) =>
		middleware(socket.request, {}, next);

	io.use(wrap(sessionMiddleware));
	io.use(wrap(passport.initialize()));
	io.use(wrap(passport.session()));
	// io.use(wrap(passport.authenticate(['jwt', 'google'])));
	io.use((socket: any, next) => {
		if (passport.authenticate(['jwt', 'google'])) {
			next();
		} else {
			next(new Error('unauthorised!'));
		}
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
