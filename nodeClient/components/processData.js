const { snapshot } = require('process-list');

function processData() {
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

		var data = tasks.filter((e) => {
			return e.name !== '';
		});
		resolve({ data });
	});
}

module.exports = processData;
