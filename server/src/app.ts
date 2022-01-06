import cluster from 'cluster';

import isMaster from '../components/master';
import isWorker from '../components/worker';

// if it is the Master process, then
if (cluster.isPrimary || !cluster.isWorker) {
	isMaster();
	// console.log('Hey!');
} else {
	isWorker();
	// console.log('Not Hey! :(');
}
