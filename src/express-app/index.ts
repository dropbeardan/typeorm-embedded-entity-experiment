import 'dotenv/config';

import { initializeDataSource } from '@/express-app/infra/db';
import { attachRoutes, createApp, startApp } from '@/express-app/infra/express';

import healthzRoutes from '@/express-app/use-cases/healthz/healthz.controller';
import walletRoutes from '@/express-app/use-cases/wallet/wallet.controller';

const main = async () => {
	await initializeDataSource();

	const app = createApp();

	attachRoutes(app, '/healthz', healthzRoutes);
	attachRoutes(app, '/wallets', walletRoutes);

	startApp(app, Number(process.env.EXPRESS_APP_PORT));
};

main();
