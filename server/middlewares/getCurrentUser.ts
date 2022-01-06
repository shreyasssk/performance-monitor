import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

interface UserPayload {
	auth: string;
}

// declare global {
// 	namespace Express {
// 		interface Request {
// 			session?: UserPayload;
// 		}
// 	}
// }

declare module 'express-session' {
	interface SessionData {
		auth: UserPayload | string;
	}
}

export const currentUser = (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	if (!req.session.auth) {
		return next();
	}

	try {
		const payload = jwt.verify(
			req.session.id,
			String(process.env.SECRET_KEY)
		) as UserPayload;
		req.session.auth = payload;
	} catch (err) {}

	next();
};
