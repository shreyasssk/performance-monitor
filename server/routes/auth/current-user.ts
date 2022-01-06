import express, { Request, Response } from 'express';
import { currentUser } from '../../middlewares/getCurrentUser';

const router = express.Router();

router.get(
	'/api/auth/currentuser',
	// currentUser,
	async (req: Request, res: Response) => {
		res.send({ currentUser: req.session || null });
		console.log(req.session);
	}
);

export { router as currentUserRouter };
