import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { PaymentsEntity } from '../payments/payment.entity';
import { OneToMany } from 'typeorm';
import { UserSubscriptionsEntity } from './user_subscription.entity';

@Entity('subscription_plans')
export class SubscriptionPlanEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'varchar',
    length: 100,
  })
  name: string;

  @Column({
    type: 'text',
    nullable: true,
  })
  description: string;

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
    default: 0,
  })
  price: number;

  @Column({
    type: 'int',
  })
  duration_days: number;

  @Column({
    type: 'smallint',
    default: 1,
    comment: '1 = Active, 0 = Inactive',
  })
  status: number;

  @Column({ type: 'simple-json', nullable: true })
  specifications: string[];

  @CreateDateColumn({
    type: 'timestamp',
  })
  created_at: Date;

  @UpdateDateColumn({
    type: 'timestamp',
  })
  updated_at: Date;
  @OneToMany(() => PaymentsEntity, (payment) => payment.plan)
  payments: PaymentsEntity[];
  @OneToMany(() => UserSubscriptionsEntity, (subscription) => subscription.plan)
  subscriptions: UserSubscriptionsEntity[];
}
