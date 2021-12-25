import os from 'os';
import { getCpuLoad } from '../service/getCpuLoad';

type perfDataType = {
	freeMem: number;
	totalMem: number;
	usedMem: number;
	memUsage: number;
	osType: string;
	upTime: number;
	cpuModel: string;
	numCores: number;
	cpuSpeed: number;
	cpuLoad: any;
	isActive: boolean;
	macA?: string;
};

function performanceData() {
	return new Promise<perfDataType>(async (resolve, reject) => {
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

export { performanceData };
