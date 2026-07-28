import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AddToWhilistEntity } from 'src/entities/add_to_whislist.entity';
import { Repository } from 'typeorm';

@Injectable()
export class AddToWhislistService {
  constructor(
    @InjectRepository(AddToWhilistEntity)
    private readonly addToWhilistRepo: Repository<AddToWhilistEntity>,
  ) {}

  public async get_whilist(userId: number) {
    const whilist = await this.addToWhilistRepo.find({
      where: {
        whilisted_by: {
          id: userId,
        },
      },
      relations: ['whilisted_to'],
    });

    return whilist;
  }

  public async add_to_whilist(userId: number, whilisted_to: number) {
    if (userId === whilisted_to) {
      throw new BadRequestException('Cannot add yourself to wishlist');
    }

    const exists = await this.addToWhilistRepo.findOne({
      where: {
        whilisted_by: {
          id: userId,
        },
        whilisted_to: {
          id: whilisted_to,
        },
      },
    });

    if (exists) {
      throw new ConflictException('User already exists in wishlist');
    }

    const wishlist = this.addToWhilistRepo.create({
      whilisted_by: {
        id: userId,
      },
      whilisted_to: {
        id: whilisted_to,
      },
    });
    // console.log('Add', wishlist);

    await this.addToWhilistRepo.save(wishlist);

    return {
      success: true,
      message: 'Added to wishlist successfully',
    };
  }

  public async remove_whilist(userId: number, whilisted_to: number) {
    const result = await this.addToWhilistRepo.delete({
      whilisted_by: {
        id: userId,
      },
      whilisted_to: {
        id: whilisted_to,
      },
    });

    if (result.affected === 0) {
      throw new NotFoundException('User does not exist in wishlist');
    }

    return {
      success: true,
      message: 'Removed from wishlist successfully',
    };
  }
}
