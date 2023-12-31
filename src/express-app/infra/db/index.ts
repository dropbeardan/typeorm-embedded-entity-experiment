import 'dotenv/config';
import 'reflect-metadata';

import { DataSource } from 'typeorm';

export const AppDataSource = new DataSource({
	type: 'postgres',
	host: process.env.DB_HOST,
	port: Number(process.env.POSTGRES_PORT),
	username: process.env.POSTGRES_USER,
	password: process.env.POSTGRES_PASSWORD,
	database: process.env.POSTGRES_DB,
	synchronize: false,
	logging: false,
	entities: [`${__dirname}/entities/*.ts`],
	migrations: [`${__dirname}/migrations/*.ts`],
	migrationsTableName: 'migrations',
	subscribers: [],
});

export const initializeDataSource = async () => {
	await AppDataSource.initialize();
};
