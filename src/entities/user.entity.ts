import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  Index,
  CreateDateColumn,
  UpdateDateColumn,
  BeforeInsert,
  OneToMany,
  OneToOne,
  DeleteDateColumn,
} from 'typeorm';

import * as bcrypt from 'bcrypt';
import { MemberEntity } from './member.entity';
import { EducationInfoEntity } from './education_info.entity';
import { ProfessionInfoEntity } from './profession_info.entity';
import { FamilyInfoEntity } from './family_info.entity';
import { SiblingsInfoEntity } from './siblings_info_entity';
import { LifestyleInfoEntity } from './lifestyle_info.entity';
import { PhysicalAttributesEntity } from './physical_attributes.entity';
import { HobbiesInfoEntity } from './hobbies_info.entity';
import { RelativesInfoEntity } from './relatives_info.entity';
import { PresentAddressEntity } from './present_address.entity';
import { PermanentAddressEntity } from './permanent_address_info.entity';
import { AstronomicInfoEntity } from './astronomic_info.entity';
import { AddToWhilistEntity } from './add_to_whislist.entity';
import { AddToBookmarkEntity } from './add_to_bookmarks.entity';
import { InterestsEntity } from './interests.entity';
import { ShortlistEntity } from './shortlist.entity';
import { NotificationEntity } from './notification.entity';
import { PaymentsEntity } from './payments/payment.entity';
import { UserSubscriptionsEntity } from './payments/user_subscription.entity';
import { BlockProfileEntity } from './block_profile.entity';
import { SuccessStoryEntity } from './success_story.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ length: 255 })
  first_name!: string;

  @Column({ length: 255 })
  last_name!: string;

  @Index()
  @Column({ length: 255, unique: true })
  email!: string;

  @Index()
  @Column({ length: 255 })
  phone!: string;

  @Column()
  password!: string;

  @Index()
  @Column({ default: 1 })
  is_online!: number;

  // CONTINUING WITH THIS: 0 = Pending/Unverified, 1 = Verified/Approved
  @Index()
  @Column({ default: 0 })
  is_verified!: number;

  @Column({ default: 0 })
  is_premium!: number;

  @Column({ type: 'smallint', default: 0 })
  role_id!: number;

  @Column({ nullable: true })
  account_status: string;  // 'ACTIVE', 'BLOCKED', 'SUSPEND', 'DELETE' etc...

  @Column({ type: 'text', nullable: true })
  account_status_message: string;

  @CreateDateColumn({ type: 'timestamp' })
  created_at!: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updated_at!: Date;

  @DeleteDateColumn({ type: 'timestamp', nullable: true })
  deleted_at!: Date;

  @BeforeInsert()
  async hashPassword(): Promise<void> {
    this.password = await bcrypt.hash(this.password, 10);
  }

  // one user can have multiple members
  @OneToMany(() => MemberEntity, (member) => member.user)
  members!: MemberEntity[];

  // one user can have multiple education info entries
  @OneToMany(() => EducationInfoEntity, (edu) => edu.user)
  education_info!: EducationInfoEntity[];

  // one user can have multiple profession info entries
  @OneToMany(() => ProfessionInfoEntity, (pi) => pi.user)
  professionInfos: ProfessionInfoEntity[];

  @OneToOne(() => FamilyInfoEntity, (familyInfo) => familyInfo.user)
  familyInfo: FamilyInfoEntity;

  @OneToMany(() => SiblingsInfoEntity, (siblingsInfo) => siblingsInfo.user)
  siblings_info: SiblingsInfoEntity[];

  @OneToOne(() => LifestyleInfoEntity, (lifestyleInfo) => lifestyleInfo.user)
  lifestyleInfo: LifestyleInfoEntity;

  @OneToOne(
    () => PhysicalAttributesEntity,
    (physical_attributes) => physical_attributes.user,
  )
  physical_attributes: PhysicalAttributesEntity;

  @OneToMany(() => HobbiesInfoEntity, (hobbies_info) => hobbies_info.user)
  hobbies_info: HobbiesInfoEntity[];

  @OneToMany(() => RelativesInfoEntity, (relative_info) => relative_info.user)
  relative_info: RelativesInfoEntity[];

  @OneToOne(() => PresentAddressEntity, (pa) => pa.user)
  present_address: PresentAddressEntity;

  @OneToOne(() => PermanentAddressEntity, (pa) => pa.user)
  permanent_address: PermanentAddressEntity;

  @OneToOne(() => AstronomicInfoEntity, (astro) => astro.user)
  astro: AstronomicInfoEntity;

  @OneToMany(() => AddToWhilistEntity, (wishlist) => wishlist.whilisted_by)
  whilisted_by: AddToWhilistEntity[];

  @OneToMany(() => AddToWhilistEntity, (wishlist) => wishlist.whilisted_to)
  whilisted_to: AddToWhilistEntity[];

  @OneToMany(() => AddToBookmarkEntity, (bookmark) => bookmark.sender)
  sent_bookmark: AddToBookmarkEntity[];

  @OneToMany(() => AddToBookmarkEntity, (bookmark) => bookmark.receiver)
  received_bookmarks: AddToBookmarkEntity[];

  @OneToMany(() => InterestsEntity, (interest) => interest.interested_by)
  sent_interests: InterestsEntity[];

  @OneToMany(() => InterestsEntity, (interest) => interest.interested_to)
  received_interests: InterestsEntity[];

  @OneToMany(() => ShortlistEntity, (s) => s.shortlisted_by_user)
  shortlist_sent: ShortlistEntity[];

  @OneToMany(() => ShortlistEntity, (s) => s.shortlisted_to_user)
  shortlist_received: ShortlistEntity[];

  @OneToMany(() => NotificationEntity, (notifications) => notifications.user)
  notifcations: NotificationEntity[];

  @OneToMany(() => BlockProfileEntity, (block) => block.blockerUser)
  blocked_profiles: BlockProfileEntity[];

  @OneToMany(() => BlockProfileEntity, (block) => block.blockedUser)
  blocked_by_profiles: BlockProfileEntity[];

  @OneToMany(() => PaymentsEntity, (payment) => payment.user)
  payments: PaymentsEntity[];

  @OneToMany(() => UserSubscriptionsEntity, (subscription) => subscription.user)
  subscriptions: UserSubscriptionsEntity[];

  @OneToMany(() => SuccessStoryEntity, (story) => story.user)
  success_stories: SuccessStoryEntity[];

}
