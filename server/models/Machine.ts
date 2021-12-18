import mongoose, { Schema, Document, Model } from 'mongoose';

interface MachineAttrs {
	macA: string;
	cpuLoad: number;
	freeMem: number;
	totalMem: number;
	usedMem: number;
	memUsage: number;
	osType: string;
	upTime: number;
	cpuModel: string;
	numCores: number;
	cpuSpeed: number;
}

interface MachineDoc extends Document {
	macA: string;
	cpuLoad: number;
	freeMem: number;
	totalMem: number;
	usedMem: number;
	memUsage: number;
	osType: string;
	upTime: number;
	cpuModel: string;
	numCores: number;
	cpuSpeed: number;
	joinedAt: Date;
	isActive: boolean;
}

interface MachineModel extends Model<MachineDoc> {
	build(attrs: MachineAttrs): MachineDoc;
}

const MachineSchema = new Schema({
	macA: {
		type: String,
		required: true,
	},
	cpuLoad: {
		type: Number,
		required: true,
	},
	freeMem: {
		type: Number,
		required: true,
	},
	totalMem: {
		type: Number,
		required: true,
	},
	usedMem: {
		type: Number,
		required: true,
	},
	memUsage: {
		type: Number,
		required: true,
	},
	osType: {
		type: String,
		required: true,
	},
	upTime: {
		type: Number,
		required: true,
	},
	cpuModel: {
		type: String,
		required: true,
	},
	numCores: {
		type: Number,
		required: true,
	},
	cpuSpeed: {
		type: Number,
		required: true,
	},
	joinedAt: {
		type: Date,
		required: true,
		default: Date.now(),
	},
});

MachineSchema.set('versionKey', 'version');

MachineSchema.statics.build = (attrs: MachineAttrs) => {
	return new Machine(attrs);
};

const Machine = mongoose.model<MachineDoc, MachineModel>(
	'Machine',
	MachineSchema
);

export { Machine, MachineDoc };
