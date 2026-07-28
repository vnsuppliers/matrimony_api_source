import {
  Injectable,
  BadRequestException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../entities/user.entity';
import { Repository } from 'typeorm';
import { RegistrationDto } from 'src/dto/registration.dto';
import { MemberEntity } from 'src/entities/member.entity';
import { PresentAddressEntity } from 'src/entities/present_address.entity';
import * as bcrypt from 'bcrypt';
import { EmailService } from 'src/email/email.service';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,

    @InjectRepository(MemberEntity)
    private readonly memberRepo: Repository<MemberEntity>,

    @InjectRepository(PresentAddressEntity)
    private readonly presentAddressRepo: Repository<PresentAddressEntity>,

    // Email service to send emails.
    private readonly emailService: EmailService,
  ) {}

  // ================= UNIQUE MEMBER ID =================
  private async generateUniqueMemberId(): Promise<string> {
    let memberId: string;

    while (true) {
      const year = new Date().getFullYear(); // 2026
      const random = Math.floor(1000 + Math.random() * 9000); // 4 digits
      memberId = `${year}${random}`;

      const exists = await this.memberRepo.findOne({
        where: { member_id: memberId },
      });

      if (!exists) break;
    }

    return memberId;
  }

  // ================= REGISTRATION =================
  public async registration(registrationDto: RegistrationDto) {
    const existingUser = await this.userRepo.findOne({
      where: { email: registrationDto.email },
    });

    if (existingUser) {
      throw new BadRequestException('User already exists');
    }

    //  SAVE USER
    const newUser = await this.userRepo.save(
      this.userRepo.create({
        first_name: registrationDto.first_name,
        last_name: registrationDto.last_name,
        email: registrationDto.email,
        phone: registrationDto.phone,
        password: registrationDto.password,
      }),
    );

    // GENERATE MEMBER ID
    const memberId = await this.generateUniqueMemberId();

    //  SAVE MEMBER
    const member = this.memberRepo.create({
      user: newUser,
      member_id: memberId,
      gender_id: registrationDto.gender_id,
      religion_id: registrationDto.religion_id,
      mother_tongue_id: registrationDto.mother_tongue_id,
      about: registrationDto.about,
      date_of_birth: registrationDto.date_of_birth,
    });

    // SAVE ADDRESS
    const presentAddress = this.presentAddressRepo.create({
      user_id: newUser.id,
      address_line1: registrationDto.address_line1,
      address_line2: registrationDto.address_line2,
      country_id: registrationDto.country_id,
      state_id: registrationDto.state_id,
      city_id: registrationDto.city_id,
    });

    await this.memberRepo.save(member);
    await this.presentAddressRepo.save(presentAddress);

    //  Send welcome email.
    await this.emailService.send('registration_success', newUser.email, {
      first_name: newUser.first_name,
      last_name: newUser.last_name,
      email: newUser.email,
      member_id: member.member_id,
      created_at: member.created_at,
      login_url: `${process.env.FRONTEND_URL}/login`,
    });

    return newUser;
  }

  // get email.
  public async find_by_email(email: string) {
    return this.userRepo.findOne({ where: { email: email } });
  }

  //Validate user.
  public async validate_user(email: string, password: string) {
    const user = await this.userRepo.findOne({
      where: { email },
      withDeleted: true, // Pulls user layout structures even if soft-deleted
    });

    if (!user) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid email or password');
    }

    return user;
  }

  public async findMemberByUserId(userId: number) {
    return await this.memberRepo.findOne({
      where: { user: { id: userId } }, // Uses the 'user' relation
    });
  }

  /**
   * Standalone query to fetch active or soft-deleted records directly by user primary key ID
   */
  public async findUserById(
    id: number,
    options?: { withDeleted?: boolean },
  ): Promise<User | null> {
    return await this.userRepo.findOne({
      where: { id },
      withDeleted: options?.withDeleted ?? false,
    });
  }
}
