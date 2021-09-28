const { snapshot } = require('process-list');

const selectedProcess = (x) => {
	return new Promise(async (resolve, reject) => {
		const tasks = await snapshot(
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
		let data = await tasks.filter((e) => {
			return e.pid === x;
		});

		resolve(data);
		reject('Error: Process-Data');
	});
};

module.exports = selectedProcess;
