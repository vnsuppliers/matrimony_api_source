import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

import { SubscriptionPlanEntity } from './subscription_plan.entity';
import { User } from '../user.entity';

@Entity('payments')
export class PaymentsEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int' })
  user_id: number;

  @Column({ type: 'int' })
  plan_id: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  amount: number;

  @Column({ type: 'varchar', length: 10, default: 'INR' })
  currency: string;

  @Column({ type: 'varchar', length: 50, default: 'razorpay' })
  payment_gateway: string;

  @Column({ type: 'varchar', length: 255, nullable: true, unique: true })
  gateway_order_id: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  gateway_payment_id: string;

  @Column({ type: 'text', nullable: true })
  gateway_signature: string;

  @Column({ type: 'varchar', length: 20, default: 'pending' })
  status: string;

  @ManyToOne(() => User, (user) => user.payments, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => SubscriptionPlanEntity, (plan) => plan.payments, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'plan_id' })
  plan: SubscriptionPlanEntity;

  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updated_at: Date;
}
