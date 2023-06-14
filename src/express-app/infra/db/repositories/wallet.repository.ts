import { AppDataSource } from '@/express-app/infra/db';

import WalletEntity from '@/express-app/infra/db/entities/wallet.entity';

export default class WalletRepository {
	static getRepository() {
		return AppDataSource.getRepository(WalletEntity);
	}
}
