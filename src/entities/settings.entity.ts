import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('settings')
export class SettingsEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  app_name: string;

  @Column({
    nullable: true,
  })
  app_logo: string;

  @Column({
    nullable: true,
  })
  app_email: string;

  @Column({
    nullable: true,
  })
  app_phone: string;

  @Column({
    type: 'text',
    nullable: true,
  })
  app_address: string;

  @Column({
    nullable: true,
  })
  app_website: string;

  @Column({
    nullable: true,
  })
  smtp_host: string;

  @Column({
    nullable: true,
  })
  smtp_port: number;

  @Column({
    nullable: true,
  })
  smtp_username: string;

  @Column({
    nullable: true,
  })
  smtp_password: string;

  @Column({
    nullable: true,
  })
  smtp_encryption: string;

  @Column({
    nullable: true,
  })
  smtp_from_name: string;

  @Column({
    nullable: true,
  })
  smtp_from_email: string;

  @Column({
    nullable: true,
  })
  support_email: string;

  @Column({
    nullable: true,
  })
  facebook_url: string;

  @Column({
    nullable: true,
  })
  instagram_url: string;

  @Column({
    nullable: true,
  })
  twitter_url: string;

  @Column({
    nullable: true,
  })
  linkedin_url: string;

  @Column({
    nullable: true,
  })
  youtube_url: string;

  @Column({
    default: '#B71C1C',
  })
  primary_color: string;

  @Column({
    default: '#880E4F',
  })
  secondary_color: string;

  @Column({
    nullable: true,
  })
  copyright_text: string;

  @Column({ default: true })
  status: boolean;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
