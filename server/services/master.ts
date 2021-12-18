import cluster, { Worker } from 'cluster';
import net from 'net';
import farmhash from 'farmhash';
import os from 'os';

const PORT: number = Number(process.env.PORT) || 4000;
const num_processes = os.cpus().length;
export default function isMaster() {
	let workers: Worker[] = [];

	// Helper function for spawning worker at index 'i'.
	let spawn = (i: number) => {
		workers[i] = cluster.fork();

		// Optional: Restart worker on exit
		workers[i].on('exit', (code, signal) => {
			console.log('respawning worker', i);
			spawn(i);
		});
	};

	// Spwan workers
	for (var i = 0; i < num_processes; i++) {
		spawn(i);
	}

	const worker_index = (ip: string, len: number): number => {
		return farmhash.fingerprint32(ip) % len;
	};

	const server = net.createServer({ pauseOnConnect: true }, (connection) => {
		// We received a connection and need to pass it to the appropriate
		// worker. Get the worker for this connection's source IP and pass
		// it the connection.
		let worker =
			workers[worker_index(connection.remoteAddress!, num_processes)];
		worker.send('sticky-session:connection', connection);
	});

	server.listen(PORT, () => {
		console.log(`Master listenting on PORT: ${PORT}`);
	});
}
