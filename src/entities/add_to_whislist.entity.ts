import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

import { User } from './user.entity';

@Entity('add_to_whilist')
export class AddToWhilistEntity {
  @PrimaryGeneratedColumn()
  id: number;

  // user who added
  @ManyToOne(() => User, (user) => user.whilisted_by)
  @JoinColumn({ name: 'whilisted_by' })
  whilisted_by: User;

  // user added to wishlist
  @ManyToOne(() => User, (user) => user.whilisted_to)
  @JoinColumn({ name: 'whilisted_to' })
  whilisted_to: User;

  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updated_at: Date;
}
