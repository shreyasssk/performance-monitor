import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import jwt from 'jsonwebtoken';
import { ValidateRequest, BadRequestError } from '@ssktickets/common';

import { Password } from '../../services/password';
import { User } from '../../models/User-Jwt';

const router = express.Router();

router.post(
	'/api/auth/login',
	[
		body('email').isEmail().withMessage('Email must be valid!'),
		body('password')
			.trim()
			.notEmpty()
			.withMessage('You must supply a password!'),
	],
	ValidateRequest,
	async (req: Request, res: Response) => {
		const { email, password } = req.body;

		const existingUser = await User.findOne({ email });

		if (!existingUser) {
			throw new BadRequestError('Invalid Credentials');
		}

		const passwordMatch = await Password.compare(
			existingUser.password!,
			password
		);

		if (!passwordMatch) {
			throw new BadRequestError('Invalid Credentials.');
		}

		// Generate JWT
		const userToken = jwt.sign(
			{
				id: existingUser.id,
				email: existingUser.email,
				name: existingUser.name,
			},
			process.env.SECRET_KEY!
		);

		// Store it on session object
		// req.session = {
		// 	auth: userToken,
		// };

		req.session.auth = userToken;

		res.status(200).send(existingUser);
	}
);

export { router as signinRouter };
