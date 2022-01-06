import mongoose, { Schema, Document, Model } from 'mongoose';
import { updateIfCurrentPlugin } from 'mongoose-update-if-current';

interface GoogleAttrs {
	name: string;
	email: string;
}

// An interface that describes the properties
// that a User Document has
interface GoogleDoc extends Document {
	name: string;
	email: string;
	date: Date;
}

// An interface that describes the properites
// that a User Model has
interface GoogleModel extends Model<GoogleDoc> {
	build(attrs: GoogleAttrs): GoogleDoc;
}

const googleSchema = new Schema({
	name: {
		type: String,
		required: true,
		max: 255,
	},
	email: {
		type: String,
		required: true,
		max: 255,
	},
	date: {
		type: Date,
		default: Date.now(),
	},
});

/* 
This plugin brings optimistic concurrency control 
to Mongoose documents by incrementing document version 
numbers on each save, and preventing previous versions of a 
document from being saved over the current version.
*/
googleSchema.plugin(updateIfCurrentPlugin);

googleSchema.statics.build = (attrs: GoogleAttrs) => {
	return new GoogleAuth(attrs);
};

const GoogleAuth = mongoose.model<GoogleDoc, GoogleModel>(
	'GoogleAuth',
	googleSchema,
	'GoogleAuth'
);

export { GoogleAuth };
