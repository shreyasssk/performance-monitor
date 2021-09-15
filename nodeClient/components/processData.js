const { snapshot } = require('process-list');

const processData = async () => {
	try {
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
		return data;
	} catch (err) {
		console.log('Process-List', err);
	}
};

module.exports = processData;
