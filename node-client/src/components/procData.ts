import { snapshot, SnapshotType } from 'process-list';
import psList from 'ps-list';

let processData = async () => {
	return new Promise<SnapshotType>(async (resolve, reject) => {
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

		var data: SnapshotType = tasks.filter((e: SnapshotType) => {
			return e.name !== '';
		});
		console.log(await psList());
		resolve(data);

		reject('Error occured!');
	});
};

export { processData };
