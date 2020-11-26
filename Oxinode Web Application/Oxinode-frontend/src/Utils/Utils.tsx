import jwt from 'jsonwebtoken';

export const isAuth = async (): Promise<boolean> => {
	const token: string | null = localStorage.getItem('token');
	if (token) {
		const verified = jwt.decode(token);
		console.log(verified);
	}
	return false;
};
