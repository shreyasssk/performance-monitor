import { snapshot, snapshotType } from 'process-list';

let processData = async () => {
	try {
		let tasks = await snapshot(
			'pid',
			'ppid',
			'name',
			'path',
			'threads',
			'owner',
			'priority',
			'cmdline',
			'starttime',
			'vmem',
			'pmem',
			'cpu',
			'utime',
			'stime'
		);

		var data = tasks.filter((e: snapshotType) => {
			return e.name !== '';
		});
		return new Promise<snapshotType>(data);
	} catch (err) {
		console.log('Process-List', err);
	}
};

export { processData };
