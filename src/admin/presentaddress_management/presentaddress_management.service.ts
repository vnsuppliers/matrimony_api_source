import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PresentAddressEntity } from 'src/entities/present_address.entity';
import { User } from 'src/entities/user.entity';
import { Repository } from 'typeorm';
import { PresentAddressDto } from 'src/dto/present_address.dto';

@Injectable()
export class PresentaddressManagementService {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    @InjectRepository(PresentAddressEntity)
    private readonly presentAddressRepo: Repository<PresentAddressEntity>,
  ) {}

  public async update_create(targetUserId: number, payload: PresentAddressDto) {
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
      const existing = await this.presentAddressRepo.findOne({
        where: { id: recordId, user_id: targetUserId },
        loadEagerRelations: false,
      });
      if (!existing) {
        throw new NotFoundException(
          `Present address record ID ${recordId} not found for User ID: ${targetUserId}`,
        );
      }

      await this.presentAddressRepo.update(
        { id: recordId, user_id: targetUserId },
        updateCreateData,
      );

      const updated = await this.presentAddressRepo.findOne({
        where: { id: recordId },
      });

      return {
        message: 'Present address updated successfully',
        data: updated,
      };
    }

    const newAddress = this.presentAddressRepo.create({
      ...updateCreateData,
      user_id: targetUserId,
      created_at: new Date(),
    });

    const saved = await this.presentAddressRepo.save(newAddress);

    return {
      message: 'Present address created successfully',
      data: saved,
    };
  }

  public async deleteAddress(id: number) {
    const record = await this.presentAddressRepo.findOne({ where: { id } });
    if (!record) {
      throw new NotFoundException(
        `Present address record matching tracking id key ${id} not located.`,
      );
    }

    await this.presentAddressRepo.remove(record);
    return {
      message: 'Present address record structure dropped successfully.',
    };
  }
}
