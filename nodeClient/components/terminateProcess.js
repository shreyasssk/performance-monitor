const fkill = require('fkill');

const processTerminate = async (pid) => {
	var pidValue = parseInt(pid);
	try {
		await fkill(pidValue, {
			tree: true,
			ignoreCase: true,
		});
		console.log(`Process with pid: ${pidValue} terminated!`);
	} catch (err) {
		console.error(err.message);
	}
};

module.exports = processTerminate;
