import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { UserModule } from './user/user.module';
import { CountriesModule } from './admin/master/countries/countries.module';
import { StatesModule } from './admin/master/states/states.module';
import { CitiesModule } from './admin/master/cities/cities.module';
import { GenderModule } from './admin/master/gender/gender.module';
import { AuthModule } from './auth/auth.module';
import { BasicInfoModule } from './my_profile/basic_info/basic_info.module';
import { ReligionModule } from './admin/master/religion/religion.module';
import { MotherTongueModule } from './admin/master/mother_tongue/mother_tongue.module';
import { ReligiousInfoModule } from './my_profile/religious_info/religious_info.module';
import { EducationInfoModule } from './my_profile/education_info/education_info.module';
import { EducationModule } from './admin/master/education/education.module';
import { SpecialisationModule } from './admin/master/specialisation/specialisation.module';
import { ProfessionMasterModule } from './admin/master/profession_master/profession_master.module';
import { DesignationMasterModule } from './admin/master/designation_master/designation_master.module';
import { ProfessionInfoModule } from './my_profile/profession_info/profession_info.module';
import { FamilyInfoModule } from './my_profile/family_info/family_info.module';
import { SiblingsInfoModule } from './my_profile/siblings_info/siblings_info.module';
import { LifestyleInfoModule } from './my_profile/lifestyle_info/lifestyle_info.module';
import { PhysicalAttributesModule } from './my_profile/physical_attributes/physical_attributes.module';
import { HobbiesInfoModule } from './my_profile/hobbies_info/hobbies_info.module';
import { RelativesInfoModule } from './my_profile/relatives_info/relatives_info.module';
import { PresentAddressModule } from './my_profile/present_address/present_address.module';
import { PermanentAddressModule } from './my_profile/permanent_address/permanent_address.module';
import { AtronomicInfoModule } from './my_profile/atronomic_info/atronomic_info.module';
import { MembersListModule } from './members/members_list/members_list.module';
import { AddToWhislistModule } from './members/add_to_whislist/add_to_whislist.module';
import { AddToBookmarksModule } from './members/add_to_bookmarks/add_to_bookmarks.module';
import { ReportProfilesModule } from './members/report_profiles/report_profiles.module';
import { BlockProfileModule } from './members/block_profile/block_profile.module';
import { SendMessagesModule } from './members/send_messages/send_messages.module';
import { MatchedProfilesModule } from './members/matched_profiles/matched_profiles.module';
import { InterestsModule } from './members/interests/interests.module';
import { ShortlistModule } from './members/shortlist/shortlist.module';
import { ProfileVisitorsModule } from './members/profile_visitors/profile_visitors.module';
import { NotificationsModule } from './members/notifications/notifications.module';
import { ProfileSettingsModule } from './my_profile/profile_settings/profile_settings.module';
import { UsersListModule } from './admin/users-list/users-list.module';
import { SharedModule } from './shared/shared.module';
import { UserBasicInfoModule } from './admin/user_basic_info/user_basic_info.module';
import { PhysicalModule } from './admin/physical/physical.module';
import { EducationManagementModule } from './admin/education_management/education_management.module';
import { ProfessionManagementModule } from './admin/profession_management/profession_management.module';
import { FamilyManagementModule } from './admin/family_management/family_management.module';
import { SiblingManagementModule } from './admin/sibling_management/sibling_management.module';
import { RelativesManagementModule } from './admin/relatives_management/relatives_management.module';
import { PresentaddressManagementModule } from './admin/presentaddress_management/presentaddress_management.module';
import { PermanentaddressManagementModule } from './admin/permanentaddress_management/permanentaddress_management.module';
import { LifestyleManagementModule } from './admin/lifestyle_management/lifestyle_management.module';
import { HobbiesManagementModule } from './admin/hobbies_management/hobbies_management.module';
import { AstroManagementModule } from './admin/astro_management/astro_management.module';
import { ReportManagementModule } from './admin/report_management/report_management.module';
import { InterestManagementModule } from './admin/interest_management/interest_management.module';
import { ShortlistManagementModule } from './admin/shortlist_management/shortlist_management.module';
import { BlockManagementModule } from './admin/block_management/block_management.module';
import { VisitorManagementModule } from './admin/visitor_management/visitor_management.module';
import { MemberManagementModule } from './admin/member_management/member_management.module';
import { GalleryManagementModule } from './admin/gallery_management/gallery_management.module';
import { ProfileGalleryModule } from './my_profile/profile_gallery/profile_gallery.module';
import { MemberGalleryModule } from './members/member_gallery/member_gallery.module';
import { SubscriptionPlansModule } from './admin/master/subscription_plans/subscription_plans.module';
import { PaymentsModule } from './admin/payments/payments.module';
import { UserSubscriptionsModule } from './admin/user_subscriptions/user_subscriptions.module';
import { ScheduleModule } from '@nestjs/schedule';
import { ChatMonitorModule } from './admin/chat_monitor/chat_monitor.module';
import { AnalyticsModule } from './admin/analytics/analytics.module';
import { EmailModule } from './email/email.module';
import { TermsConditionsModule } from './admin/terms_conditions/terms_conditions.module';
import { PrivacyPolicyModule } from './admin/master/privacy_policy/privacy_policy.module';
import { SuccessStoryModule } from './my_profile/success_story/success_story.module';
import { ApproveSuccessStoryModule } from './admin/approve_success_story/approve_success_story.module';

