import { Request, Response } from 'express';
import { MiddlewareFn, NextFn } from 'type-graphql';
import jwt from 'jsonwebtoken';

type MyContext = {
	req: Request;
	res: Response;
	payload?: string;
};

const isAuth: MiddlewareFn<MyContext> = ({ context }, next: NextFn) => {
	const { token } = context.req.headers;

	if (!token) {
		throw new Error('Not authenticated');
	}
	try {
		const payload = jwt.verify(token as string, process.env.jwt_key || '');
		context.payload = payload as any;
	} catch (err) {
		throw new Error('Not authenticated');
	}
	return next();
};

export default isAuth;
