import jwt from 'jsonwebtoken';

import createError from '../../lib/createError';
import User from './UserModel';

export function createUser(req, res, next) {
	const { username, password } = req.body;

	checkIfUserExists()
		.then(abortIfUserExists)
		.then(generateHash)
		.then(createNewUser)
		.then(saveUser)
		.then(handleSuccess)
		.catch(handleError);

	function checkIfUserExists() {
		return User.findOne({ username }).exec();
	}

	function abortIfUserExists(user) {
		if (user) {
			throw createError(403, 'User already exists');
		} 
	}

	function generateHash() {
		return bcrypt.hash(password, 11);
	}

	function createNewUser(hash: string) { 
		const user = new User({
			username,
			password: hash
		});

		return user;
	}

	function saveUser(user: User) {
		return user.save();
	}

	function handleSuccess() {
		res.status(201).json({
			status: 201,
			message: 'Account created successfully'
		});
	}

	function handleError(error: Error) {
		next(error);
	}
}