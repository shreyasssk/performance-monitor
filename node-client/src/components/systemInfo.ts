import si, { Systeminformation } from 'systeminformation';

type perfDataType = {
	osType: object;
	cpu: object;
	cpuTemp: object;
	mem: object;
	processData: object;
	networkInterfaces: object;
	systemInformation: object;
	isActive: boolean;
	macA?: string;
};

async function sysInfo() {
	return new Promise<perfDataType>(async (resolve, reject) => {
		const osType = await si.osInfo();
		const cpu = await si.cpu();
		const cpuTemp = await si.cpuTemperature();
		const mem = await si.mem();
		const processData = await si.processes();
		const networkInterfaces = await si.networkInterfaces();
		const systemInformation = await hardwareInfo();

		const isActive = true;

		resolve({
			osType,
			cpu,
			cpuTemp,
			mem,
			processData,
			networkInterfaces,
			systemInformation,
			isActive,
		});
	});
}

async function hardwareInfo() {
	const system = await si.system();
	const uuid = await si.uuid();
	const bios = await si.bios();
	const baseboard = await si.baseboard();
	const chassis = await si.chassis();

	return {
		system,
		uuid,
		bios,
		baseboard,
		chassis,
	};
}

export { sysInfo };
