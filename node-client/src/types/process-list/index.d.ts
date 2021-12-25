declare module 'process-list' {
	export function snapshot(args: any, ...args: any[]): Promise<any>;
	// const snapshot = {
	// 	pid = '',
	// 	ppid = '',
	// 	name = '',
	// 	path = '',
	// 	threads = '',
	// 	owner = '',
	// 	priority = '',
	// 	cmdline = '',
	// 	starttime = '',
	// 	vmem = '',
	// 	pmem = '',
	// 	cpu = '',
	// 	utime = '',
	// 	stime = '',
	// 	macA = '',
	// } as const;
	// export type snapshotType = typeof snapshot;
	export type SnapshotType = {
		pid: number;
		ppid: number;
		name: string;
		path: number;
		threads: number;
		owner: string;
		priority: number;
		cmdline: number;
		starttime: number;
		vmem: number;
		pmem: number;
		cpu: number;
		utime: number;
		stime: number;
		macA: string;
	};
}
