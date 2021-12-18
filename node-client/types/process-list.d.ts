declare module 'process-list' {
	export function snapshot(args: any, ...args: any[]): Promise<any>;
	export type snapshotType = {
		pid;
		ppid;
		name;
		path;
		threads;
		owner;
		priority;
		cmdline;
		starttime;
		vmem;
		pmem;
		cpu;
		utime;
		stime;
	};
}
