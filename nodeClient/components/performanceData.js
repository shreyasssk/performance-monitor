const os = require('os');

function performanceData() {
	return new Promise(async (resolve, reject) => {
		const osType = os.type() == 'Darwin' ? 'Mac' : os.type();
		const upTime = os.uptime();
		const freeMem = os.freemem();
		const totalMem = os.totalmem();
		const usedMem = totalMem - freeMem;
		const memUsage = Math.floor((usedMem / totalMem) * 100) / 100;

		// CPUs info:
		const cpus = os.cpus();
		const cpuModel = cpus[0].model;
		const numCores = cpus.length;
		const cpuSpeed = cpus[0].speed;

		const cpuLoad = await getCpuLoad();
		const isActive = true;

		resolve({
			freeMem,
			totalMem,
			usedMem,
			memUsage,
			osType,
			upTime,
			cpuModel,
			numCores,
			cpuSpeed,
			cpuLoad,
			isActive,
		});
	});
}

// get average of all cores
function cpuAverage() {
	const cpus = os.cpus();
	let idleMs = 0;
	let totalMs = 0;
	// loop through each core
	cpus.forEach((aCore) => {
		// loop through each property of the current core
		for (type in aCore.times) {
			totalMs += aCore.times[type];
		}
		idleMs += aCore.times.idle;
	});
	return {
		idle: idleMs / cpus.length,
		total: totalMs / cpus.length,
	};
}

function getCpuLoad() {
	return new Promise((resolve, reject) => {
		const start = cpuAverage();
		setTimeout(() => {
			const end = cpuAverage();
			const idleDifference = end.idle - start.idle;
			const totalDifference = end.total - start.total;
			// console.log(idleDifference, totalDifference);
			// calc the % of cpu used
			const percentageCpu =
				100 - Math.floor((100 * idleDifference) / totalDifference);
			resolve(percentageCpu);
		}, 100);
	});
}

module.exports = performanceData;
