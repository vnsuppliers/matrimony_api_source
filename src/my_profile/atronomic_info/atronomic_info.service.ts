import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AstronomicInfoEntity } from 'src/entities/astronomic_info.entity';
import { CreateAstronomicInfoDto } from 'src/dto/astronomic_info.dto';

@Injectable()
export class AstronomicInfoService {
  constructor(
    @InjectRepository(AstronomicInfoEntity)
    private readonly astronomicInfoRepo: Repository<AstronomicInfoEntity>,
  ) {}

  // ================= GET BY USER ID =================
  public async get_astro_info_by_user_id(user_id: number) {
    const astro = await this.astronomicInfoRepo
      .createQueryBuilder('astro')
      .where('astro.user_id = :user_id', { user_id })
      .getOne();

    if (astro && astro.time_of_birth) {
      astro.time_of_birth = String(astro.time_of_birth).trim();
    }

    return astro;
  }

  // ================= CREATE OR UPDATE =================
  public async update_create_astro_info(
    user_id: number,
    dto: CreateAstronomicInfoDto,
  ) {
    try {
      // Intelligently maps flexible user strings into valid DB Time layouts
      const dbTimeFormat = this.convertTo24HourFormat(dto.time_of_birth);

      const payload = {
        ...dto,
        zodiac_sign: dto.zodiac_sign || null,
        moon_sign: dto.moon_sign || null,
        padam: dto.padam || null,
        place_of_birth: dto.place_of_birth || null,
        time_of_birth: dbTimeFormat,
        gothram: dto.gothram || null,
        astro_notes: dto.astro_notes || null,
        status: dto.status ?? 1,
      };

      let astro = await this.astronomicInfoRepo.findOne({
        where: { user_id },
      });

      if (!astro) {
        astro = this.astronomicInfoRepo.create({
          user_id,
          ...payload,
        });

        await this.astronomicInfoRepo.save(astro);
        return { message: 'Astro info created successfully' };
      }

      await this.astronomicInfoRepo.update({ user_id }, payload);
      return { message: 'Astro info updated successfully' };
    } catch (error) {
      console.log('ASTRO INFO ERROR =>', error);
      throw error;
    }
  }

  // ================= HELPER: INTELLIGENT TIME PARSER =================
  private convertTo24HourFormat(
    timeStr: string | null | undefined,
  ): string | null {
    if (!timeStr) return null;

    const cleanedTime = timeStr.trim().toUpperCase();

    // 1. If it's already a standard 24-hour style string (e.g., "14:00" or "14:00:00")
    if (/^\d{1,2}:\d{2}(:\d{2})?$/.test(cleanedTime)) {
      const parts = cleanedTime.split(':');
      const hh = parts[0].padStart(2, '0');
      const mm = parts[1];
      const ss = parts[2] || '00';
      return `${hh}:${mm}:${ss}`;
    }

    // 2. Parse ultra-flexible layouts with AM/PM (e.g., "10AM", "10:00am", "10:00 AM", "7PM")
    const match = cleanedTime.match(
      /^(\d{1,2})(?::(\d{2}))?(?::(\d{2}))?\s*(AM|PM)$/,
    );
    if (!match) {
      throw new BadRequestException('Invalid time layout structure provided.');
    }

    let [_, hoursStr, minutesStr, secondsStr, modifier] = match;
    let hours = parseInt(hoursStr, 10);
    let minutes = minutesStr || '00';
    let seconds = secondsStr || '00';

    if (modifier === 'PM' && hours < 12) {
      hours += 12;
    }
    if (modifier === 'AM' && hours === 12) {
      hours = 0;
    }

    const formattedHours = String(hours).padStart(2, '0');
    return `${formattedHours}:${minutes}:${seconds}`;
  }
}
