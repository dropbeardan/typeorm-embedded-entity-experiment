import type { Request, Response } from 'express';

export const getHealthCheck = (req: Request, res: Response) => {
	res.sendStatus(200);
};

export default [
	{
		controller: getHealthCheck,
		method: 'get',
		path: '/',
	},
];
