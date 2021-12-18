import cluster from 'cluster';

import isMaster from '../services/master';
import isWorker from '../services/worker';

// if it is the Master process, then
if (cluster.isPrimary || !cluster.isWorker) {
	isMaster();
	// console.log('Hey!');
} else {
	isWorker();
	// console.log('Not Hey! :(');
}
