import express, { Request, Response } from 'express';

const router = express.Router();

router.get('/api/auth/logout', (req: Request, res: Response) => {
	req.session.destroy(function (err) {
		res.send({
			success: true,
			message: 'Successfully logged out.',
			error: err,
		});
	});
	req.logOut();

	// res.send({
	// 	success: true,
	// 	message: 'Successfully logged out.',
	// });
});

export { router as signoutRouter };
