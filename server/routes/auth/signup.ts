import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import jwt from 'jsonwebtoken';

import { User } from '../../models/User-Jwt';
import { BadRequestError, ValidateRequest } from '@ssktickets/common';

const router = express.Router();

router.post(
	'/api/auth/register',
	[
		body('email').isEmail().withMessage('Email must be valid!'),
		body('password')
			.trim()
			.isLength({ min: 6, max: 24 })
			.withMessage('Password must be between 6 and 24 characters'),
		body('name').notEmpty().withMessage('Name cannot be empty!'),
	],
	ValidateRequest,
	async (req: Request, res: Response) => {
		const { name, email, password } = req.body;

		// Check if user is already registered to the database
		const emailExist = await User.findOne({ email });

		if (emailExist) {
			res.status(401).send('Email already registered!');
		}

		const user = User.build({ name, email, password });
		await user.save();

		// Generate JWT
		const userToken = jwt.sign(
			{
				id: user.id,
				email: user.email,
				name: user.name,
			},
			process.env.SECRET_KEY!
		);

		// Store it on session object
		req.session.auth = userToken;

		res.status(201).send(user);
	}
);

export { router as signupRouter };