@Module({
  imports: [
    //  ENV
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ScheduleModule.forRoot(),

    //  DB (MSSQL)
  TypeOrmModule.forRootAsync({
    inject: [ConfigService],
    useFactory: (config: ConfigService) => {
      console.log('DB_HOST:', config.get('DB_HOST'));
      console.log('DB_PORT:', config.get('DB_PORT'));
      console.log('DB_USER:', config.get('DB_USER'));
      console.log('DB_NAME:', config.get('DB_NAME'));
  
      return {
        type: 'postgres',
        host: config.get('DB_HOST'),
        port: parseInt(config.get('DB_PORT') || '5432'),
        username: config.get('DB_USER'),
        password: config.get('DB_PASSWORD'),
        database: config.get('DB_NAME'),
        autoLoadEntities: true,
        synchronize: false,
        ssl: {
          rejectUnauthorized: false,
        },
      };
    },
  }),

    //  JWT
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        secret: config.get('JWT_SECRET_KEY'),
        signOptions: {
          expiresIn: config.get('JWT_EXPIRES_IN') || '1d',
        },
      }),
    }),

    UserModule,

    CountriesModule,

    StatesModule,

    CitiesModule,

    GenderModule,

    ReligionModule,

    AuthModule,

    BasicInfoModule,

    MotherTongueModule,

    ReligiousInfoModule,

    EducationInfoModule,

    EducationModule,

    SpecialisationModule,

    ProfessionMasterModule,

    DesignationMasterModule,

    ProfessionInfoModule,

    FamilyInfoModule,

    SiblingsInfoModule,

    LifestyleInfoModule,

    PhysicalAttributesModule,

    HobbiesInfoModule,

    RelativesInfoModule,

    PresentAddressModule,

    PermanentAddressModule,

    AtronomicInfoModule,

    MembersListModule,

    AddToWhislistModule,

    AddToBookmarksModule,

    ReportProfilesModule,

    BlockProfileModule,

    SendMessagesModule,

    MatchedProfilesModule,

    InterestsModule,

    ShortlistModule,

    ProfileVisitorsModule,

    NotificationsModule,

    ProfileSettingsModule,

    UsersListModule,

    SharedModule,

    UserBasicInfoModule,

    PhysicalModule,

    EducationManagementModule,

    ProfessionManagementModule,

    FamilyManagementModule,

    SiblingManagementModule,

    RelativesManagementModule,

    PresentaddressManagementModule,

    PermanentaddressManagementModule,

    LifestyleManagementModule,

    HobbiesManagementModule,

    AstroManagementModule,

    ReportManagementModule,

    InterestManagementModule,

    ShortlistManagementModule,

    BlockManagementModule,

    VisitorManagementModule,

    MemberManagementModule,

    GalleryManagementModule,

    ProfileGalleryModule,

    MemberGalleryModule,

    SubscriptionPlansModule,

    PaymentsModule,

    UserSubscriptionsModule,

    ChatMonitorModule,

    AnalyticsModule,

    EmailModule,

    TermsConditionsModule,

    PrivacyPolicyModule,

    SuccessStoryModule,

    ApproveSuccessStoryModule,
  ],
})
export class AppModule {}
