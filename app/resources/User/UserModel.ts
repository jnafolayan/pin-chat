import mongoose from 'mongoose';

const userSchema = mongoose.Schema({
	username: String,
	password: String
});

const model = mongoose.models['User'] || mongoose.model('User', userSchema);

export default model;