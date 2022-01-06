import express, { Request, Response } from 'express';
import passport from 'passport';
import jwt from 'jsonwebtoken';

const router = express.Router();

router.get('/auth/google/test', (req: Request, res: Response) => {
	res.send('Success!');
});

router.get(
	'/auth/google',
	passport.authenticate('google', {
		scope: ['profile', 'email'],
	})
);

router.get(
	'/auth/google/callback',
	passport.authenticate('google'),
	(req: any, res: Response) => {
		const { id, name, email } = req.user;

		const userToken = jwt.sign(
			{
				id,
				name,
				email,
			},
			String(process.env.SECRET_KEY)
		);

		req.session.auth = userToken;

		res.status(201).send(req.user);
	}
);

export { router as googleAuthRouter };
