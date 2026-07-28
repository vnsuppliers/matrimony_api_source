import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PermanentAddressEntity } from 'src/entities/permanent_address_info.entity';
import { User } from 'src/entities/user.entity';
import { Repository } from 'typeorm';
import { PermanentAddressDto } from 'src/dto/permanent_address.dto';

@Injectable()
export class PermanentaddressManagementService {
  constructor(
    @InjectRepository(User) private readonly userRepo: Repository<User>,
    @InjectRepository(PermanentAddressEntity)
    private readonly permanentAddressRepo: Repository<PermanentAddressEntity>,
  ) {}

  public async update_create(
    targetUserId: number,
    payload: PermanentAddressDto,
  ) {
    const user = await this.userRepo.findOne({
      where: { id: targetUserId },
    });
    if (!user) {
      throw new NotFoundException(
        `User does not exist with ID: ${targetUserId}`,
      );
    }

    const updateCreateData = {
      address_line1: payload.address_line1.trim(),
      address_line2: payload.address_line2?.trim() || null,
      city_id: payload.city_id,
      state_id: payload.state_id,
      country_id: payload.country_id,
      pincode: payload.pincode.trim(),
      status: payload.status,
      updated_at: new Date(),
    };

    const recordId = payload.id ? Number(payload.id) : undefined;

    if (recordId) {
      const existing = await this.permanentAddressRepo.findOne({
        where: {
          id: recordId,
          user_id: targetUserId,
        },
        loadEagerRelations: false,
      });
      if (!existing) {
        throw new NotFoundException(
          `Permanent address record ID ${recordId} not found for User ID: ${targetUserId}`,
        );
      }

      await this.permanentAddressRepo.update(
        { id: recordId, user_id: targetUserId },
        updateCreateData,
      );

      const updated = await this.permanentAddressRepo.findOne({
        where: { id: recordId },
      });

      return {
        message: 'Permanent address updated successfully',
        data: updated,
      };
    }

    const newAddress = this.permanentAddressRepo.create({
      ...updateCreateData,
      user_id: targetUserId,
      created_at: new Date(),
    });

    const saved = await this.permanentAddressRepo.save(newAddress);

    return {
      message: 'Permanent address created successfully',
      data: saved,
    };
  }

  public async deleteAddress(id: number) {
    const record = await this.permanentAddressRepo.findOne({ where: { id } });
    if (!record) {
      throw new NotFoundException(
        `Permanent address record target not found for ID: ${id}`,
      );
    }

    await this.permanentAddressRepo.remove(record);
    return { message: 'Permanent address record dropped successfully.' };
  }
}
