import {
	Column,
	CreateDateColumn,
	Entity,
	ManyToOne,
	PrimaryGeneratedColumn,
	UpdateDateColumn,
} from 'typeorm';

import WalletEntity from '@/express-app/infra/db/entities/wallet.entity';

@Entity('money')
export default class Money {
	@PrimaryGeneratedColumn('uuid')
	id: string;

	@ManyToOne(() => WalletEntity, (wallet) => wallet.moneys, {
		onDelete: 'CASCADE',
	})
	wallet: WalletEntity;

	@Column()
	type: string;

	@Column({ type: 'decimal' })
	amount: number;

	@CreateDateColumn()
	createdAt: Date;

	@UpdateDateColumn()
	updatedAt: Date;

	static create(params: { amount: number; type: string }) {
		if (!['note', 'coin'].includes(params.type)) {
			throw new Error('Not valid money.');
		}

		if (params.amount < 0) {
			throw new Error('That is debt, not money, you fool');
		}

		const money = new Money();

		money.amount = params.amount;
		money.type = params.type;

		return { money };
	}
}
