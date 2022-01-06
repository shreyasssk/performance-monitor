import { Request, Response, NextFunction } from 'express';

export = (req: Request, res: Response, next: NextFunction) => {
	if (!req.session.auth) {
		return res.status(401).send({
			successs: false,
			message: 'Please login to access this info.',
		});
	}

	next();
};
