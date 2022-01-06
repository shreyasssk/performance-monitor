import express, { Request, Response } from 'express';
import { currentUser } from '../../middlewares/getCurrentUser';
import requestLogin from '../../middlewares/requestLogin';

const router = express.Router();

router.get(
	'/api/test',
	currentUser,
	requestLogin,
	async (req: Request, res: Response) => {
		res.send('Hello');
	}
);

export { router as protectedUserRouter };
