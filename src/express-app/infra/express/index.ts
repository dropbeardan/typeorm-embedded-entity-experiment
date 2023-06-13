import express, {
	Express,
	NextFunction,
	Request,
	Response,
	Router,
} from 'express';

export const attachRoutes = (
	app: Express,
	path: string,
	routes: Array<{
		controller: (
			req: Request,
			res: Response,
			next?: NextFunction
		) => void | Promise<void>;
		method: string;
		path: string;
	}>
) => {
	const router = routes.reduce<Router>((currRouter: Router, nextRoute) => {
		currRouter[nextRoute.method](nextRoute.path, nextRoute.controller);
		return currRouter;
	}, Router());

	app.use(path, router);

	return app;
};

export const createApp = () => {
	const app = express();

	app.use(express.json());

	return app;
};

export const startApp = (app: Express, port: number) => {
	app.listen(port, () => {
		console.log(`App has started at port: ${port}`);
	});
};
