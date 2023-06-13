import type { Request, Response } from 'express';

import WalletEntity from '@/express-app/infra/db/entities/wallet.entity';
import WalletRepository from '@/express-app/infra/db/repositories/wallet.repository';

import { sleep } from '@/express-app/utils/sleep';

export const addMoney = async (req: Request, res: Response) => {
	try {
		const walletRepository = WalletRepository.getRepository();

		const wallet = await walletRepository.findOne({
			where: {
				id: req.params.walletId,
			},
			relations: {
				moneys: true,
			},
		});

		if (!wallet) {
			throw new Error('Invalid wallet ID.');
		}

		await sleep(15000);

		const { money, wallet: happyWallet } = wallet.addMoney({
			amount: req.body.amount,
			type: req.body.type,
		});

		const persistedWallet = await walletRepository.save(happyWallet);

		res.json({ money, wallet: persistedWallet });
	} catch (err) {
		res.status(400).json({ error: err.message });
	}
};

export const createWallet = async (req: Request, res: Response) => {
	try {
		const walletRepository = WalletRepository.getRepository();

		const { wallet } = WalletEntity.create({ name: req.body.name });

		const persistedWallet = await walletRepository.save(wallet);

		res.json({ wallet: persistedWallet });
	} catch (err) {
		res.status(400).json({ error: err.message });
	}
};

export const spendMoney = async (req: Request, res: Response) => {
	try {
		const walletRepository = WalletRepository.getRepository();

		const wallet = await walletRepository.findOne({
			where: {
				id: req.params.walletId,
			},
			relations: {
				moneys: true,
			},
		});

		if (!wallet) {
			throw new Error('Invalid wallet ID.');
		}

		await sleep(15000);

		const { spent, wallet: sadWallet } = wallet.spendMoney({
			amount: req.body.amount,
		});

		const persistedWallet = await walletRepository.save(sadWallet);

		res.json({ spent, wallet: persistedWallet });
	} catch (err) {
		res.status(400).json({ error: err.message });
	}
};

export const deleteWallets = async (req: Request, res: Response) => {
	try {
		const walletRepository = WalletRepository.getRepository();

		await walletRepository.delete({});

		res.sendStatus(204);
	} catch (err) {
		res.status(400).json({ error: err.message });
	}
};

export const getWallets = async (req: Request, res: Response) => {
	try {
		const walletRepository = WalletRepository.getRepository();

		const wallets = await walletRepository.find({
			relations: {
				moneys: true,
			},
		});

		res.json({ wallets });
	} catch (err) {
		res.status(400).json({ error: err.message });
	}
};

export default [
	{
		controller: deleteWallets,
		method: 'delete',
		path: '/',
	},
	{
		controller: getWallets,
		method: 'get',
		path: '/',
	},
	{
		controller: createWallet,
		method: 'post',
		path: '/',
	},
	{
		controller: addMoney,
		method: 'post',
		path: '/:walletId/moneys',
	},
	{
		controller: spendMoney,
		method: 'post',
		path: '/:walletId/moneys/spend',
	},
];