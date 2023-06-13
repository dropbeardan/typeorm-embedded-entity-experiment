import { ascend, map, pipe, prop, sort, sum, without } from 'ramda';
import {
	Column,
	CreateDateColumn,
	Entity,
	OneToMany,
	PrimaryGeneratedColumn,
	UpdateDateColumn,
} from 'typeorm';

import MoneyEntity from '@/express-app/infra/db/entities/money.entity';

@Entity('wallet')
export default class Wallet {
	@PrimaryGeneratedColumn('uuid')
	id: string;

	@Column()
	name: string;

	@OneToMany(() => MoneyEntity, (money) => money.wallet, {
		cascade: true,
	})
	moneys: MoneyEntity[];

	@CreateDateColumn()
	createdAt: Date;

	@UpdateDateColumn()
	updatedAt: Date;

	static create(params: { name: string }) {
		if (!params.name) {
			throw new Error('Wallet name is required.');
		}

		const wallet = new Wallet();

		wallet.name = params.name;

		return { wallet };
	}

	addMoney(params: { amount: number; type: string }) {
		if (this.moneys.length > 5) {
			throw new Error('Wallet too fat...');
		}

		const { money: newMoney } = MoneyEntity.create({
			amount: params.amount,
			type: params.type,
		});

		this.moneys = [...this.moneys, newMoney];

		return { money: newMoney, wallet: this };
	}

	spendMoney(params: { amount: number }) {
		if (params.amount < 0) {
			throw new Error('Amount has to be greater than 0.');
		}

		const sortedMoneys = sort(ascend(prop('amount')), this.moneys);

		const walletTotal = pipe(map(prop('amount')), sum)(sortedMoneys);

		if (params.amount > walletTotal) {
			throw new Error('Cant afford, inflation too high...');
		}

		const { remaining, spent } = sortedMoneys.reduce(
			(currStatus, nextMoney) =>
				currStatus.outstanding <= 0
					? currStatus
					: {
							outstanding: currStatus.outstanding - nextMoney.amount,
							remaining: without([nextMoney], currStatus.remaining),
							spent: [...currStatus.spent, nextMoney],
					  },
			{ outstanding: params.amount, remaining: sortedMoneys, spent: [] }
		);

		this.moneys = remaining;

		return { spent, wallet: this };
	}
}
