import mongoose, { Schema, Document, Model } from 'mongoose';
import { updateIfCurrentPlugin } from 'mongoose-update-if-current';
import { Password } from '../services/password';

interface UserAttrs {
	name: string;
	email: string;
	password: string;
}

// An interface that describes the properties
// that a User Document has
interface UserDoc extends Document {
	name: string;
	email: string;
	password: string;
	date: Date;
}

// An interface that describes the properites
// that a User Model has
interface UserModel extends Model<UserDoc> {
	build(attrs: UserAttrs): UserDoc;
}

const userSchema = new Schema({
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
	password: {
		type: String,
		required: true,
		min: 6,
		max: 24,
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
userSchema.plugin(updateIfCurrentPlugin);

userSchema.pre('save', async function (done) {
	if (this.isModified('password')) {
		const hashed = await Password.toHash(this.get('password'));
		this.set('password', hashed);
	}
	done();
});

userSchema.statics.build = (attrs: UserAttrs) => {
	return new User(attrs);
};

const User = mongoose.model<UserDoc, UserModel>('User', userSchema, 'User');

export { User };
