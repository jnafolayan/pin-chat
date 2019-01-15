import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';


import createError from '../../lib/createError';
import User from './UserModel';

export function createUser(req, res, next) {
	const { username, password } = req.body;

	findUser()
		.then(abortIfUserExists)
		.then(generateHash)
		.then(createNewUser)
		.then(saveUser)
		.then(handleSuccess)
		.catch(handleError);

	function findUser() {
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

	function saveUser(user) {
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

export function login(req, res, next) {
	const { username, password } = req.body;

	findUser()
		.catch(abortLogin)
		.then(verifyPassword)
		.catch(abortLogin)
		.then(generateToken)
		.then(handleSuccess)
		.catch(handleError);

	function findUser() {
		return User.findOne({ username }).exec();
	}

	function abortLogin() {
		throw createError(403, 'User not found');
	}

	function verifyPassword(user) {
		return bcrypt.compare(password, user.password)
			.then(() => user);
	}

	function generateToken(user) {
		const payload: object = {
			user: username
		};

		const signOptions: object = {
			expiresIn: '12h'
		};

		return jwt.sign(payload, process.env.JWT_SECRET, signOptions);
	}

	function handleSuccess(token) {
		res.status(201).json({
			status: 201,
			message: 'Account created successfully'
		});
	}

	function handleError(error: Error) {
		next(error);
	}
}